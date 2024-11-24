import { describe, it, expect } from "vitest";

import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { Name } from "../../../src/adap-b04/names/Name"; // Assuming Name is the base interface or abstract class
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";

describe("StringArrayName Component Tests", () => {
    describe("Contract with Name Interface", () => {
        it("should implement all required Name interface methods", () => {
            const name: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
            expect(name.asString()).toBe("oss.cs.fau.de");
            expect(name.getComponent(0)).toBe("oss");
            expect(name.getNoComponents()).toBe(4);
        });

        it("should handle Name interface methods uniformly across implementations", () => {
            const arrayName: Name = new StringArrayName(["oss", "cs"]);
            const stringName: Name = new StringName("oss.cs");

            expect(arrayName.asString()).toBe(stringName.asString());
            expect(arrayName.isEqual(stringName)).toBe(true);
        });
    });

    describe("Interaction with Other Names", () => {
        it("should correctly concatenate with another StringArrayName", () => {
            const name1 = new StringArrayName(["oss", "cs"]);
            const name2 = new StringArrayName(["fau", "de"]);

            name1.concat(name2);
            expect(name1.asString()).toBe("oss.cs.fau.de");
        });

        it("should correctly concatenate with a StringName", () => {
            const name1 = new StringArrayName(["oss", "cs"]);
            const name2 = new StringName("fau.de");

            name1.concat(name2);
            expect(name1.asString()).toBe("oss.cs.fau.de");
        });

        it("should throw errors when concatenating with invalid types", () => {
            const name1 = new StringArrayName(["oss", "cs"]);
            expect(() => name1.concat(null as any)).toThrowError(IllegalArgumentException);
            expect(() => name1.concat({} as any)).toThrowError(IllegalArgumentException);
        });
    });

    describe("Component-State Interactions", () => {
        it("should correctly handle component updates", () => {
            const name = new StringArrayName(["oss", "cs", "fau"]);
            name.setComponent(1, "new");
            expect(name.asString()).toBe("oss.new.fau");

            name.insert(3, "de");
            expect(name.asString()).toBe("oss.new.fau.de");

            name.remove(0);
            expect(name.asString()).toBe("new.fau.de");
        });

        it("should handle invalid states gracefully", () => {
            const name = new StringArrayName(["oss", "cs"]);
            name["components"] = null as any; // Simulate an invalid state

            expect(() => name.asString()).toThrowError(InvalidStateException);
            expect(() => name.getComponent(0)).toThrowError(InvalidStateException);
        });
    });

    describe("Integration with Delimiters", () => {
        it("should allow custom delimiters for asString and asDataString", () => {
            const name = new StringArrayName(["oss", "cs", "fau", "de"], "_");
            expect(name.asString()).toBe("oss_cs_fau_de");
            expect(name.asDataString()).toBe("oss_cs_fau_de");

            const escapedName = new StringArrayName(["oss.cs", "fau.de"]);
            expect(escapedName.asDataString()).toBe("oss\\.cs.fau\\.de");
        });

        it("should handle empty delimiters correctly", () => {
            const name = new StringArrayName(["oss", "cs", "fau", "de"], "");
            expect(name.asString()).toBe("oss.cs.fau.de"); // Default delimiter (.)
        });

        it("should throw errors for invalid delimiters", () => {
            expect(() => new StringArrayName(["oss", "cs"], null as any)).toThrowError(IllegalArgumentException);
        });
    });

    describe("Interaction with Cloning and Copying", () => {
        it("should create an identical but independent clone", () => {
            const original = new StringArrayName(["oss", "cs", "fau", "de"]);
            const clone = original.clone();

            expect(clone.isEqual(original)).toBe(true);
            expect(clone.asString()).toBe(original.asString());

            clone.setComponent(0, "new");
            expect(clone.asString()).toBe("new.cs.fau.de");
            expect(original.asString()).toBe("oss.cs.fau.de");
        });
    });

    describe("Edge Cases in Component Interaction", () => {
        it("should handle names with a single component", () => {
            const name = new StringArrayName(["single"]);
            expect(name.getNoComponents()).toBe(1);
            expect(name.getComponent(0)).toBe("single");
        });

        it("should handle empty names correctly", () => {
            const name = new StringArrayName([]);
            expect(name.isEmpty()).toBe(true);

            name.append("new");
            expect(name.asString()).toBe("new");
        });

        it("should throw errors for out-of-bounds component access", () => {
            const name = new StringArrayName(["oss", "cs"]);
            expect(() => name.getComponent(10)).toThrowError(IllegalArgumentException);
            expect(() => name.setComponent(-1, "invalid")).toThrowError(IllegalArgumentException);
        });
    });
});
