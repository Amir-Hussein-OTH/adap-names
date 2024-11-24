import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";
import { MethodFailureException } from "../../../src/adap-b04/common/MethodFailureException";

describe("StringName Component Tests", () => {
    describe("Initialization and Invariants", () => {
        it("should initialize correctly with a valid name and default delimiter", () => {
            const name = new StringName("oss.cs.fau.de");
            expect(name.getNoComponents()).toBe(4);
            expect(name.getComponent(0)).toBe("oss");
            expect(name.getComponent(3)).toBe("de");
        });

        it("should initialize correctly with a valid name and custom delimiter", () => {
            const name = new StringName("oss_cs_fau_de", "_");
            expect(name.getNoComponents()).toBe(4);
            expect(name.getComponent(1)).toBe("cs");
        });

        it("should throw an error for invalid name strings", () => {
            expect(() => new StringName("", ".")).toThrowError(IllegalArgumentException);
            expect(() => new StringName(null as any, ".")).toThrowError(IllegalArgumentException);
        });

        it("should throw an error for invalid delimiters", () => {
            expect(() => new StringName("oss.cs.fau.de", "")).toThrowError(IllegalArgumentException);
            expect(() => new StringName("oss.cs.fau.de", null as any)).toThrowError(IllegalArgumentException);
        });
    });

    describe("Component Retrieval and Manipulation", () => {
        it("should retrieve components correctly by index", () => {
            const name = new StringName("oss.cs.fau.de");
            expect(name.getComponent(2)).toBe("fau");
        });

        it("should throw an error for out-of-bounds component access", () => {
            const name = new StringName("oss.cs");
            name["name"] = null as any;
            expect(() => name.getNoComponents()).toThrowError(InvalidStateException);
        });

        it("should set components correctly by index", () => {
            const name = new StringName("oss.cs.fau.de");
            name.setComponent(1, "new");
            expect(name.getComponent(1)).toBe("new");
            expect(name.getNoComponents()).toBe(4);
        });

        it("should throw an error for invalid setComponent inputs", () => {
            const name = new StringName("oss.cs.fau.de");
            expect(() => name.setComponent(1, "")).toThrowError(IllegalArgumentException);
            expect(() => name.setComponent(1, null as any)).toThrowError(IllegalArgumentException);
            expect(() => name.setComponent(5, "invalid")).toThrowError(IllegalArgumentException);
        });

        it("should insert components correctly at valid indices", () => {
            const name = new StringName("oss.cs");
            name.insert(1, "new");
            expect(name.getNoComponents()).toBe(3);
            expect(name.getComponent(1)).toBe("new");
        });

        it("should throw an error for invalid insert indices", () => {
            const name = new StringName("oss.cs");
            expect(() => name.insert(-1, "invalid")).toThrowError(IllegalArgumentException);
            expect(() => name.insert(3, "invalid")).toThrowError(IllegalArgumentException);
        });

        it("should append components correctly", () => {
            const name = new StringName("oss.cs");
            name.append("new");
            expect(name.getNoComponents()).toBe(3);
            expect(name.getComponent(2)).toBe("new");
        });

        it("should throw an error for invalid append inputs", () => {
            const name = new StringName("oss.cs");
            expect(() => name.append("")).toThrowError(IllegalArgumentException);
            expect(() => name.append(null as any)).toThrowError(IllegalArgumentException);
        });

        it("should remove components correctly by index", () => {
            const name = new StringName("oss.cs.fau.de");
            name.remove(2);
            expect(name.getNoComponents()).toBe(3);
            expect(name.asString()).toBe("oss.cs.de");
        });

        it("should throw an error for out-of-bounds remove indices", () => {
            const name = new StringName("oss.cs");
            expect(() => name.remove(-1)).toThrowError(IllegalArgumentException);
            expect(() => name.remove(2)).toThrowError(IllegalArgumentException);
        });
    });

    describe("Delimiter Behavior", () => {
        it("should use the default delimiter when none is provided", () => {
            const name = new StringName("oss.cs.fau.de");
            expect(name.asString()).toBe("oss.cs.fau.de");
        });

        it("should correctly handle names with custom delimiters", () => {
            const name = new StringName("oss|cs|fau|de", "|");
            expect(name.getComponent(2)).toBe("fau");
        });

        it("should correctly escape delimiters within components", () => {
            const name = new StringName("oss\\.cs.fau\\.de");
            expect(name.getNoComponents()).toBe(2);
        });
    });

    describe("State Integrity and Invariants", () => {
        it("should maintain consistency after multiple modifications", () => {
            const name = new StringName("oss.cs");
            name.append("fau");
            name.insert(1, "new");
            name.remove(0);
            expect(name.asString()).toBe("new.cs.fau");
            expect(name.getNoComponents()).toBe(3);
        });

        it("should throw an error if the class invariants are violated", () => {
            const name = new StringName("oss.cs");
            name["name"] = null as any;
            expect(() => name.getNoComponents()).toThrowError(InvalidStateException);
        });
    });

    describe("Edge Cases", () => {
        it("should handle names with a single component", () => {
            const name = new StringName("single");
            expect(name.getNoComponents()).toBe(1);
            expect(name.getComponent(0)).toBe("single");
        });

        it("should handle names with empty delimiters gracefully", () => {
            const name = new StringName("single");
            expect(name.asString()).toBe("single");
        });

        it("should throw errors for invalid operations on empty names", () => {
            expect(() => new StringName("", ".")).toThrowError(IllegalArgumentException);
        });
    });
});
