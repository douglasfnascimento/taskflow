import { fileURLToPath } from 'node:url'

export function getFilePath(relativePath) {
    return fileURLToPath(new URL(relativePath, import.meta.url))
}