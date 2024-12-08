import {AbstractName} from "./AbstractName";
import {ESCAPE_CHARACTER} from "../common/Printable";
import {MethodFailedException} from "../common/MethodFailedException";
import {IllegalArgumentException} from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        // precondition
        IllegalArgumentException.assert( other !== undefined && other !== null, "Should be defined");
        this.name = other;
        this.noComponents = this.splitString(this.name, this.delimiter).length;
        // postcondition
        MethodFailedException.assert( this.noComponents > 0, "noComponents should have positive value.");

    }

    public getNoComponents(): number {
        // precondition: Ensure this instance is of type StringName
        IllegalArgumentException.assert( this instanceof StringName, "Instance is not of type StringName.");

        const res = this.noComponents;

        // postcondition
        MethodFailedException.assert(res >= 0, "Must return non-negative value.");
        return res;
    }

    public getComponent(i: number): string {
        // precondition: Ensure this instance is of type StringName
        IllegalArgumentException.assert( this instanceof StringName, "Instance is not of type StringName.");

        // precondition: Ensure valid index
        IllegalArgumentException.assert( i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

        const res = this.splitString(this.name, this.delimiter)[i];

        // postcondition: Ensure component is defined
        MethodFailedException.assert( res !== undefined && res !== null, "Component should be defined");

        // postcondition: Ensure component is escaped
        MethodFailedException.assert( this.isEscaped(res, this.getDelimiterCharacter()), `Component (${res}) must be escaped.`);

        return res;
    }

    public setComponent(i: number, c: string): void {
        this.ensureValidInstance();
        this.ensureValidIndex(i);
        this.ensureValidComponent(c);
        // backup original components before modification
        const componentsBefore = this.splitString(this.name, this.delimiter);
        try {
            componentsBefore[i] = c;  // modify the component
            this.name = componentsBefore.join(this.delimiter);
            this.noComponents = componentsBefore.length;

        } catch (e) {
            this.name = componentsBefore.join(this.delimiter); // revert change
            this.noComponents = componentsBefore.length;
            throw e;
        }
    }

    public insert(i: number, c: string): void {
        // precondition: Ensure this instance is of type StringName
        IllegalArgumentException.assert( this instanceof StringName, "Instance is not of type StringName.");

        // preconditions: Validate the input component and index
        IllegalArgumentException.assert( i >= 0 && i <= this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
        IllegalArgumentException.assert( c !== undefined && c !== null, "Component should be defined");
        IllegalArgumentException.assert( this.isEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

        // backup original components before modification
        const componentsBefore = this.splitString(this.name, this.delimiter);

        try {
            componentsBefore.splice(i, 0, c);  // insert the new component
            this.name = componentsBefore.join(this.delimiter);
            this.noComponents = componentsBefore.length;

        } catch (e) {
            this.name = componentsBefore.join(this.delimiter); // revert change
            this.noComponents = componentsBefore.length;
            throw e;
        }
    }

    public append(c: string): void {
        this.ensureValidInstance();
        this.ensureValidComponent(c);
        // backup original components before modification
        const componentsBefore = this.splitString(this.name, this.delimiter);

        try {
            componentsBefore.push(c);  // append the new component
            this.name = componentsBefore.join(this.delimiter);
            this.noComponents = componentsBefore.length;

        } catch (e) {
            this.name = componentsBefore.join(this.delimiter); // revert change
            this.noComponents = componentsBefore.length;
            throw e;
        }
    }

    public remove(i: number): void {
        // precondition: Ensure this instance is of type StringName
        IllegalArgumentException.assert( this instanceof StringName, "Instance is not of type StringName.");

        // precondition: Ensure valid index
        IllegalArgumentException.assert( i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

        // backup original components before modification
        const componentsBefore = this.splitString(this.name, this.delimiter);


        try {
            componentsBefore.splice(i, 1);  // remove the component
            this.name = componentsBefore.join(this.delimiter);
            this.noComponents = componentsBefore.length;

        } catch (e) {
            this.name = componentsBefore.join(this.delimiter); // revert change
            this.noComponents = componentsBefore.length;
            throw e;
        }
    }

    private ensureValidInstance(): void {
        IllegalArgumentException.assert( this instanceof StringName, "Instance is not of type StringName.");
    }

    private ensureValidIndex(i: number): void {
        IllegalArgumentException.assert( i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
    }

    private ensureValidComponent(c: string): void {
        IllegalArgumentException.assert( c !== undefined && c !== null, "Component should be defined");
        IllegalArgumentException.assert( this.isEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);
    }

    private splitString(str: string, delim: string) {
        return str.split(new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delim}`));
    }
}
