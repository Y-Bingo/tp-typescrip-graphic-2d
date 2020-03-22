class RenderState {
    public lineWidth: number = 1;           // 默认情况下 lineWidth为 1 
    public strokeStyle: string = "red";     // 默认情况下 描边状态为红色
    public fillStyle: string = 'green';     // 默认情况下 填充状态为绿色
    // 克隆当前的RenderState并返回
    public clone(): RenderState {
        let state: RenderState = new RenderState();
        state.lineWidth = this.lineWidth;
        state.strokeStyle = this.strokeStyle;
        state.fillStyle = this.fillStyle;
        return state;
    }

    // 将this对象序列化JSON字符串
    public toString(): string {
        return JSON.stringify( this, null, "" );
    }
}

class RenderStatesStack {
    // 初始情况下，堆栈中有一个渲染状态对象，并且所有状态值都是默认值
    private _stack: RenderState[] = [ new RenderState() ];

    // 获取堆栈栈顶的渲染状态
    private get _currentState(): RenderState {
        return this._stack[ this._stack.length - 1 ];
    }

    // 克隆栈顶的元素，然后将克隆返回的元素进栈操作
    public save(): void {
        this._stack.push( this._currentState.clone() );
    }

    // 将栈顶元素丢弃，吃屎状态恢复到上一个状态
    public restore(): void {
        this._stack.pop();
    }

    /******************** 下面读写属性，都是操作栈顶元素 ********************/
    get lineWidth(): number {
        return this._currentState.lineWidth;
    }

    set lineWidth( value: number ) {
        this._currentState.lineWidth = value;
    }

    get strokeStyle(): string {
        return this._currentState.strokeStyle;
    }

    set strokeStyle( value: string ) {
        this._currentState.strokeStyle = value;
    }

    get fillStyle(): string {
        return this._currentState.fillStyle;
    }

    set fillStyle( value: string ) {
        this._currentState.fillStyle = value;
    }

    // 辅助方法：用来打印栈顶元素的状态值
    public printCurrentStateInfo(): void {
        console.log( this._currentState.toString() );
    }
}


// 测试代码

let stack: RenderStatesStack = new RenderStatesStack();
// step 1：打印出默认的全局状态
stack.printCurrentStateInfo();
// step 2： 克隆栈顶元素，并且克隆的状态压栈变成当前状态
stack.save();
// step 3：修改当前状态
stack.lineWidth = 10;
stack.fillStyle = "black";
stack.strokeStyle = 'blue';
// step 4: 打印出当前的状态
stack.printCurrentStateInfo();

// step 5: 丢弃当前状态
stack.restore();
// step 6: 再次打印一次状态
stack.printCurrentStateInfo();


export let a = 1;