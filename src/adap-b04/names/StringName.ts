import {DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "../common/Printable";
import {AbstractName} from "./AbstractName";

export class StringName extends AbstractName {
    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        if (!other || other.length === 0) {
            throw new Error("The name must be a non-empty string.");
        }
        this.name = other;
        this.length = this.splitString(this.name, this.delimiter).length;
    }

    public getNoComponents(): number {
        return this.length;
    }

    public getComponent(i: number): string {
        this.checkIndexBounds(i, this.length);
        return this.splitString(this.name, this.delimiter)[i];
    }

    public setComponent(i: number, c: string): void {
        this.checkIndexBounds(i, this.length);
        const array = this.splitString(this.name, this.delimiter);
        array[i] = c;
        this.name = array.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.length) {
            throw new Error(`Index ${i} is out of bounds. Valid indices are from 0 to ${this.length}.`);
        }
        const array = this.splitString(this.name, this.delimiter);
        array.splice(i, 0, c);
        this.name = array.join(this.delimiter);
        this.length += 1;
    }

    public append(c: string): void {
        if (!c || c.length === 0) {
            throw new Error("The component to append must be a non-empty string.");
        }
        this.name += this.delimiter + c;
        this.length += 1;
    }

    public remove(i: number): void {
        this.checkIndexBounds(i, this.length);
        const array = this.splitString(this.name, this.delimiter);
        array.splice(i, 1);
        this.name = array.join(this.delimiter);
        this.length -= 1;
    }

    private splitString(str: string, delimiter: string): string[] {
        if (!str || str.length === 0) {
            throw new Error("String to split must be a non-empty string.");
        }
        if (!delimiter || delimiter.length === 0) {
            throw new Error("Delimiter must be a non-empty string.");
        }
        return str.split(new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delimiter}`));
    }
}
