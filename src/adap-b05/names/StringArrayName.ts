import { AbstractName } from "./AbstractName";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);

        // Precondition checks
        this.validatePreconditions(other, delimiter);
        this.components = other.map(c => this.unescape(c, this.delimiter));
        // Postcondition: Ensure valid string array
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, Array.isArray(this.components) && this.components.every(() => true), "Components should be a valid string array.");
    }

    private validatePreconditions(other: string[], delimiter?: string): void {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, other !== undefined && other !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, other.length !== 0, "At least one component is required.");

        if (delimiter && delimiter.length !== 1) {
            throw new IllegalArgumentException("Delimiter must be a single character.");
        }

        other.forEach(c => {
            AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.isEscaped(c, this.getDelimiterCharacter()), "Components must be escaped.");
        });
    }

    private ensureValidInstance(): void {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this instanceof StringArrayName, "Instance is not of type StringArrayName.");
    }

    private ensureValidIndex(i: number): void {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, i >= 0 && i < this.getNoComponents(), "Index out of bounds.");
    }

    private ensureValidComponent(c: string): void {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, c !== undefined && c !== null, "Should be defined");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.isEscaped(c, this.getDelimiterCharacter()), "Component must be escaped.");
    }

    public getNoComponents(): number {
        this.ensureValidInstance();
        const count = this.components.length;
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, count >= 0, "Must return non-negative value.");
        return count;
    }

    public getComponent(i: number): string {
        this.ensureValidInstance();
        this.ensureValidIndex(i);
        const component = this.escape(this.components[i], this.delimiter);
        // Postcondition: Ensure component is defined and escaped
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, component !== undefined && component !== null, "Component should be defined");
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, this.isEscaped(component, this.getDelimiterCharacter()), "Component must be escaped.");

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
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, i >= 0 && i <= this.getNoComponents(), "Index out of bounds.");

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
