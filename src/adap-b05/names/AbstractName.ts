import {DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "../common/Printable";
import {Name} from "./Name";
import {IllegalArgumentException} from "../common/IllegalArgumentException";
import {MethodFailedException} from "../common/MethodFailedException";
import {InvalidStateException} from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        // precondition
        IllegalArgumentException.assert(delimiter != null && delimiter.length == 1, "The delimiter must consist of only one character.");

        this.delimiter = delimiter ?? this.delimiter;

        // postcondition
        InvalidStateException.assert(
            this instanceof AbstractName,
            "The instance does not meet the prototype requirements of AbstractName.",
        );
    }

    public asString(delimiter: string = this.delimiter): string {
        // precondition: Ensure the instance is of the correct type
        if (!(this instanceof AbstractName)) {
            throw new Error("The instance does not meet the prototype requirements of AbstractName.");
        }

        // precondition: Check if delimiter is a valid single character string
        if (delimiter.length !== 1) {
            throw new IllegalArgumentException("The delimiter must consist of only one character.");
        }

        const unescapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const component = this.getComponent(i);
            unescapedComponents.push(this.unescape(component, this.delimiter));  // unescape each component
        }

        const res = unescapedComponents.join(delimiter);

        // postcondition: Ensure that the result is defined and not null
        if (res === undefined || res === null) {
            throw new IllegalArgumentException("Result should be defined");
        }

        return res;
    }


    public toString(): string {
        if (!(this instanceof AbstractName)) {
            throw new Error("The instance does not meet the prototype requirements of AbstractName.");
        }

        const escapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            escapedComponents.push(this.getComponent(i));
        }
        const res = escapedComponents.join(this.delimiter);

        // postcondition
        if (res === undefined || res === null) {
            throw new Error("Result should be defined");
        }

        return res;
    }

    public asDataString(): string {
        // precondition: Ensure the instance fulfills the AbstractName prototype
        if (!(this instanceof AbstractName)) {
            throw new IllegalArgumentException("The instance does not meet the prototype requirements of AbstractName.");
        }

        // Ensure components exist and are valid for processing
        const unescapedComponents = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            // Unescape each component with the appropriate delimiter
            const component = this.getComponent(i);
            if (component === undefined || component === null) {
                throw new IllegalArgumentException(`Component at index ${i} is not valid.`);
            }
            unescapedComponents.push((this.unescape(component, this.delimiter)));
        }

        // Join components with the default delimiter
        const result = unescapedComponents.map(c => this.escape(c, DEFAULT_DELIMITER)).join(DEFAULT_DELIMITER);

        // postcondition: Ensure that the result is defined and not null
        if (result === undefined || result === null) {
            throw new IllegalArgumentException("Result should be defined");
        }

        return result;
    }


    public isEqual(other: Name): boolean {
        // precondition: Check if `other` is an object of type `Name`
        if (!(other && typeof other === 'object' && 'asDataString' in other && 'getDelimiterCharacter' in other)) {
            throw new IllegalArgumentException("other must be an instance of Name.");
        }

        // Perform the equality check
        return this.asDataString() === other.asDataString() &&
            this.getDelimiterCharacter() === other.getDelimiterCharacter();
    }

    public getHashCode(): number {
        if (!(this instanceof AbstractName)) {
            throw new Error("The instance does not meet the prototype requirements of AbstractName.");
        }

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
        if (!(this instanceof AbstractName)) {
            throw new Error("The instance does not meet the prototype requirements of AbstractName.");
        }

        const res = Object.create(this);

        // postcondition: Check if the result has the necessary methods to fulfill the Name interface
        if (!(res && typeof res === 'object' && 'getDelimiterCharacter' in res && 'getNoComponents' in res && 'getComponent' in res)) {
            throw new Error("Result has to be an instance of Name.");
        }

        return res;
    }


    public isEmpty(): boolean {
        const result = this.getNoComponents() === 0;
        // Contract: isEmpty must return true if there are no components
        MethodFailedException.assert(
            result === (this.getNoComponents() === 0),
            "isEmpty must return true if there are no components."
        );
        return result;
    }

    public getDelimiterCharacter(): string {
        // CLASS INV
        InvalidStateException.assert(   this.delimiter != null && this.delimiter != undefined, "Delimiter must not be null!");
        InvalidStateException.assert(this.delimiter.length === 1, "Delimiter must be a single character!");

        let str: string = this.delimiter;

        // postcondition
        MethodFailedException.assert(str != null && str != undefined, "Could not execute getDelimiterCharacter()!");

        return str;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;

    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;

    abstract append(c: string): void;

    abstract remove(i: number): void;

    public concat(other: Name): void {
        // Precondition: Ensure `other` is a valid instance of Name
        if (!(other && typeof other === 'object' && 'getDelimiterCharacter' in other && 'getNoComponents' in other && 'getComponent' in other)) {
            throw new IllegalArgumentException("other must be an instance of Name.");
        }

        const otherDelimiter = other.getDelimiterCharacter();
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(this.escape(this.unescape(other.getComponent(i), otherDelimiter), this.delimiter));
        }

    }

    protected escape(str: string, delim: string) {
        return str.replaceAll(new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delim}`, "g"), ESCAPE_CHARACTER + delim);
    }

    protected unescape(str: string, delim: string) {
        return str.replaceAll(new RegExp(`\\${ESCAPE_CHARACTER}\\${delim}`, "g"), delim);
    }

    protected isEscaped(s: string, delimiter: string): boolean {
        const masked = s
            .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, "")  // Remove double escape characters (\\)
            .replaceAll(ESCAPE_CHARACTER + delimiter, "");        // Remove escaped delimiters (e.g., \.)

        // Check for any remaining escape characters or delimiters
        return !masked.includes(ESCAPE_CHARACTER) && !masked.includes(delimiter);
    }
}
