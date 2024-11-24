import {AbstractName} from "./AbstractName";
import {IllegalArgumentException} from "../common/IllegalArgumentException";

export class StringName extends AbstractName {
    protected name: string;

    constructor(name: string, delimiter?: string) {
        super(delimiter); // Validates delimiter
        // Contract: Name must be a non-empty string
        IllegalArgumentException.assertCondition(
            !(!name || name.length <= 0),
            "Name must be a non-empty string."
        );
        this.name = this.unescape(name, this.delimiter);
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public getNoComponents(): number {
        return this.name.split(this.delimiter).length;
    }

    public getComponent(i: number): string {
        const components = this.name.split(this.delimiter);
        this.checkIndexBounds(i, components.length); // Precondition: valid index
        return components[i];
    }

    public setComponent(i: number, c: string): void {
        const components = this.name.split(this.delimiter);
        this.checkIndexBounds(i, components.length); // Precondition: valid index
        components[i] = this.unescape(c, this.delimiter);
        this.name = components.join(this.delimiter);
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public insert(i: number, c: string): void {
        const components = this.name.split(this.delimiter);
        this.checkIndexBounds(i, components.length); // Precondition: valid index
        components.splice(i, 0, this.unescape(c, this.delimiter));
        this.name = components.join(this.delimiter);
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public append(c: string): void {
        this.name += this.delimiter + this.unescape(c, this.delimiter);
        this.checkClassInvariants(); // Ensure invariant is maintained
    }

    public remove(i: number): void {
        const components = this.name.split(this.delimiter);
        this.checkIndexBounds(i, components.length); // Precondition: valid index
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.checkClassInvariants(); // Ensure invariant is maintained
    }
}
