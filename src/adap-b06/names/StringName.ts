import { AbstractName } from "./AbstractName";
import { ESCAPE_CHARACTER } from "../common/Printable";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        // Precondition
        IllegalArgumentException.assert(other !== undefined && other !== null, "Should be defined");
        this.name = other;
        this.noComponents = this.splitString(this.name, this.delimiter).length;
        // Postcondition
        MethodFailedException.assert(this.noComponents > 0, "noComponents should have positive value.");
    }

    public getNoComponents(): number {
        IllegalArgumentException.assert(this instanceof StringName, "Instance is not of type StringName.");
        const res = this.noComponents;
        MethodFailedException.assert(res >= 0, "Must return non-negative value.");
        return res;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(this instanceof StringName, "Instance is not of type StringName.");
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

        const res = this.splitString(this.name, this.delimiter)[i];
        MethodFailedException.assert(res !== undefined && res !== null, "Component should be defined");
        MethodFailedException.assert(this.isEscaped(res, this.getDelimiterCharacter()), `Component (${res}) must be escaped.`);

        return res;
    }

    public setComponent(i: number, c: string): StringName {
        this.ensureValidInstance();
        this.ensureValidComponent(c);
        this.ensureValidIndex(i);
        const clone = this.deepClone();

        const components = clone.splitString(clone.name, clone.delimiter);
        components[i] = c;
        clone.name = components.join(clone.delimiter);
        clone.noComponents = components.length;

        return clone;
    }

    public insert(i: number, c: string): StringName {
        this.ensureValidInstance();
        this.ensureValidComponent(c);
        this.ensureValidIndex(i);
        const clone = this.deepClone();

        const components = clone.splitString(clone.name, clone.delimiter);
        components.splice(i, 0, c);
        clone.name = components.join(clone.delimiter);
        clone.noComponents = components.length;

        return clone;
    }

    public append(c: string): StringName {
        this.ensureValidInstance();
        this.ensureValidComponent(c);
        const clone = this.deepClone();

        const components = clone.splitString(clone.name, clone.delimiter);
        components.push(c);
        clone.name = components.join(clone.delimiter);
        clone.noComponents = components.length;

        return clone;
    }

    public remove(i: number): StringName {
        this.ensureValidInstance();
        this.ensureValidIndex(i);
        const clone = this.deepClone();

        const components = clone.splitString(clone.name, clone.delimiter);
        components.splice(i, 1);
        clone.name = components.join(clone.delimiter);
        clone.noComponents = components.length;

        return clone;
    }

    public clone(): StringName {
        const clone = Object.create(this);
        Object.setPrototypeOf(clone, StringName.prototype);
        return clone;
    }

    private deepClone(): StringName {
        const clone = structuredClone(this);
        Object.setPrototypeOf(clone, StringName.prototype);
        return clone;
    }

    private ensureValidInstance(): void {
        IllegalArgumentException.assert(this instanceof StringName, "Instance is not of type StringName.");
    }

    private ensureValidIndex(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
    }

    private ensureValidComponent(c: string): void {
        IllegalArgumentException.assert(c !== undefined && c !== null, "Component should be defined");
        IllegalArgumentException.assert(this.isEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);
    }

    private splitString(str: string, delim: string): string[] {
        return str.split(new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delim}`));
    }

}
