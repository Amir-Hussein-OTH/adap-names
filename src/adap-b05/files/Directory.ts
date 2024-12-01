import {Node} from "./Node";
import {AssertionDispatcher, ExceptionType} from "../common/AssertionDispatcher";
import {InvalidStateException} from "../common/InvalidStateException";
import {ServiceFailureException} from "../common/ServiceFailureException";
import {MethodFailedException} from "../common/MethodFailedException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn != null && pn != null, "Base name and parent node must not be null or undefined.");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, !bn.includes("/"), "Base name cannot contain '/'.");
    }


    public add(cn: Node): void {
        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, cn != null, "Cannot add a null or undefined node.");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, !this.childNodes.has(cn), "The node already exists in the tree.");
        this.childNodes.add(cn);
        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, this.childNodes.has(cn), "The node was not successfully added.");
    }

    public remove(cn: Node): void {
        // precondition
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, cn != null, "Cannot remove a null or undefined node.");
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, this.childNodes.has(cn), "The specified node must exist in the tree to perform the delete operation.");
        this.childNodes.delete(cn);
        // postcondition
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION, !this.childNodes.has(cn), "The node was not successfully removed.");
    }


    public findNodes(bn: string): Set<Node> {
        try {
            AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, (bn != ""), "invalid base name");
            this.assertClassInvariants();

            let set: Set<Node> = super.findNodes(bn);
            for (const child of this.childNodes) {
                for (const node of child.findNodes(bn)) {
                    set.add(node)
                }
            }
            this.assertClassInvariants();
            return set;
        } catch (error) {
            if (error instanceof InvalidStateException || error instanceof MethodFailedException) {
                throw new ServiceFailureException("Failed to execute findNodes()...", error);
            } else {
                throw error;
            }
        }
    }
}
