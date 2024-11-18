import {AbstractName} from "./AbstractName";
import {ESCAPE_CHARACTER, Name} from "./Name";

export class StringName extends AbstractName {

    protected name: string = "";
    protected length: number = 0;

    // @methodtype initialization-method
    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        this.length = this.splitString(this.name, this.delimiter).length;
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.length;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        return this.splitString(this.name, this.delimiter)[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        const array = this.splitString(this.name, this.delimiter);
        array[i] = c;
        this.name = array.join(this.delimiter);
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        const array = this.splitString(this.name, this.delimiter);
        array.splice(i, 0, c);
        this.name = array.join(this.delimiter);
        this.length += 1;
    }

    // @methodtype command-method
    public append(c: string): void {
        this.name += this.delimiter + c;
        this.length += 1;
    }

    // @methodtype command-method
    public remove(i: number): void {
        const array = this.splitString(this.name, this.delimiter);
        array.splice(i, 1);
        this.name = array.join(this.delimiter);
        this.length -= 1;
    }

    private splitString(str: string, delimiter: string) {
        return str.split(new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delimiter}`));
    }
}