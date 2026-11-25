export function isValidDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

    const parsedDate = new Date(date + "T00:00:00");

    return !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
}

export function validateAssignment(title, course, dueDate, priority) {
    if (!title.trim()) return "Assignment title cannot be empty.";
    if (!course.trim()) return "Course name cannot be empty.";
    if (!isValidDate(dueDate)) return "Please enter a valid due date.";
    if (!["Low", "Medium", "High"].includes(priority)) {
        return "Please select a valid priority.";
    }

    return null;
}
