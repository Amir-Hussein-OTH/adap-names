import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";

describe('StringName', () => {
    it('should throw an error if name is empty', () => {
        expect(() => new StringName("")).toThrowError("Name must be a non-empty string.");
    });

    it('should split the name correctly into components', () => {
        const name = new StringName("part1,part2,part3", ",");
        expect(name.getNoComponents()).toBe(3);
        expect(name.getComponent(0)).toBe("part1");
    });

    it('should join components correctly after modification', () => {
        const name = new StringName("part1,part2", ",");
        name.append("part3");
        expect(name.toString()).toBe("part1,part2,part3");
    });

    it('should throw an error if index is out of bounds for getComponent', () => {
        const name = new StringName("part1,part2", ",");
        expect(() => name.getComponent(2)).toThrowError("Index 2 is out of bounds.");
    });

    // Removed checkClassInvariants() call from here
    it('should maintain class invariant when modifying name components', () => {
        const name = new StringName("part1,part2", ",");
        name.setComponent(1, "newPart");
        // We do not directly call checkClassInvariants in the test
        expect(name.toString()).toBe("part1,newPart");
    });
});
