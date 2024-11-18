import {AbstractName} from "./AbstractName";


export class StringArrayName extends AbstractName {

    protected components: string[] = [];

// @methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        for (const item of other) {
            this.components.push(this.unescape(item, this.delimiter));
        }
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        return this.escape(this.components[i], this.delimiter);
    }

// @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.components[i] = this.unescape(c, this.delimiter);
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, this.unescape(c, this.delimiter));
    }

    // @methodtype command-method
    public append(c: string): void {
        this.components.push(this.unescape(c, this.delimiter));
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.components.splice(i, 1);
    }
}