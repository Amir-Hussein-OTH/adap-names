import {Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected name: string = "";
    protected length: number = 0;

    constructor(other: string, delimiter?: string) {
        if (typeof delimiter !== 'undefined') {
            this.delimiter = delimiter;
        }
        this.name = other;
        if (this.name === '') {
            this.length = 0;
            return;
        }
        const escapedDelimiter = this.delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?<!\\\\)${escapedDelimiter}`);
        this.length = this.name.split(regex).length;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name
    }

    public asDataString(): string {
        return this.name.replace(this.delimiter, "")
    }

    public isEmpty(): boolean {
        if (this.name.length < 1)
            return false
        else
            return true
    }

    public getDelimiterCharacter(): string {
        return this.delimiter
    }

    public getNoComponents(): number {
        return this.length
    }

    public getComponent(x: number): string {
        return this.name.split(this.delimiter)[x];
    }

    public setComponent(n: number, c: string): void {
        let split_name: string[];
        split_name = this.name.split(this.delimiter);
        split_name[n] = c
        this.name = split_name.join(this.delimiter)
    }

    public insert(n: number, c: string): void {
        let split_name: string[] = this.name.split(this.delimiter)
        split_name.splice(n, 0, c)
        this.name = split_name.join(this.delimiter)
        this.length++;
    }

    public append(c: string): void {
        this.name = this.name + this.delimiter + c
        this.length++;
    }

    public remove(n: number): void {
        let split_name: string[] = this.name.split(this.delimiter)
        split_name.splice(n, 1)
        this.name = split_name.join(this.delimiter)
        this.length--;
    }

    public concat(other: Name): void {
        this.name = this.name + this.delimiter + other.asString()
        this.length = this.length + other.getNoComponents();
    }

}