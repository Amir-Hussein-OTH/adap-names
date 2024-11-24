import {InvalidStateException} from "../common/InvalidStateException";
import {MethodFailureException} from "../common/MethodFailureException";
import {AbstractName} from "./AbstractName";
import {IllegalArgumentException} from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter); // Validates delimiter
        // Contract: The input must be an array of strings
        IllegalArgumentException.assertCondition(
            Array.isArray(other),
            "The input must be an array of strings."
        );
        for (const item of other) {
            // Contract: All components must be strings
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
        // Contract: The number of components must be non-negative
        MethodFailureException.assertCondition(
            count >= 0,
            "The number of components must be non-negative."
        );
        return count;
    }

    public getComponent(i: number): string {
        this.checkIndexBounds(i, this.components.length); // Precondition: valid index
        const component = this.escape(this.components[i], this.delimiter);
        // Contract: Returned component must be a string
        MethodFailureException.assertCondition(
            true,
            "Returned component must be a string."
        );
        return component;
    }

    public setComponent(i: number, c: string): void {
        this.checkIndexBounds(i, this.components.length); // Precondition: valid index
        // Contract: Component must be a string
        IllegalArgumentException.assertCondition(
            true,
            "Component must be a string."
        ); // Precondition: valid string
        this.components[i] = this.unescape(c, this.delimiter);
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public insert(i: number, c: string): void {
        // Contract: Component must be a string
        IllegalArgumentException.assertCondition(
            true,
            "Component must be a string."
        ); // Precondition: valid string
        // Contract: Index must be within valid bounds for insertion
        IllegalArgumentException.assertCondition(
            i >= 0 && i <= this.components.length,
            `Index ${i} is out of bounds for insert.`
        ); // Precondition: valid index
        this.components.splice(i, 0, this.unescape(c, this.delimiter));
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public append(c: string): void {
        // Contract: Component must be a string
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

    protected checkClassInvariants(): void {
        // Contract: Components must be an array of strings
        InvalidStateException.assertCondition(
            Array.isArray(this.components),
            "Components must be an array."
        );
        // Contract: Ensure all components are strings
        InvalidStateException.assertCondition(
            this.components.every((comp) => typeof comp === "string"),
            "All components must be strings."
        );
    }
}
