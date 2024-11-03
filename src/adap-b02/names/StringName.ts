import {Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    protected name: string = "";
    protected length: number = 0;

    // More info:
    // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&thr_pk=385940&page=0&cmd=viewThread&cmdNode=13z:tp&baseClass=ilRepositoryGUI

    constructor(other: string, delimiter?: string) {

        if (typeof delimiter !== 'undefined') {
            this.delimiter = delimiter;
        }

        this.name = other;
        this.length = 1;

        const characters = this.name.split('');
        characters.forEach((char, index) => {
            if (char === this.delimiter && (index === 0 || this.name.charAt(index - 1) !== ESCAPE_CHARACTER)) {
                this.length++;
            }
        });
    }

    public asString(delimiter: string = this.delimiter): string {
        let result = "";
        this.name.split('').forEach((char, index) => {
            if (char === ESCAPE_CHARACTER) {
                if (index + 1 < this.name.length) {
                    result += this.name[index + 1];
                }
            } else if (char === this.delimiter) {
                result += (this.delimiter === delimiter ? this.delimiter : delimiter);
            } else {
                result += char;
            }
        });

        return result;
    }

    public asDataString(): string {
        let result = "";

        this.name.split('').forEach((char, index) => {
            if (char === this.delimiter && (index === 0 || this.name[index - 1] !== ESCAPE_CHARACTER)) {
                result += DEFAULT_DELIMITER;
            } else {
                result += char;
            }
        });

        return result;
    }

    public isEmpty(): boolean {
        return this.name.length >= 1;
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
        this.name += (this.name ? this.delimiter : '') + c;
        this.length++;
    }

    public remove(n: number): void {
        let split_name: string[] = this.name.split(this.delimiter)
        split_name.splice(n, 1)
        this.name = split_name.join(this.delimiter)
        this.length--;
    }

    // More info:
    // https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&pos_pk=1130228&thr_pk=385173&page=0&viewmode=2&cmd=markPostRead&cmdNode=13z:tp&baseClass=ilRepositoryGUI#1130228

    public concat(other: Name): void {

        if (this.delimiter !== other.getDelimiterCharacter()) return;
        const indices = Array.from({length: other.getNoComponents()}, (_, index) => index);
        indices.forEach(index => {
            this.append(other.getComponent(index));
        });
    }


}