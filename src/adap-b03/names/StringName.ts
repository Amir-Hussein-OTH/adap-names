import {AbstractName} from "./AbstractName";
import {Name} from "./Name";

export class StringName extends AbstractName implements Name {

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        this.length = this.splitString(this.name, this.delimiter).length;
    }

    public getNoComponents(): number {
        return this.length;
    }


    public getComponent(i: number): string {
        return this.splitString(this.name, this.delimiter)[i];
    }

    public setComponent(i: number, c: string): void {
        const array = this.splitString(this.name, this.delimiter);
        array[i] = c;
        this.name = array.join(this.delimiter);
    }

    public insert(i: number, c: string): void {
        const array = this.splitString(this.name, this.delimiter);
        array.splice(i, 0, c);
        this.name = array.join(this.delimiter);
        this.length += 1;
    }

    public append(c: string): void {
        this.name += this.delimiter + c;
        this.length += 1;
    }

    public remove(i: number): void {
        const array = this.splitString(this.name, this.delimiter);
        array.splice(i, 1);
        this.name = array.join(this.delimiter);
        this.length -= 1;
    }
}