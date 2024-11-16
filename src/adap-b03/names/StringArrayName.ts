import {AbstractName} from "./AbstractName";
import {Name} from "./Name";


export class StringArrayName extends AbstractName implements Name {

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
        return this.escape(this.components[i], this.delimiter);
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = this.unescape(c, this.delimiter);
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, this.unescape(c, this.delimiter));
    }

    public append(c: string): void {
        this.components.push(this.unescape(c, this.delimiter));
    }

    public remove(i: number): void {
        this.components.splice(i, 1);
    }
}