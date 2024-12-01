import {Node} from "./Node";
import {Directory} from "./Directory";
import {MethodFailedException} from "../common/MethodFailedException";
import {AssertionDispatcher, ExceptionType} from "../common/AssertionDispatcher";
import {ServiceFailureException} from "../common/ServiceFailureException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, baseName != null && parent != null, "Base name and parent node must not be null or undefined.");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, !baseName.includes("/"), "Base name cannot contain '/'.");
    }

    public open(): void {
        try {
            AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.state === FileState.CLOSED, "File already open");
            // do something
            this.assertClassInvariants();
        } catch (e: any) {
            throw new ServiceFailureException("Could not open file", e);
        }
    }

    public read(noBytes: number): Int8Array {
        let result: Int8Array = new Int8Array(noBytes);
        // do something

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch (ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    // Oh no! What @todo?!
                    if (tries >= 3) {
                        throw ex;
                    }
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        try {
            AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.state === FileState.OPEN, "File already closed");
            // do something
            this.assertClassInvariants();
        } catch (e: any) {
            throw new ServiceFailureException("Could not close file", e);
        }
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}