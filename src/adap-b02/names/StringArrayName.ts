import {Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER} from "./Name";

/**
 * Represents a collection of string components separated by a delimiter.
 * This class implements the Name interface and provides methods for manipulating
 * the string components as an array.
 */
export class StringArrayName implements Name {

    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    /**
     * Constructs a StringArrayName instance.
     * @param other An array of strings to initialize the components.
     * @param delimiter Optional custom delimiter for separating components.
     */
    constructor(other: string[], delimiter?: string) {
        if (typeof delimiter !== 'undefined') {
            this.delimiter = delimiter;
        }
        for (let i = 0; i < other.length; i++) {
            this.components.push(other[i]);
        }
    }

    /**
     * Returns a human-readable representation of the components joined by the delimiter.
     * @param delimiter The delimiter to use for joining components. Defaults to the instance's delimiter.
     * @returns The human-readable string representation of the components.
     */
    public asString(delimiter: string = this.delimiter): string {
        let nameString: string = ""
        for (let i = 0; i < this.components.length; i++) {
            nameString += this.components[i]
            if (i < this.components.length - 1)
                nameString += this.delimiter
        }
        return nameString
    }

    /**
     * Returns a machine-readable representation of the components using the default delimiter.
     * @returns The data string representation of the components.
     */
    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    /** @methodtype get-method */
    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    /** Returns number of components in Name instance */
    /** @methodtype get-method */
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    /** @methodtype get-method */
    public getComponent(i: number): string {
        return this.components[i];
    }

    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {
        if (c !== ESCAPE_CHARACTER) {
            this.components[i] = c;
        }
    }

    /** @methodtype command-method */
    public insert(i: number, c: string): void {
        this.components.splice(i, 0, c);
    }

    /** @methodtype command-method */
    public append(c: string): void {
        this.components.push(c);
    }

    /** @methodtype command-method */
    public remove(i: number): void {
        this.components.splice(i, 1);
    }

    /**
     * Concatenates another Name instance to this one if they share the same delimiter.
     * @param other The other Name instance to concatenate.
     *
     * More info:
     * https://www.studon.fau.de/studon/ilias.php?ref_id=4447999&cmdClass=ilobjforumgui&pos_pk=1130228&thr_pk=385173&page=0&viewmode=2&cmd=markPostRead&cmdNode=13z:tp&baseClass=ilRepositoryGUI#1130228
     */
    public concat(other: Name): void {
        if (this.delimiter !== other.getDelimiterCharacter()) return;
        const indices = Array.from({length: other.getNoComponents()}, (_, index) => index);
        indices.forEach(index => {
            this.append(other.getComponent(index));
        });
    }
}