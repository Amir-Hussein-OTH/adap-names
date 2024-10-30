import {Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "./Name";

export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        if (typeof delimiter !== 'undefined') {
            this.delimiter = delimiter;
        }
        for (let i = 0; i < other.length; i++) {
            this.components.push(other[i]);
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        let nameString: string = ""
        for (let i = 0; i < this.components.length; i++) {
            nameString += this.components[i]
            if (i < this.components.length - 1)
                nameString += this.delimiter
        }
        return nameString
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (c !== ESCAPE_CHARACTER) {
            this.components[i] = c;
        }
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }
}