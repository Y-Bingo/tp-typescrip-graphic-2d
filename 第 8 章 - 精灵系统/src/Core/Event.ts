import { vec2 } from '../Math/vec2';

/**
 * 事件类型枚举
 */
export enum EInputEventType {
	MOUSEEVENT, // 总类，表示鼠标事件
	MOUSEDOWN, // 鼠标按下事件
	MOUSEUP, // 鼠标弹起事件
	MOUSEMOVE, // 鼠标移动事件
	MOUSEDRAG, // 鼠标拖动事件
	KEYOARDEVENT, // 总类，表示键盘事件
	KEYUP, // 键按下的事件
	KEYDOWN, // 键弹起事件
	KEYPRESS, // 按键事件
}

/**
 * CanvasKeyboardEvent 和 CanvasMouseEvent都是继承本类
 * 基类定义了共同的属性，keyboard或mouse事件都能使用组合键
 * 列如可以按住Ctrl键同时单机鼠标左键做某些事情
 * 当然也可以按住啊Alt + A 键做另外一些事情
 */
export class CanvasInputEvent {
	public altKey: boolean;
	public ctrlKey: boolean;
	public shiftKey: boolean;
	// type 是一个枚举对象，用来表示当前的事件类型，枚举类型定义在下面的代码中
	public type: EInputEventType;

	// 构造函数，使用了default参数，初始化时3个组合键都是false状态
	public constructor(
		altKey: boolean = false,
		ctrlKey: boolean = false,
		shiftKey: boolean = false,
		type: EInputEventType = EInputEventType.MOUSEEVENT,
	) {
		this.altKey = altKey;
		this.ctrlKey = ctrlKey;
		this.shiftKey = shiftKey;
		this.type = type;
	}
}

export class CanvasMouseEvent extends CanvasInputEvent {
	// button 表示当前按下鼠标的哪个键
	// [ 0：鼠标左键 1：鼠标中键 2 ：鼠标右键 ]
	public button: number;
	// 基于canvas 坐标系的表示
	public canvasPosition: vec2;

	public localPosition: vec2;
	public hasLocalPosition: boolean;

	public constructor(canvasPos: vec2, button: number, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) {
		super(altKey, ctrlKey, shiftKey);

		this.canvasPosition = canvasPos;
		this.button = button;

		// 暂时创建爱你一个vec对象
		this.localPosition = vec2.create();
		this.hasLocalPosition = false;
	}
}

export class CanvasKeyBoardEvent extends CanvasInputEvent {
	// 当前按下的键的ASCII字符
	public key: string;
	// 当前按下的键的ASCII码（数字）
	public keyCode: number;

	// 当前按下的键是否不停的触发事件
	public repeat: boolean;
	public constructor(key: string, keyCode: number, repeat: boolean, altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false) {
		super(altKey, ctrlKey, shiftKey, EInputEventType.KEYOARDEVENT);

		this.key = key;
		this.keyCode = keyCode;
		this.repeat = repeat;
	}
}
