import {DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "../common/Printable";
import {Name} from "./Name";
import {IllegalArgumentException} from "../common/IllegalArgumentException";
import {InvalidStateException} from "../common/InvalidStateException";
import {MethodFailureException} from "../common/MethodFailureException";

export abstract class AbstractName implements Name {
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.setDelimiter(delimiter); // Class invariant maintained through setter
        this.checkClassInvariants(); // Ensure invariants are satisfied
    }

    private setDelimiter(delimiter: string): void {
        IllegalArgumentException.assertCondition(
            <boolean>delimiter && delimiter.length > 0,
            "Delimiter must be a non-empty string."
        );
        this.delimiter = delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assertCondition(
            <boolean>delimiter && delimiter.length > 0,
            "Delimiter must be a non-empty string."
        );

        const unescapedComponents: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            unescapedComponents.push(this.unescape(this.getComponent(i), this.delimiter));
        }

        const result = unescapedComponents.join(delimiter);
        MethodFailureException.assertCondition(
            result.includes(delimiter),
            "The result string must include the provided delimiter."
        );
        return result;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const componentsArray: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            componentsArray.push(this.getComponent(i));
        }
        return componentsArray.join(this.delimiter);
    }

    public isEmpty(): boolean {
        const result = this.getNoComponents() === 0;
        MethodFailureException.assertCondition(
            result === (this.getNoComponents() === 0),
            "isEmpty must return true if there are no components."
        );
        return result;
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
        const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        MethodFailureException.assertCondition(
            copy.isEqual(this),
            "The clone must be equal to the original object."
        );
        return copy;
    }

    public isEqual(other: Name): boolean {
        const result =
            this.getNoComponents() === other.getNoComponents() &&
            this.getDelimiterCharacter() === other.getDelimiterCharacter() &&
            Array.from({length: this.getNoComponents()}).every((_, i) => this.getComponent(i) === other.getComponent(i));

        return result;
    }

    public concat(other: Name): void {
        const initialComponentCount = this.getNoComponents();
        const otherDelimiter = other.getDelimiterCharacter();
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(this.escape(this.unescape(other.getComponent(i), otherDelimiter), this.delimiter));
        }

        MethodFailureException.assertCondition(
            this.getNoComponents() === initialComponentCount + other.getNoComponents(),
            "Concatenation must increase component count by the number of components in the other object."
        );
    }

    protected escape(str: string, delimiter: string): string {
        return str.replaceAll(new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delimiter}`, "g"), ESCAPE_CHARACTER + delimiter);
    }

    protected unescape(str: string, delimiter: string): string {
        return str.replaceAll(new RegExp(`\\${ESCAPE_CHARACTER}\\${delimiter}`, "g"), delimiter);
    }

    protected checkIndexBounds(index: number, componentCount: number): void {
        IllegalArgumentException.assertCondition(
            index >= 0 && index < componentCount,
            `Index ${index} is out of bounds. Valid indices are from 0 to ${componentCount - 1}.`
        );
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    private checkClassInvariants(): void {
        InvalidStateException.assertIsNotNullOrUndefined(
            this.delimiter,
            "Class invariant violated: delimiter must be a non-empty string."
        );
        InvalidStateException.assertCondition(
            this.delimiter.length > 0,
            "Class invariant violated: delimiter must have a length greater than zero."
        );
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;

    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;

    abstract append(c: string): void;

    abstract remove(i: number): void;
}
