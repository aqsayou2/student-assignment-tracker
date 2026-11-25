
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

const form = document.getElementById("assignmentForm");
const assignmentList = document.getElementById("assignmentList");

// Save assignments to localStorage
function saveAssignments() {
    localStorage.setItem("assignments", JSON.stringify(assignments));
}

// Check whether a date is a real calendar date
function isValidDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsedDate = new Date(date + "T00:00:00");

    return !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
}

// Validate assignment information
function validateAssignment(title, course, dueDate, priority) {
    if (!title.trim()) {
        return "Assignment title cannot be empty.";
    }

    if (!course.trim()) {
        return "Course name cannot be empty.";
    }

    if (!isValidDate(dueDate)) {
        return "Please enter a valid due date.";
    }

    const validPriorities = ["Low", "Medium", "High"];

    if (!validPriorities.includes(priority)) {
        return "Please select a valid priority.";
    }

    return null;
}

// Determine assignment status
function getStatus(assignment) {
    if (assignment.completed) return "Completed";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(assignment.dueDate + "T00:00:00");

    if (due.getTime() === today.getTime()) return "Due Today";
    if (due < today) return "Overdue";

    return "Upcoming";
}

// Add a new assignment
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const course = document.getElementById("course").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    const error = validateAssignment(title, course, dueDate, priority);

    if (error) {
        alert(error);
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

// Display assignments
function renderAssignments() {
    assignmentList.innerHTML = "";

    const search = document.getElementById("search").value.toLowerCase();
    const filter = document.getElementById("filter").value;
    const sort = document.getElementById("sort").value;
    const priorityFilter = document.getElementById("priorityFilter").value;

    // Filter assignments
    const filtered = assignments.filter(assignment => {
        const matchesSearch =
            assignment.title.toLowerCase().includes(search) ||
            assignment.course.toLowerCase().includes(search);

        const matchesStatus =
            filter === "All" || getStatus(assignment) === filter;

        const matchesPriority =
            priorityFilter === "All" ||
            assignment.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sort assignments by due date
    const sorted = [...filtered].sort((a, b) => {
        if (sort === "latest") {
            return b.dueDate.localeCompare(a.dueDate);
        }

        return a.dueDate.localeCompare(b.dueDate);
    });

    if (sorted.length === 0) {
        assignmentList.innerHTML =
            '<p class="empty-message">No assignments found. Add one above! ♡</p>';
    }

    // Create an assignment card for each assignment
    sorted.forEach(assignment => {
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

        // Complete or undo assignment
        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent = assignment.completed ? "Undo" : "Complete";

        completeButton.addEventListener("click", () => {
            assignment.completed = !assignment.completed;

            saveAssignments();
            renderAssignments();
        });

        // Edit assignment
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

            const error = validateAssignment(
                newTitle,
                newCourse,
                newDate,
                assignment.priority
            );

            if (error) {
                alert(error);
                return;
            }

            assignment.title = newTitle.trim();
            assignment.course = newCourse.trim();
            assignment.dueDate = newDate;

            saveAssignments();
            renderAssignments();
        });

        // Delete assignment
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

    // Update dashboard counts
    document.getElementById("totalCount").textContent = assignments.length;

    document.getElementById("pendingCount").textContent =
        assignments.filter(item => !item.completed).length;

    document.getElementById("completedCount").textContent =
        assignments.filter(item => item.completed).length;
}

// Event listeners for search and filters
document.getElementById("search").addEventListener("input", renderAssignments);
document.getElementById("filter").addEventListener("change", renderAssignments);
document.getElementById("sort").addEventListener("change", renderAssignments);
document.getElementById("priorityFilter").addEventListener("change", renderAssignments);

// Display assignments when the page loads
renderAssignments();
