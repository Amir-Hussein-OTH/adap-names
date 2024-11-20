import {DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "../common/Printable";
import {Name} from "./Name";

export abstract class AbstractName implements Name {
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (!delimiter || delimiter.length === 0) {
            throw new Error("Delimiter must be a non-empty string.");
        }
        this.delimiter = delimiter;
    }

    // Returns the name components as a string, joined by the delimiter
    public asString(delimiter: string = this.delimiter): string {
        if (!delimiter || delimiter.length === 0) {
            throw new Error("Delimiter must be a non-empty string.");
        }

        const unescapedComponents: string[] = [];
        let i = 0;
        while (i < this.getNoComponents()) {
            unescapedComponents.push(this.unescape(this.getComponent(i), this.delimiter));
            i++;
        }
        return unescapedComponents.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const componentsArray: string[] = [];
        let i = 0;
        while (i < this.getNoComponents()) {
            componentsArray.push(this.getComponent(i));
            i++;
        }
        return componentsArray.join(this.delimiter);
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.toString() + this.getDelimiterCharacter();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public clone(): Name {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return this.getDelimiterCharacter() === other.getDelimiterCharacter();
    }

    public concat(other: Name): void {
        const otherDelimiter = other.getDelimiterCharacter();
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(this.escape(this.unescape(other.getComponent(i), otherDelimiter), this.delimiter));
        }
    }

    protected escape(str: string, delimiter: string): string {
        return str.replaceAll(new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delimiter}`, "g"), ESCAPE_CHARACTER + delimiter);
    }


    protected unescape(str: string, delimiter: string): string {
        return str.replaceAll(new RegExp(`\\${ESCAPE_CHARACTER}\\${delimiter}`, "g"), delimiter);
    }
    // Check if the index is within valid bounds
    protected checkIndexBounds(index: number, componentCount: number): void {
        if (index < 0 || index >= componentCount) {
            throw new Error(`Index ${index} is out of bounds. Valid indices are from 0 to ${componentCount - 1}.`);
        }
    }
    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;

    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;

    abstract append(c: string): void;

    abstract remove(i: number): void;

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }
}
