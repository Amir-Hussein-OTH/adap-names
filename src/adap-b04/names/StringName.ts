import {DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "../common/Printable";
import {AbstractName} from "./AbstractName";
import {IllegalArgumentException} from "../common/IllegalArgumentException";
import {InvalidStateException} from "../common/InvalidStateException";
import {MethodFailureException} from "../common/MethodFailureException";

export class StringName extends AbstractName {
    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter); // Validates delimiter in the parent class
        IllegalArgumentException.assertCondition(
            <boolean>other && other.length > 0,
            "The name must be a non-empty string."
        );
        this.name = other;
        this.length = this.splitString(this.name, this.delimiter).length;
        this.checkClassInvariants();
    }

    public getNoComponents(): number {
        this.checkClassInvariants(); // Check before method execution
        const count = this.length;
        MethodFailureException.assertCondition(
            count >= 0,
            "The number of components must be non-negative."
        );
        return count;
    }

    public getComponent(i: number): string {
        this.checkIndexBounds(i, this.length); // Precondition: valid index
        const component = this.splitString(this.name, this.delimiter)[i];
        MethodFailureException.assertCondition(
            typeof component === "string",
            "Returned component must be a string."
        );
        return component;
    }

    public setComponent(i: number, c: string): void {
        this.checkIndexBounds(i, this.length); // Precondition: valid index
        IllegalArgumentException.assertCondition(
            <boolean>c && c.length > 0,
            "Component must be a non-empty string."
        ); // Valid string
        const array = this.splitString(this.name, this.delimiter);
        array[i] = c;
        this.name = array.join(this.delimiter);
        this.checkClassInvariants();
    }

    public insert(i: number, c: string): void {
        IllegalArgumentException.assertCondition(
            i >= 0 && i <= this.length,
            `Index ${i} is out of bounds. Valid indices are from 0 to ${this.length}.`
        ); // Precondition: valid index
        IllegalArgumentException.assertCondition(
            <boolean>c && c.length > 0,
            "Component must be a non-empty string."
        ); // Valid string
        const array = this.splitString(this.name, this.delimiter);
        array.splice(i, 0, c);
        this.name = array.join(this.delimiter);
        this.length += 1;
        this.checkClassInvariants();
    }

    public append(c: string): void {
        IllegalArgumentException.assertCondition(
            <boolean>c && c.length > 0,
            "The component to append must be a non-empty string."
        ); // Valid string
        this.name += this.delimiter + c;
        this.length += 1;
        this.checkClassInvariants();
    }

    public remove(i: number): void {
        this.checkIndexBounds(i, this.length); // Precondition: valid index
        const array = this.splitString(this.name, this.delimiter);
        array.splice(i, 1);
        this.name = array.join(this.delimiter);
        this.length -= 1;
        this.checkClassInvariants();
    }

    private splitString(str: string, delimiter: string): string[] {
        IllegalArgumentException.assertCondition(
            <boolean>str && str.length > 0,
            "String to split must be a non-empty string."
        ); // Valid string
        IllegalArgumentException.assertCondition(
            <boolean>delimiter && delimiter.length > 0,
            "Delimiter must be a non-empty string."
        ); // Valid delimiter
        return str.split(new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delimiter}`));
    }

    private checkClassInvariants(): void {
        InvalidStateException.assertCondition(
            typeof this.name === "string",
            "Name must be a string."
        );
        InvalidStateException.assertCondition(
            this.splitString(this.name, this.delimiter).length === this.length,
            "Length must match the number of components."
        );
        InvalidStateException.assertCondition(
            <boolean>this.delimiter && typeof this.delimiter === "string" && this.delimiter.length > 0,
            "Delimiter must be a non-empty string."
        );
    }

    protected checkIndexBounds(index: number, componentCount: number): void {
        IllegalArgumentException.assertCondition(
            index >= 0 && index < componentCount,
            `Index ${index} is out of bounds. Valid indices are from 0 to ${componentCount - 1}.`
        );
    }
}
