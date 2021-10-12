import { vec2 } from '../Math/vec2';
import { CanvasKeyBoardEvent, CanvasMouseEvent } from './Event';

// 回调函数别名
export type TimerCallback = (id: number, data: any) => void;

// 纯数据类
// 不需要到处Timer类，因为只是作为内部类使用
class Timer {
	public id: number = -1; // 计时器id
	public enabled: boolean = false; // 标记当前计时器是否有效
	public callback: TimerCallback; // 回调函数，到时间自动调用
	public callbackData: any = undefined; // 用作回调函数的参数
	public countdown: number = 0; // 倒计时器，每次update时会倒计时
	public timeout: number = 0;
	public onlyOnce: boolean = false;
	constructor(callback: TimerCallback) {
		this.callback = callback;
	}
}

export class Application implements EventListenerObject {
	canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		// canvas 元素能够监听的鼠标事件
		this.canvas.addEventListener('mousedown', this, false);
		this.canvas.addEventListener('mouseup', this, false);
		this.canvas.addEventListener('mousemove', this, false);

		// 注意：键盘事件不能再canvas中触发，但是能在全局的window对象中触发
		// 因此能在window对象中监听键盘事件
		window.addEventListener('keydown', this, false);
		window.addEventListener('keyup', this, false);
		window.addEventListener('keypress', this, false);

		// 初始化， mouseDown 为false
		this._isMouseDown = false;
		// 默认状态下，不支持mousemove事件
		this.isSupportMouseMove = false;
	}

	public timers: Timer[] = [];
	private _timeId: number = -1; // id 从0开始是有效id，负数是无效id值

	// 根据 id 在timers列表中查找
	// 如果找到，则设置timer的enabled为false，并且返回true
	// 如果没有找到，返回false
	public removeTimer(id: number): boolean {
		let found: boolean = false;
		for (let i = 0; i < this.timers.length; i++) {
			if (this.timers[i].id === id) {
				let timer: Timer = this.timers[i];
				timer.enabled = false; // 仅把enabled设置为false， 并没有从数组中删除
				found = true;
				break;
			}
		}
		return found;
	}

	// 初始化时，timers是空列表
	// 为了减少内存的析构，在removeTimer时，并不从timer中删除timer，而是设置enabled为false
	// 这样让内存使用量和析构达到相对平衡的状态
	// 每次添加一个计时器，线查看timers列表中是否存在可用的timer，有的话，返回该timer的id
	// 如果没有可用的timer，就重新new一个timer，并设置其id好及其他属性
	public addTimer(callback: TimerCallback, timeout: number = 1.0, onlyOnce: boolean = false, data: any = undefined): number {
		let timer: Timer;
		let found: boolean = false;
		for (let i = 0; i < this.timers.length; i++) {
			let timer: Timer = this.timers[i];
			if (timer.enabled === false) {
				timer.callback = callback;
				timer.callbackData = data;
				timer.timeout = timeout;
				timer.countdown = timeout;
				timer.enabled = true;
				timer.onlyOnce = onlyOnce;
				return timer.id;
			}
		}

		// 列表里面没有可用的timer
		timer = new Timer(callback);
		timer.callbackData = data;
		timer.timeout = timeout;
		timer.countdown = timeout;
		timer.enabled = true;
		timer.id = ++this._timeId;
		timer.onlyOnce = onlyOnce;

		// 添加到列表中
		this.timers.push(timer);

		return timer.id;
	}

	// 计时器依赖于requestAnimationFrame回调
	// 如果当前Application没有调用start的话
	// 则计时器不会生效
	private _handelTimers(intervalSec: number): void {
		// 遍历整个timers列表
		for (let i = 0; i < this.timers.length; i++) {
			let timer: Timer = this.timers[i];
			if (timer.enabled === false) continue;

			// countdown 初始化时 == timeout
			// 每次调用本函数，会较少上下帧的时间间隔，也就是update第二个参数传来的值
			// 从而形成倒计时的效果
			timer.countdown -= intervalSec;
			// 如果countdown 小于 0.0，那么说明时间到了
			// 要触发回调了
			// 从这里看到，实际上timer并不是很精确
			// 举个例子，假设update每次0.16s
			// timer 设置0.3秒回调一次
			// 那么实际上是（ 0.3 - 0.32 ） < 0，触发回调
			if (timer.countdown < 0.0) {
				// 调用回调函数
				timer.callback(timer.id, timer.callbackData);
				// 下面的代码两个分支分别处理触发一次的和重复触发的操作
				// 如果计时器需要重复触发
				if (timer.onlyOnce === false) {
					// 重新将countdown设置为timeout
					// 由此， timeout 不会更换，它规定触发的时间间隔
					// 每次更新的是 countdown倒计时器
					timer.countdown = timer.timeout;
				} else {
					this.removeTimer(timer.id);
				}
			}
		}
	}

	// 当前帧率
	private _fps: number = 0;
	public get fps() {
		return this._fps;
	}

	// _start 成员变量用于标记当前Application是否进入不间断地循环状态
	protected _start: boolean = false;

	// 由window对象的requestAnimationFrame返回的大于0的id号
	protected _requestId: number = -1;

	// 用于基于时间的物理更新，这些成员变量类型其那面用了！，可以进行延迟赋值操作
	protected _lastTime!: number;
	protected _startTime!: number;

	public start(): void {
		if (!this._start) {
			this._start = true;
			this._requestId = -1; // 将_requestId 设置为-1
			// 在start和stop函数中，_lastTime 和 this._startTime都设置为-1
			this._lastTime = -1;
			this._startTime = -1;
			// 启动循环更新渲染
			this._requestId = requestAnimationFrame((elapsedMsec: number): void => {
				// 启动step方法
				this.step(elapsedMsec);
			});
		}
	}

	public stop(): void {
		if (this._start) {
			// 取消先前通过requestAnimationFrame方法添加的动画帧请求
			window.cancelAnimationFrame(this._requestId);
			this._requestId = -1; // 将requestId 设置为-1
			// 在start和stop函数中，_lastTime 和 this._startTime都设置为-1
			this._lastTime = -1;
			this._startTime = -1;
			this._start = false;
		}
	}

	/** 查询当前是否处于动画循环状态 */
	public isRunning(): boolean {
		return this._start;
	}

	protected step(timestamp: number): void {
		// 第一次调用本函数时，设置start和lastTime为timeStamp
		if (this._startTime === -1) this._startTime = timestamp;
		if (this._lastTime === -1) this._lastTime = timestamp;
		// 计算当前时间点与第一次调用step时间点的差，已毫秒为单位
		let elapsedMsec: number = timestamp - this._startTime;
		// 计算当前时间点与上一次调用step的时间点的差（可以理解为两帧之间的差）
		// NOTICE：intervalSec是以秒为单位，因此要除以1000.0
		let intervalSec: number = timestamp - this._lastTime;

		// 添加关于FPS的计算
		if (intervalSec !== 0) {
			this._fps = 1000.0 / intervalSec;
		}
		intervalSec /= 1000.0;

		// 记录上一次的时间戳
		this._lastTime = timestamp;

		this._handelTimers(intervalSec);

		// console.log( " elapsedTime =  " + elapsedMsec + " intervalSec =  " + intervalSec );
		// 先更新
		this.update(elapsedMsec, intervalSec);
		// 后渲染
		this.render();
		// 递归调用，形成周而复始地循环操作
		this._requestId = requestAnimationFrame(this.step.bind(this));
	}

	// 虚方法，子类覆写（override）
	// elapsedMsec 是以毫秒为单位，intervalSec是以秒为单位
	public update(elapsedMsec: number, intervalSec: number): void {}

	// 虚方法， 子类覆写（override）
	public render(): void {}

	// 将鼠标事件发生鼠标指针的位置变换为相对当前canvas元素的偏移表示
	// 这是一个私有方法，以为着只能在本类中使用，子类和其他类都无法调用本方法
	// 只要是鼠标事件（ down/ up / move / drag....）都需要调用本方法
	// 将相对于浏览器veiwport表示的点变换到相对于canvas表示的点
	private _viewportToCanvasCoordinate(evt: MouseEvent): vec2 {
		if (this.canvas) {
			let rect: ClientRect = this.canvas.getBoundingClientRect();
			// 作为测试，每次mousedown时，打印出当前canvas的boundClinetRect的位置和尺寸
			// 同时打印出MouseEvent的clientX / clientY属性
			if (evt.type === 'mousedown') {
				console.log('boundingClientRect : ' + JSON.stringify(rect));
				console.log('clientX: ' + evt.clientX + ' clientY : ' + evt.clientY);
			}

			// 获取触发鼠标事件的target元素，这里总是HTMLCanvasElement
			if (evt.target) {
				let borderLeftWidth: number = 0; // 返回 border 左侧离margin的宽度
				let borderTopWidth: number = 0; // 返回 border 上侧离margin的宽度
				let paddingLeft: number = 0; // 返回 padding 相对border左偏移
				let paddingTop: number = 0; // 返回 padding 相对border上偏移

				// 调用getComputedStyle方法，这个方法比较有用
				let decl: CSSStyleDeclaration = window.getComputedStyle(evt.target as HTMLCanvasElement);
				// 需要注意，CSSStyleDeclaration中的数值都是字符串表示，而且有可能返回null
				// 所以需要进行null值判断
				// 并且返回的坐标都是以像素表示的，所以是整数类型
				// 使用parseInt转换为十进制整数表示
				let strNumber: string | null = decl.borderLeftWidth;
				if (strNumber !== null) {
					borderLeftWidth = parseInt(strNumber, 10);
				}
				strNumber = decl.borderTopWidth;
				if (strNumber !== null) {
					borderTopWidth = parseInt(strNumber, 10);
				}
				strNumber = decl.paddingLeft;
				if (strNumber !== null) {
					paddingLeft = parseInt(strNumber, 10);
				}
				strNumber = decl.paddingTop;
				if (strNumber !== null) {
					paddingTop = parseInt(strNumber, 10);
				}

				// a = evt.clientX - rect.left 将鼠标点从viewport坐标系转换到border坐标系
				// b = a - borderLeftWidth, 将border坐标系变换到padding坐标系
				// x = b - paddingLeft, 将 padding坐标系变换到context坐标系，也就是canvas元素的坐标系
				let x: number = evt.clientX - rect.left - borderLeftWidth - paddingLeft;
				let y: number = evt.clientY - rect.top - borderTopWidth - paddingTop;
				// 变成向量表示
				let pos: vec2 = vec2.create(x, y);

				// DEBUG: 使用输出相关信息
				if (evt.type === 'mousedown') {
					console.log(' borderLeftWidth: ' + borderLeftWidth + ' borderTopWidth : ' + borderTopWidth);
					console.log(' paddingLeft :' + paddingLeft + ' paddingTop :' + paddingTop);
					console.log(' 变换后的canvasPosition ：' + pos.toString());
				}
				return pos;
			}
			alert('target 为 null ');
			throw new Error(' target 为 null ');
		}

		alert('canvas 为 null ');
		throw new Error(' canvas 为 null ');
	}

	// 将 DOM Event 对象的信息转换为自己定义的CanvasMouseEvent事件
	private _toCanvasMouseEvent(evt: Event): CanvasMouseEvent {
		// 向下转型，将Event转换为MouseEvent
		let event: MouseEvent = evt as MouseEvent;
		// 将客户区的鼠标pos变换到Canvas坐标系中表示
		let mousePosition: vec2 = this._viewportToCanvasCoordinate(event);
		// 将 Event 一些要用到的信息传递给CanvasMouseEvent 并返回
		let canvasMouseEvent: CanvasMouseEvent = new CanvasMouseEvent(mousePosition, event.button, event.altKey, event.ctrlKey, event.shiftKey);

		return canvasMouseEvent;
	}

	// 将 DOM Event 对象的信息转换为自己定义的 keyboard事件
	private _toCanvasKeyboardEvent(evt: Event): CanvasKeyBoardEvent {
		// 向下转型，将Event转换为MouseEvent
		let event: KeyboardEvent = evt as KeyboardEvent;
		// 将 Event 一些要用到的信息传递给CanvasMouseEvent 并返回
		let canvasKeyboardEvent: CanvasKeyBoardEvent = new CanvasKeyBoardEvent(
			event.key,
			event.keyCode,
			event.repeat,
			event.altKey,
			event.ctrlKey,
			event.shiftKey,
		);

		return canvasKeyboardEvent;
	}

	// 如果下面变量设置为true，则每次鼠标移动都会触发mousemove事件
	// 否则就不会触发
	public isSupportMouseMove: boolean;
	// 使用以下变量类标记当前鼠标还是否为按下状态
	// 目的是提供mousedrag事件
	protected _isMouseDown: boolean;
	// 调用dispatchXXXX虚方法进行事件分发
	// handleEvent是接口EventListenerOvject定义的接口方法，必须要实现
	public handleEvent(evt: Event): void {
		// 根据事件的类型，调用对应的dispatchXXXX虚方法
		switch (evt.type) {
			case 'mousedown':
				this._isMouseDown = true;
				this.dispatchMouseDown(this._toCanvasMouseEvent(evt));
				break;
			case 'mouseup':
				this._isMouseDown = false;
				this.dispatchMouseUp(this._toCanvasMouseEvent(evt));
				break;
			case 'mousemove':
				// 如果 isSupportMouseMove为true，则每次鼠标移动会触发mouseMove事件
				if (this.isSupportMouseMove) {
					this.dispatchMouseMove(this._toCanvasMouseEvent(evt));
				}
				// 同时，如果当前鼠标任意一个键处于按下状态并拖动，触发drag事件
				if (this._isMouseDown) {
					this.dispatchMouseDrag(this._toCanvasMouseEvent(evt));
				}
				break;
			case 'keypress':
				this.dispatchKeyPress(this._toCanvasKeyboardEvent(evt));
				break;
			case 'keydown':
				this.dispatchKeyDown(this._toCanvasKeyboardEvent(evt));
				break;
			case 'keyup':
				this.dispatchKeyUp(this._toCanvasKeyboardEvent(evt));
				break;
			default:
				break;
		}
	}

	// 虚方法，子类覆写（override）
	protected dispatchMouseDown(evt: CanvasMouseEvent): void {}
	// 虚方法，子类覆写（override）
	protected dispatchMouseUp(evt: CanvasMouseEvent): void {}
	// 虚方法，子类覆写（override）
	protected dispatchMouseMove(evt: CanvasMouseEvent): void {}
	// 虚方法，子类覆写（override）
	protected dispatchMouseDrag(evt: CanvasMouseEvent): void {}
	// 虚方法，子类覆写（override）
	protected dispatchKeyPress(evt: CanvasKeyBoardEvent): void {}
	// 虚方法，子类覆写（override）
	protected dispatchKeyDown(evt: CanvasKeyBoardEvent): void {}
	// 虚方法，子类覆写（override）
	protected dispatchKeyUp(evt: CanvasKeyBoardEvent): void {}
}
