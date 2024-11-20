import {DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "../common/Printable";
import {AbstractName} from "./AbstractName";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        for (const item of other) {
            this.components.push(this.unescape(item, this.delimiter));
        }
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.checkIndexBounds(i, this.components.length);
        return this.escape(this.components[i], this.delimiter);
    }

    public setComponent(i: number, c: string): void {
        this.checkIndexBounds(i, this.components.length);
        this.components[i] = this.unescape(c, this.delimiter);
    }

    public insert(i: number, c: string): void {
        this.checkIndexBounds(i, this.components.length);
        this.components.splice(i, 0, this.unescape(c, this.delimiter));
    }

    public append(c: string): void {
        this.components.push(this.unescape(c, this.delimiter));
    }

    public remove(i: number): void {
        this.checkIndexBounds(i, this.components.length);
        this.components.splice(i, 1);
    }

}