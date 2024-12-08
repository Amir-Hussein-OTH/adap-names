import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import {MethodFailedException} from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);

        // Precondition checks
        this.validatePreconditions(other, delimiter);
        this.components = other.map(c => this.unescape(c, this.delimiter));
        // Postcondition: Ensure valid string array
        MethodFailedException.assert( Array.isArray(this.components) && this.components.every(() => true), "Components should be a valid string array.");
    }

    private validatePreconditions(other: string[], delimiter?: string): void {
        MethodFailedException.assert(  other !== undefined && other !== null, "Should be defined");
        MethodFailedException.assert( other.length !== 0, "At least one component is required.");

        if (delimiter && delimiter.length !== 1) {
            throw new IllegalArgumentException("Delimiter must be a single character.");
        }

        other.forEach(c => {
            MethodFailedException.assert( this.isEscaped(c, this.getDelimiterCharacter()), "Components must be escaped.");
        });
    }

    private ensureValidInstance(): void {
        MethodFailedException.assert(this instanceof StringArrayName, "Instance is not of type StringArrayName.");
    }

    private ensureValidIndex(i: number): void {
        MethodFailedException.assert( i >= 0 && i < this.getNoComponents(), "Index out of bounds.");
    }

    private ensureValidComponent(c: string): void {
        MethodFailedException.assert( c !== undefined && c !== null, "Should be defined");
        MethodFailedException.assert( this.isEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");
    }

    public getNoComponents(): number {
        this.ensureValidInstance();
        const count = this.components.length;
        MethodFailedException.assert( count >= 0, "Must return non-negative value.");
        return count;
    }

    public getComponent(i: number): string {
        this.ensureValidInstance();
        this.ensureValidIndex(i);
        const component = this.escape(this.components[i], this.delimiter);
        // Postcondition: Ensure component is defined and escaped
        MethodFailedException.assert( component !== undefined && component !== null, "Component should be defined");
        MethodFailedException.assert( this.isEscaped(component, this.getDelimiterCharacter()), "Component must be escaped.");

        return component;
    }

    public setComponent(i: number, c: string): void {
        this.ensureValidInstance();
        this.ensureValidComponent(c);
        this.ensureValidIndex(i);
        try {
            this.components[i] = this.unescape(c, this.delimiter);
        } catch (e) {
            this.components = this.components.slice(0, i).concat([this.getComponent(i)]).concat(this.components.slice(i + 1));
            throw e;
        }
    }

    public insert(i: number, c: string): void {
        this.ensureValidInstance();
        this.ensureValidComponent(c);
        MethodFailedException.assert( i >= 0 && i <= this.getNoComponents(), "Index out of bounds.");

        try {
            this.components.splice(i, 0, this.unescape(c, this.delimiter));
        } catch (e) {
            this.components = this.components.slice(0, i).concat(this.components.slice(i));
            throw e;
        }
    }

    public append(c: string): void {
        this.ensureValidInstance();
        this.ensureValidComponent(c);
        try {
            const componentToAppend = this.isEscaped(c, this.delimiter) ? this.unescape(c, this.delimiter) : c;
            this.components.push(componentToAppend);
        } catch (e) {
            this.components = this.components.slice();
            throw e;
        }
    }

    public remove(i: number): void {
        this.ensureValidInstance();
        this.ensureValidIndex(i);

        try {
            this.components.splice(i, 1);
        } catch (e) {
            throw e;
        }
    }
}
