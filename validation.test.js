import { describe, it, expect } from "vitest";
import { validateAssignment, isValidDate } from "./validation.js";

describe("Assignment Validation", () => {
    it("accepts valid assignment information", () => {
        expect(validateAssignment("Homework", "Biology", "2026-12-01", "High")).toBe(null);
    });

    it("rejects an empty title", () => {
        expect(validateAssignment("", "Biology", "2026-12-01", "High")).toBe("Assignment title cannot be empty.");
    });

    it("rejects an empty course", () => {
        expect(validateAssignment("Homework", "", "2026-12-01", "High")).toBe("Course name cannot be empty.");
    });

    it("rejects an invalid date", () => {
        expect(isValidDate("2026-02-30")).toBe(false);
    });

    it("rejects an invalid priority", () => {
        expect(validateAssignment("Homework", "Biology", "2026-12-01", "Urgent")).toBe("Please select a valid priority.");
    });
});
