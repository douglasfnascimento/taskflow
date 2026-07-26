import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tasksFilePath = path.join(__dirname, '../data/tasks.json');

async function migrate() {
  console.log('Iniciando migração de dados...');
  try {
    const data = await fs.readFile(tasksFilePath, 'utf8');
    const tasks = JSON.parse(data);

    if (!Array.isArray(tasks) || tasks.length === 0) {
      console.log('Nenhuma tarefa encontrada em tasks.json para migrar.');
      process.exit(0);
    }

    console.log(`Encontradas ${tasks.length} tarefas no arquivo local.`);

    for (const task of tasks) {
      // Verificar se a tarefa já existe no banco para não duplicar se rodar duas vezes
      const checkQuery = 'SELECT id FROM tasks WHERE id = $1';
      const checkRes = await pool.query(checkQuery, [task.id]);

      if (checkRes.rows.length > 0) {
        console.log(`Tarefa ID ${task.id} ("${task.title}") já existe no banco. Pulando...`);
        continue;
      }

      const insertQuery = `
        INSERT INTO tasks (id, title, description, priority, status, tags, "dueDate", "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

      const values = [
        task.id,
        task.title,
        task.description || null,
        task.priority,
        task.status || 'todo',
        task.tags || [],
        task.dueDate || null,
        task.createdAt || new Date().toISOString()
      ];

      await pool.query(insertQuery, values);
      console.log(`Sucesso: Tarefa ID ${task.id} ("${task.title}") migrada.`);
    }

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();
