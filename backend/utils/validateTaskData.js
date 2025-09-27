export function validateTaskData({ title, description, status, priority, tags, dueDate }) {

    if (!title || typeof title !== "string" || !title.trim()) {
        throw new Error("Field 'title' is required and must be a non-empty string")
    }

    const s = status?.trim().toLowerCase()

    let p = Number(priority)
    if (isNaN(p) || p < 1 || p > 3) p = 1

    let t = []
    if (Array.isArray(tags)) {
        t = tags.map(tag => String(tag).trim())
    } else if (typeof tags === "string") {
        t = [tags.trim()]
    }

    if (t.length > 5) {
        throw new Error("You can add up to 5 tags only");
    }

    let d = null
    if (dueDate) {
        const date = new Date(dueDate)
        if (isNaN(date.getTime())) {
            throw new Error("Field 'dueDate' is invalid")
        }
        const now = new Date()
        if (date.getTime() <= now.getTime()) {
            throw new Error("Field 'dueDate' must be a future date")
        }
        d = date.toISOString()
    }


    return {
        title: title.trim(),
        description: description?.trim() || "",
        status: ["todo", "doing", "done"].includes(s) ? s : "todo",
        priority: p,
        tags: t,
        dueDate: d
    }
}