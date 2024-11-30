import {AssertionDispatcher, ExceptionType} from "../common/AssertionDispatcher";
import {AbstractName} from "./AbstractName";
import {ESCAPE_CHARACTER} from "../common/Printable";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, other !== undefined && other !== null, "Should be defined");
        this.name = other;
        this.noComponents = this.splitString(this.name, this.delimiter).length;
        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, this.noComponents > 0, "noComponents should have positive value.");

    }

    public getNoComponents(): number {
        // precondition: Ensure this instance is of type StringName
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this instanceof StringName, "Instance is not of type StringName.");

        const res = this.noComponents;

        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, res >= 0, "Must return non-negative value.");
        return res;
    }

    public getComponent(i: number): string {
        // precondition: Ensure this instance is of type StringName
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this instanceof StringName, "Instance is not of type StringName.");

        // precondition: Ensure valid index
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

        const res = this.splitString(this.name, this.delimiter)[i];

        // postcondition: Ensure component is defined
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, res !== undefined && res !== null, "Component should be defined");

        // postcondition: Ensure component is escaped
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, this.isEscaped(res, this.getDelimiterCharacter()), `Component (${res}) must be escaped.`);

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
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this instanceof StringName, "Instance is not of type StringName.");

        // preconditions: Validate the input component and index
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, i >= 0 && i <= this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, c !== undefined && c !== null, "Component should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.isEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);

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
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this instanceof StringName, "Instance is not of type StringName.");

        // precondition: Ensure valid index
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);

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
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this instanceof StringName, "Instance is not of type StringName.");
    }

    private ensureValidIndex(i: number): void {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, i >= 0 && i < this.getNoComponents(), `Index ${i} out of bounds (0-${this.getNoComponents()})`);
    }

    private ensureValidComponent(c: string): void {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, c !== undefined && c !== null, "Component should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.isEscaped(c, this.getDelimiterCharacter()), `Component (${c}) must be escaped.`);
    }

    private splitString(str: string, delim: string) {
        return str.split(new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delim}`));
    }
}
