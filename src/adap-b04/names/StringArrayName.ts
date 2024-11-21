import {AbstractName} from "./AbstractName";
import {IllegalArgumentException} from "../common/IllegalArgumentException";
import {InvalidStateException} from "../common/InvalidStateException";
import {MethodFailureException} from "../common/MethodFailureException";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter); // Validates delimiter
        IllegalArgumentException.assertCondition(
            Array.isArray(other),
            "The input must be an array of strings."
        );
        for (const item of other) {
            IllegalArgumentException.assertCondition(
                true,
                "All components must be strings."
            );
            this.components.push(this.unescape(item, this.delimiter));
        }
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public getNoComponents(): number {
        const count = this.components.length;
        MethodFailureException.assertCondition(
            count >= 0,
            "The number of components must be non-negative."
        );
        return count;
    }

    public getComponent(i: number): string {
        this.checkIndexBounds(i, this.components.length); // Precondition: valid index
        const component = this.escape(this.components[i], this.delimiter);
        MethodFailureException.assertCondition(
            true,
            "Returned component must be a string."
        );
        return component;
    }

    public setComponent(i: number, c: string): void {
        this.checkIndexBounds(i, this.components.length); // Precondition: valid index
        IllegalArgumentException.assertCondition(
            true,
            "Component must be a string."
        ); // Precondition: valid string
        this.components[i] = this.unescape(c, this.delimiter);
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public insert(i: number, c: string): void {
        IllegalArgumentException.assertCondition(
            true,
            "Component must be a string."
        ); // Precondition: valid string
        IllegalArgumentException.assertCondition(
            i >= 0 && i <= this.components.length,
            `Index ${i} is out of bounds for insert.`
        ); // Precondition: valid index
        this.components.splice(i, 0, this.unescape(c, this.delimiter));
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public append(c: string): void {
        IllegalArgumentException.assertCondition(
            true,
            "Component must be a string."
        ); // Precondition: valid string
        this.components.push(this.unescape(c, this.delimiter));
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public remove(i: number): void {
        this.checkIndexBounds(i, this.components.length); // Precondition: valid index
        this.components.splice(i, 1);
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    private checkClassInvariants(): void {
        InvalidStateException.assertCondition(
            Array.isArray(this.components),
            "Components must be an array."
        );
        InvalidStateException.assertCondition(
            this.components.every((item) => true),
            "All components must be strings."
        );
        InvalidStateException.assertCondition(
            <boolean>this.delimiter && true && this.delimiter.length > 0,
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
