
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

const form = document.getElementById("assignmentForm");
const assignmentList = document.getElementById("assignmentList");

function saveAssignments() {
    localStorage.setItem("assignments", JSON.stringify(assignments));
}

function getStatus(assignment) {
    if (assignment.completed) return "Completed";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(assignment.dueDate + "T00:00:00");

    if (due.getTime() === today.getTime()) return "Due Today";
    if (due < today) return "Overdue";

    return "Upcoming";
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const course = document.getElementById("course").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    if (!title || !course || !dueDate) {
        alert("Please fill in all required fields.");
        return;
    }

    const assignment = {
        id: Date.now(),
        title,
        course,
        dueDate,
        priority,
        completed: false
    };

    assignments.push(assignment);
    saveAssignments();
    form.reset();
    renderAssignments();
});

function renderAssignments() {
    assignmentList.innerHTML = "";

    const search = document.getElementById("search").value.toLowerCase();
    const filter = document.getElementById("filter").value;

    const filtered = assignments.filter(assignment => {
        const matchesSearch =
            assignment.title.toLowerCase().includes(search) ||
            assignment.course.toLowerCase().includes(search);

        const matchesFilter =
            filter === "All" || getStatus(assignment) === filter;

        return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
        assignmentList.innerHTML =
            '<p class="empty-message">No assignments found. Add one above! ♡</p>';
    }

    filtered.forEach(assignment => {
        const card = document.createElement("div");
        card.className = "assignment-card";

        const heading = document.createElement("h3");
        heading.textContent = assignment.title;

        const course = document.createElement("p");
        course.textContent = "Course: " + assignment.course;

        const date = document.createElement("p");
        date.textContent = "Due: " + assignment.dueDate;

        const priority = document.createElement("p");
        priority.className = "priority";
        priority.textContent = "Priority: " + assignment.priority;

        const status = document.createElement("span");
        status.className = "status";
        status.textContent = getStatus(assignment);

        const actions = document.createElement("div");
        actions.className = "actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent = assignment.completed ? "Undo" : "Complete";

        completeButton.addEventListener("click", () => {
            assignment.completed = !assignment.completed;
            saveAssignments();
            renderAssignments();
        });

        const editButton = document.createElement("button");
        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            const newTitle = prompt("Assignment name:", assignment.title);
            if (newTitle === null) return;

            const newCourse = prompt("Course name:", assignment.course);
            if (newCourse === null) return;

            const newDate = prompt("Due date (YYYY-MM-DD):", assignment.dueDate);
            if (newDate === null) return;

            if (!newTitle.trim() || !newCourse.trim() ||
                !/^\d{4}-\d{2}-\d{2}$/.test(newDate) ||
                Number.isNaN(Date.parse(newDate + "T00:00:00")) ||
                new Date(newDate + "T00:00:00").toISOString().slice(0, 10) !== newDate) {
                alert("Please enter valid assignment information.");
                return;
            }

            assignment.title = newTitle.trim();
            assignment.course = newCourse.trim();
            assignment.dueDate = newDate;

            saveAssignments();
            renderAssignments();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            if (confirm("Delete this assignment?")) {
                assignments = assignments.filter(
                    item => item.id !== assignment.id
                );
                saveAssignments();
                renderAssignments();
            }
        });

        actions.append(completeButton, editButton, deleteButton);
        card.append(heading, course, date, priority, status, actions);
        assignmentList.appendChild(card);
    });

    document.getElementById("totalCount").textContent = assignments.length;

    document.getElementById("pendingCount").textContent =
        assignments.filter(item => !item.completed).length;

    document.getElementById("completedCount").textContent =
        assignments.filter(item => item.completed).length;
}

document.getElementById("search").addEventListener("input", renderAssignments);
document.getElementById("filter").addEventListener("change", renderAssignments);

renderAssignments();
