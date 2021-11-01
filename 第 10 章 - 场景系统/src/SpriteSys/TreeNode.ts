import { IEnumerator } from '../Core/IEnumerator';

export type Indexer = (len: number, idx: number) => number;

export function IndexerL2R(len: number, idx: number): number {
	return idx;
}

export function IndexerR2L(len: number, idx: number): number {
	return len - idx - 1;
}

export type NodeCallback<T> = (node: TreeNode<T>) => void;

export interface IAdapter<T> {
	add(t: T): void;
	remove(): T | undefined;
	clear(): void;
	length: number;
	isEmpty: boolean;
}

export abstract class AdapterBase<T> implements IAdapter<T> {
	protected _arr: Array<T>;

	public constructor() {
		this._arr = new Array<T>();
	}

	public add(t: T): void {
		this._arr.push(t);
	}

	public abstract remove(): T | undefined;

	public get length(): number {
		return this._arr.length;
	}

	public get isEmpty(): boolean {
		return this._arr.length <= 0;
	}

	public clear(): void {
		this._arr = new Array<T>();
	}

	public toString(): string {
		return this._arr.toString();
	}
}

export class Stack<T> extends AdapterBase<T> {
	public remove(): T | undefined {
		if (this._arr.length > 0) return this._arr.pop();
		else return undefined;
	}
}

export class Queue<T> extends AdapterBase<T> {
	public remove(): T | undefined {
		if (this._arr.length > 0) return this._arr.shift();
		else return undefined;
	}
}

export class TreeNode<T> {
	/*
                                  树数据结构
            -------------------------root--------------------
           /                         |                      \
        node1                       node2                  node3
      /   |   \                    /      \                  |
 node4  node5 node6              node7   node8             node9
    |                            |         |
  node10                        node11  node12
                                           |
                                         node13
    */
	public constructor(data: T | undefined = undefined, parent: TreeNode<T> | undefined = undefined, name: string = '') {
		this._parent = parent;
		this._children = undefined;
		this.name = name;
		this.data = data;
		if (this._parent !== undefined) {
			this._parent.addChild(this);
		}
	}

	public addChildAt(child: TreeNode<T>, index: number): TreeNode<T> | undefined {
		if (this.isDescendantOf(child)) {
			return undefined;
		}

		if (this._children === undefined) {
			this._children = [];
			//this._children = new Array<TreeNode<T>>();
		}

		if (index >= 0 && index <= this._children.length) {
			if (child._parent) {
				child._parent.removeChild(child);
			}
			child._parent = this;
			this._children.splice(index, 0, child);
			return child;
		} else {
			return undefined;
		}
	}

	public addChild(child: TreeNode<T>): TreeNode<T> | undefined {
		if (this._children === undefined) {
			this._children = [];
		}
		return this.addChildAt(child, this._children.length);
	}

	public removeChildAt(index: number): TreeNode<T> | undefined {
		if (this._children === undefined) return undefined;

		let child: TreeNode<T> | undefined = this.getChildAt(index);

		if (child === undefined) {
			return undefined;
		}

		this._children.splice(index, 1); // 从子节点列表中移除掉
		child._parent = undefined; // 将子节点的父亲节点设置为undefined
		return child;
	}

	public removeChild(child: TreeNode<T> | undefined): TreeNode<T> | undefined {
		if (child == undefined) {
			return undefined;
		}

		if (this._children === undefined) {
			return undefined;
		}

		let index: number = -1;
		for (let i = 0; i < this._children.length; i++) {
			if (this.getChildAt(i) === child) {
				index = i;
				break;
			}
		}

		if (index === -1) {
			return undefined;
		}

		return this.removeChildAt(index);
	}

	public remove(): TreeNode<T> | undefined {
		if (this._parent !== undefined) {
			return this._parent.removeChild(this);
		}
		return undefined;
	}

	public getChildAt(index: number): TreeNode<T> | undefined {
		if (this._children === undefined) return undefined;
		if (index < 0 || index >= this._children.length) return undefined;
		return this._children[index];
	}

	public get childCount(): number {
		if (this._children !== undefined) {
			return this._children.length;
		} else {
			return 0;
		}
	}

	public hasChild(): boolean {
		return this._children !== undefined && this._children.length > 0;
	}

	public isDescendantOf(ancestor: TreeNode<T> | undefined): boolean {
		if (ancestor === undefined) return false;
		let node: TreeNode<T> | undefined = this._parent;
		for (let node: TreeNode<T> | undefined = this._parent; node !== undefined; node = node._parent) {
			if (node === ancestor) return true;
		}
		return false;
	}

	public get children(): Array<TreeNode<T>> | undefined {
		return this._children;
	}

	public get parent(): TreeNode<T> | undefined {
		return this._parent;
	}

	public get root(): TreeNode<T> | undefined {
		let curr: TreeNode<T> | undefined = this;
		while (curr !== undefined && curr.parent !== undefined) {
			curr = curr.parent;
		}

		return curr;
	}

	public get depth(): number {
		let curr: TreeNode<T> | undefined = this;
		let level: number = 0;
		while (curr !== undefined && curr.parent !== undefined) {
			curr = curr.parent;
			level++;
		}
		return level;
	}

	public repeatString(target: string, n: number): string {
		let total: string = '';
		for (let i = 0; i < n; i++) {
			total += target;
		}
		return total;
	}

	public visit(preOrderFunc: NodeCallback<T> | null = null, postOrderFunc: NodeCallback<T> | null = null, indexFunc: Indexer = IndexerL2R): void {
		if (preOrderFunc !== null) {
			preOrderFunc(this);
		}

		let arr: Array<TreeNode<T>> | undefined = this._children;
		if (arr !== undefined) {
			for (let i: number = 0; i < arr.length; i++) {
				let child: TreeNode<T> | undefined = this.getChildAt(indexFunc(arr.length, i));
				if (child !== undefined) {
					child.visit(preOrderFunc, postOrderFunc, indexFunc);
				}
			}
		}

		if (postOrderFunc !== null) {
			postOrderFunc(this);
		}
	}

	public visitForward(preOrderFunc: NodeCallback<T> | null = null, postOrderFunc: NodeCallback<T> | null = null): void {
		if (preOrderFunc) {
			preOrderFunc(this);
		}
		let node: TreeNode<T> | undefined = this.firstChild;
		while (node !== undefined) {
			node.visitForward(preOrderFunc, postOrderFunc);
			node = node.nextSibling;
		}
		if (postOrderFunc) {
			postOrderFunc(this);
		}
	}

	public visitBackward(preOrderFunc: NodeCallback<T> | null = null, postOrderFunc: NodeCallback<T> | null = null): void {
		if (preOrderFunc) {
			preOrderFunc(this);
		}
		let node: TreeNode<T> | undefined = this.lastChild;
		while (node !== undefined) {
			node.visitBackward(preOrderFunc, postOrderFunc);
			node = node.prevSibling;
		}
		if (postOrderFunc) {
			postOrderFunc(this);
		}
	}

	public printLevelInfo(idx: number = 0): void {
		let str: string = this.repeatString(' ', idx * 4);
		let arr: Array<TreeNode<T>> | undefined = this._children;
		if (arr !== undefined) {
			for (let i: number = 0; i < arr.length; i++) {
				let child: TreeNode<T> | undefined = this.getChildAt(i);
				if (child !== undefined) {
					child.printLevelInfo(idx + 1);
				}
			}
		}
		console.log('后根：' + str + this.name);
	}

	public printInfo(idx: number = 0): void {
		let str: string = this.repeatString(' ', idx * 4);
		console.log('先根：' + str + this.name);
		let node: TreeNode<T> | undefined = this.firstChild;
		while (node !== undefined) {
			node.printInfo(idx + 1);
			node = node.nextSibling;
		}
	}

	public printInfo2(idx: number = 0): void {
		let str: string = this.repeatString(' ', idx * 4);
		console.log('先根：' + str + this.name);
		let node: TreeNode<T> | undefined = this.lastChild;
		while (node !== undefined) {
			node.printInfo(idx + 1);
			node = node.prevSibling;
		}
	}

	public get firstChild(): TreeNode<T> | undefined {
		if (this._children !== undefined && this._children.length > 0) {
			return this._children[0];
		} else {
			return undefined;
		}
	}

	public get lastChild(): TreeNode<T> | undefined {
		if (this._children !== undefined && this._children.length > 0) {
			return this._children[this._children.length - 1];
		} else {
			return undefined;
		}
	}

	public get nextSibling(): TreeNode<T> | undefined {
		if (this._parent === undefined) {
			return undefined;
		}
		if (this._parent._children !== undefined && this._parent._children.length > 1) {
			let idx: number = -1;
			for (let i = 0; i < this._parent._children.length; i++) {
				if (this === this._parent._children[i]) {
					idx = i;
					break;
				}
			}
			if (idx !== this._parent._children.length - 1) {
				return this._parent._children[idx + 1];
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	}

	public get prevSibling(): TreeNode<T> | undefined {
		if (this._parent === undefined) {
			return undefined;
		}
		if (this._parent._children !== undefined && this._parent._children.length > 1) {
			let idx: number = -1;
			for (let i = 0; i < this._parent._children.length; i++) {
				if (this === this._parent._children[i]) {
					idx = i;
					break;
				}
			}
			if (idx !== 0) {
				return this._parent._children[idx - 1];
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	}

	public get mostRight(): TreeNode<T> | undefined {
		let node: TreeNode<T> | undefined = this;
		while (true) {
			let subNode: TreeNode<T> | undefined = undefined;
			if (node !== undefined) {
				subNode = node.lastChild;
			}
			if (subNode === undefined) {
				break;
			}
			node = subNode;
		}
		return node;
	}

	public get mostLeft(): TreeNode<T> | undefined {
		let node: TreeNode<T> | undefined = this;
		while (true) {
			let subNode: TreeNode<T> | undefined = undefined;
			if (node !== undefined) {
				subNode = node.firstChild;
			}
			if (subNode === undefined) {
				break;
			}
			node = subNode;
		}
		return node;
	}

	public moveNext(): TreeNode<T> | undefined {
		let ret: TreeNode<T> | undefined = this.firstChild;
		if (ret !== undefined) {
			return ret;
		}
		ret = this.nextSibling;
		if (ret !== undefined) {
			return ret;
		}
		ret = this;
		while (ret !== undefined && ret.nextSibling === undefined) {
			ret = ret.parent;
		}
		if (ret !== undefined) {
			return ret.nextSibling;
		}
		return undefined;
	}

	public movePrev(): TreeNode<T> | undefined {
		let ret: TreeNode<T> | undefined = this.lastChild;
		if (ret !== undefined) {
			return ret;
		}
		ret = this.prevSibling;
		if (ret !== undefined) {
			return ret;
		}
		ret = this;
		while (ret !== undefined && ret.prevSibling === undefined) {
			ret = ret.parent;
		}
		if (ret !== undefined) {
			return ret.prevSibling;
		}
		return undefined;
	}

	public moveNextPost(): TreeNode<T> | undefined {
		let next: TreeNode<T> | undefined = this.nextSibling;
		if (next === undefined) {
			return this.parent;
		}

		let first: TreeNode<T> | undefined = undefined;
		while (next !== undefined && (first = next.firstChild)) {
			next = first;
		}

		return next;
	}

	public movePrevPost(): TreeNode<T> | undefined {
		let prev: TreeNode<T> | undefined = this.prevSibling;
		if (prev === undefined) {
			return this.parent;
		}
		let last: TreeNode<T> | undefined = undefined;
		while (prev !== undefined && (last = prev.lastChild)) {
			prev = last;
		}
		return prev;
	}

	private _parent: TreeNode<T> | undefined;
	private _children: Array<TreeNode<T>> | undefined;

	public name: string;
	public data: T | undefined;
}

export class LinkTreeNode<T> {
	private _parent: LinkTreeNode<T> | undefined;
	private _firstChild: LinkTreeNode<T> | undefined;
	private _lastChild: LinkTreeNode<T> | undefined;
	private _nextSibling: LinkTreeNode<T> | undefined;
	private _prevSibling: LinkTreeNode<T> | undefined;

	public name: string = '';
	public data: T | undefined;
}

export class NodeT2BEnumerator<T, IdxFunc extends Indexer, Adapter extends IAdapter<TreeNode<T>>> implements IEnumerator<TreeNode<T>> {
	private _node: TreeNode<T> | undefined;
	private _adapter!: IAdapter<TreeNode<T>>;
	private _currNode!: TreeNode<T> | undefined;
	private _indexer!: IdxFunc;

	public constructor(node: TreeNode<T> | undefined, func: IdxFunc, adapter: new () => Adapter) {
		if (node === undefined) {
			return;
		}
		this._node = node;
		this._indexer = func;
		this._adapter = new adapter();

		this._adapter.add(this._node);
		this._currNode = undefined;
	}

	public reset(): void {
		if (this._node === undefined) {
			return;
		}
		this._currNode = undefined;
		this._adapter.clear();
		this._adapter.add(this._node);
	}

	public moveNext(): boolean {
		if (this._adapter.isEmpty) {
			return false;
		}

		this._currNode = this._adapter.remove();
		if (this._currNode != undefined) {
			let len: number = this._currNode.childCount;
			for (let i = 0; i < len; i++) {
				let childIdx: number = this._indexer(len, i);
				let child: TreeNode<T> | undefined = this._currNode.getChildAt(childIdx);
				if (child !== undefined) {
					this._adapter.add(child);
				}
			}
		}
		return true;
	}

	public get current(): TreeNode<T> | undefined {
		return this._currNode;
	}
}

export class NodeB2TEnumerator<T> implements IEnumerator<TreeNode<T>> {
	private _iter: IEnumerator<TreeNode<T>>;
	private _arr!: Array<TreeNode<T> | undefined>;
	private _arrIdx!: number;
	public constructor(iter: IEnumerator<TreeNode<T>>) {
		this._iter = iter;
		this.reset();
	}

	public reset(): void {
		this._arr = [];
		while (this._iter.moveNext()) {
			this._arr.push(this._iter.current);
		}
		this._arrIdx = this._arr.length;
	}

	public get current(): TreeNode<T> | undefined {
		if (this._arrIdx >= this._arr.length) {
			return undefined;
		} else {
			return this._arr[this._arrIdx];
		}
	}

	public moveNext(): boolean {
		this._arrIdx--;
		return this._arrIdx >= 0 && this._arrIdx < this._arr.length;
	}
}

export type NIter<T> = NodeT2BEnumerator<T, Indexer, IAdapter<TreeNode<T>>>;

export class NodeEnumeratorFactory {
	public static create_df_l2r_t2b_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
		let iter: IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerR2L, Stack);
		return iter;
	}

	public static create_df_r2l_t2b_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
		let iter: IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerL2R, Stack);
		return iter;
	}

	public static create_bf_l2r_t2b_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
		let iter: IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerL2R, Queue);
		return iter;
	}
	public static create_bf_r2l_t2b_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
		let iter: IEnumerator<TreeNode<T>> = new NodeT2BEnumerator(node, IndexerR2L, Queue);
		return iter;
	}

	public static create_df_l2r_b2t_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
		let iter: IEnumerator<TreeNode<T>> = new NodeB2TEnumerator<T>(NodeEnumeratorFactory.create_df_r2l_t2b_iter(node));
		return iter;
	}

	public static create_df_r2l_b2t_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
		let iter: IEnumerator<TreeNode<T>> = new NodeB2TEnumerator<T>(NodeEnumeratorFactory.create_df_l2r_t2b_iter(node));
		return iter;
	}

	public static create_bf_l2r_b2t_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
		let iter: IEnumerator<TreeNode<T>> = new NodeB2TEnumerator<T>(NodeEnumeratorFactory.create_bf_r2l_t2b_iter(node));
		return iter;
	}

	public static create_bf_r2l_b2t_iter<T>(node: TreeNode<T> | undefined): IEnumerator<TreeNode<T>> {
		let iter: IEnumerator<TreeNode<T>> = new NodeB2TEnumerator<T>(NodeEnumeratorFactory.create_bf_l2r_t2b_iter(node));
		return iter;
	}
}
