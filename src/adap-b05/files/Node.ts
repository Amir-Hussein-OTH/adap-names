import {ExceptionType, AssertionDispatcher} from "../common/AssertionDispatcher";
import {Exception} from "../common/Exception";
import {ServiceFailureException} from "../common/ServiceFailureException";

import {Name} from "../names/Name";
import {Directory} from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn != null && pn != null, "Base name and parent node must not be null or undefined.");
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.add(this);
    }

    public move(to: Directory): void {
        this.parentNode.remove(this);
        to.add(this);
        this.parentNode = to;
        this.assertClassInvariants();
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
        this.doSetBaseName(bn);
        this.assertClassInvariants();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, bn !== "" && bn !== null, "Invalid base name");
        let set: Set<Node> = new Set<Node>();
        try {

            if (bn == this.getBaseName()) {
                set.add(this);
            }
            this.assertClassInvariants();
        } catch (e: any) {
            ServiceFailureException.assertCondition(false, "findNodes failed....", e as Exception);
        }

        return set;
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
    }

    protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
        const condition: boolean = (bn != "");
        AssertionDispatcher.dispatch(et, condition, "invalid base name");
    }

}