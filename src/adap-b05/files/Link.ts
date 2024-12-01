import {Node} from "./Node";
import {Directory} from "./Directory";
import {AssertionDispatcher, ExceptionType} from "../common/AssertionDispatcher";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn != null && pn != null, "Base name and parent node must not be null or undefined.");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, !bn.includes("/"), "Base name cannot contain '/'.");

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn != null, "Base name must not be null or undefined.");
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, target != null, "Target is null");
        const result: Node = this.targetNode as Node;
        return result;
    }
}