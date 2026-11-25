# StudySpace – Student Assignment Tracker

## Project Description
StudySpace is a web-based application that helps students organize and manage their academic responsibilities.

## Features
- Add assignments.
- Organize assignments by course.
- Set assignment due dates.
- Choose High, Medium, or Low priority.
- View Upcoming, Due Today, Overdue, and Completed assignments.
- Mark assignments as completed.
- Edit assignments.
- Delete assignments.
- Search and filter assignments.
- Filter assignments by priority.
- Sort assignments by due date.
- Validate assignment information before saving.
- Save assignments using browser localStorage.

## Technologies
- HTML
- CSS
- JavaScript
- Node.js
- Vitest

## Running the Application
Open index.html in a web browser.

## Running Automated Tests
Install dependencies:
npm install

Run tests:
npm test

## Project Files
- index.html – Application structure.
- style.css – Application styling.
- script.js – Assignment functionality.
- validation.js – Assignment validation logic.
- validation.test.js – Automated tests.

## Sprint 2 Goal
Improve StudySpace by helping students organize and prioritize assignments through due-date sorting, priority filtering, and input validation.

## SOLID Principles
- Single Responsibility Principle: Validation logic is separated into validation.js instead of being mixed into the application interface code.
- Open/Closed Principle: Assignment filtering and sorting are handled through separate conditions and functions, allowing additional filtering and sorting options to be added with limited changes to existing functionality.

## Known Limitations
Assignment information is stored in the browser's local storage. It is not synchronized across different devices or browsers.

## Developer
Aqsa Yousuf
