import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./Event";
import { Canvas2DApplication } from "./Canvas2DApplication";
import { Size, Rectangle, vec2, Math2D } from "./math2D";

export type Repeatition = "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
// 文字左右对齐
export type TextAlign = "start" | "left" | "center" | "right" | "end";
// 文字上下对齐
export type TextBaseLine = "alphabetic" | "hanging" | "top" | "middle" | "bottom";
// 文字样式
export type FontType = "10px sans-serif" | "15px sans-serif" | "20px sans-serif" | "25px sans-serif";
export type FontStyle = "normal" | "italic" | "oblique";
export type FontVariant = "normal" | "small-caps";
export type FontWeight = "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
export type FontSize = "10px" | "12px" | "16px" | "18px" | "24px" | "50%" | "75%" | "100%" | "125%" | "xx-small" | "x-small" | "small" | "medium" | "large" | "x-large" | "xx-large";
export type FontFamily = "sans-serif" | "serif" | "courier" | "fantasy" | "monspace";

const Colors: string[] = [
    'aqua',    //浅绿色
    'black',   //黑色
    'blue',    //蓝色 
    'fuchsia', //紫红色
    'gray',     //灰色
    'green',   //绿色
    'lime',    //绿黄色
    'maroon',  //褐红色
    'navy',    //海军蓝
    'olive',   //橄榄色
    'orange',  //橙色
    'purple',  //紫色
    'red',      //红色
    'silver',  //银灰色
    'teal',    //蓝绿色
    'yellow',   //黄色
    'white'   //白色
];

// 布局
export enum ELayout {
    LEFT_TOP,
    RIGHT_TOP,
    RIGHT_BOTTOM,
    LEFT_BOTTOM,
    CENTER_MIDDLE,
    CENTER_TOP,
    RIGHT_MIDDLE,
    CENTER_BOTTOM,
    LEFT_MIDDLE
}

// 填充
export enum EImageFillType {
    STRETCH,            // 拉伸模式
    REPEAT,             // xy重复填充模式
    REPEAT_X,           // x方向重复填充模式
    REPEAT_Y,           // y方向重复填充模式
}

export class ApplicationTest extends Canvas2DApplication {

    private _mouseX: number = 0;
    private _mouseY: number = 0;

    private _rotationSunSpeed: number = 50;     // 太阳自转的角速度，以角为单位
    private _rotationMoonSpeed: number = 100;   // 月球自转的速度，以角为单位
    private _revolutionSpeed: number = 60;      // 月球公转的角速度

    private _rotationSun: number = 0;           // 太阳自转的角位移
    private _rotationMoon: number = 0;          // 月亮自转的角位移
    private _revolution: number = 0;            // 月球围绕太阳公转的角位移

    constructor ( canvas: HTMLCanvasElement, contextAttributes?: CanvasRenderingContext2DSettings ) {
        super( canvas, contextAttributes );

        this.isSupportMouseMove = true;
    }

    protected dispatchKeyDown( evt: CanvasKeyBoardEvent ): void {
        // console.log( ' key: ' + evt.key + ' is down ' );
    }

    protected dispatchMouseDown( evt: CanvasMouseEvent ): void {
        // console.log( ' canvasPosition ： ' + evt.canvasPosition );
    }

    protected dispatchMouseMove( evt: CanvasMouseEvent ): void {
        this._mouseX = evt.canvasPosition.x;
        this._mouseY = evt.canvasPosition.y;
    }

    public update( elapsedMsec: number, intervalSec: number ): void {
        // console.log( ' elapsedMsec : ' + elapsedMsec + ' intervalSec : ' + intervalsSec );
        // 角位移公式
        this._rotationMoon += this._rotationMoonSpeed * intervalSec;
        this._rotationSun += this._rotationSunSpeed * intervalSec;
        this._revolution += this._revolutionSpeed * intervalSec;

    }

    public start(): void {
        this.addTimer( this.timeCallBack.bind( this ), 0.05 );
        super.start();

    }

    public timeCallBack( id: number, data: any ): void {
        this._updateLineDashOffset();
        this._drawRect( 10, 10, this.canvas.width - 20, this.canvas.height - 20 );
    }

    public render(): void {
        // console.log( ' 调用render 方法！' );
        if ( this.context2D !== null ) {
            // step 1: 在渲染其他物体前，先调用clearRect清屏
            this.context2D.clearRect( 0, 0, this.context2D.canvas.width, this.context2D.canvas.height );

            this.strokeGrid();
            // 绘制中心原点 x，y轴
            this.drawCanvasCoordCenter();

            // 绘制圆弧
            // let radians: number = this.distance( 0, 0, this.canvas.width * 0.5, this.canvas.height * 0.5 );
            // this.strokeCircle( 0, 0, radians );

            // this.doTransform1();
            // this.doTransform2( 30 );
            // this.doTransform2( 30, false );

            // app.testFillLocalRectWitTile();
            this.rotationAndRevolutionSimulation();

            this.drawCoordInfo( `[  ${ this._mouseX }, ${ this._mouseY }]`, this._mouseX, this._mouseY );
        }
    }

    private _lineDashOffset: number = 0;
    // 实现一个更新 lineDashOffset的函数
    private _updateLineDashOffset(): void {
        // 每次计时器回调，更新 1 像素偏移量
        this._lineDashOffset++;

        // 如果偏移量超过 10000 ,就从0 开始
        if ( this._lineDashOffset > 10000 ) {
            this._lineDashOffset = 0;
        }
    }

    private _drawRect( x: number, y: number, w: number, h: number ): void {
        if ( this.context2D !== null ) {
            //step 2： 每次绘制总是使用 save / restore 对
            this.context2D.save();
            // step 3: 在渲染状态save后，设置当前的渲染状态
            this.context2D.fillStyle = 'grey';
            this.context2D.strokeStyle = 'blue';
            this.context2D.lineWidth = 2;
            // 长度为10，中间间隔为5
            this.context2D.setLineDash( [ 10, 5 ] );
            // 每次重绘修改lineDashOffset的偏移值，从而形成动画
            this.context2D.lineDashOffset = this._lineDashOffset;
            // step 4: 使用beginPath产生一个子路径
            this.context2D.beginPath();
            // 左手系，左手舒适枕放心啊定义顶点坐标
            // step 5: 在子路径中添加及向量点
            this.context2D.moveTo( x, y );              // 左上方
            this.context2D.lineTo( x + w, y );          // 右上
            this.context2D.lineTo( x + w, y + h );      // 右下
            this.context2D.lineTo( x, y + h );          // 左下
            // step 6: 如果是封闭图形，调用closepath方法
            // 要绘制封闭的轮廓边，因此调用closepath后会自动在起点和结束点之间产生一条连线
            this.context2D.closePath();
            // step 7：如果填充，使用fill
            this.context2D.fill();
            // step 8: 如果是描边，使用stroke
            this.context2D.stroke();
            // 恢复渲染状态
            this.context2D.restore();
        }
    }

    // 使用图案对象描边和填充
    private _pattern!: CanvasPattern | null;
    public fillPatternRect( x: number, y: number, w: number, h: number, repeat: Repeatition = 'repeat' ): void {
        if ( this.context2D !== null ) {
            if ( this._pattern == undefined ) {
                // 注意：createElement中image类型使用‘img’拼写，不能写错
                let img: HTMLImageElement = document.createElement( 'img' ) as HTMLImageElement;
                // 设置需要载入的图片URL相对路径
                img.src = './resource/test.jpg';
                img.onload = ( evt: Event ): void => {
                    if ( this.context2D !== null ) {
                        // 调用createPattern 方法
                        this._pattern = this.context2D?.createPattern( img, repeat );
                        // 当图片成功载入的到浏览器的时候CIA会调用下面的代码
                        if ( this._pattern ) {
                            // 设置线性渐变对象
                            this.context2D.save();
                            this.context2D.fillStyle = this._pattern;
                            this.context2D.beginPath();
                            this.context2D.rect( x, y, w, h );
                            this.context2D.fill();
                            this.context2D.restore();
                        }

                    };
                };
            } else {
                // 如果已经存在patter，则会运行这段代码
                // 设置线性渐变对象;
                this.context2D.save();
                this.context2D.fillStyle = this._pattern;
                this.context2D.beginPath();
                this.context2D.rect( x, y, w, h );
                this.context2D.fill();
                this.context2D.restore();
            }
        }
    }

    // 点或圆的绘制
    public fillCircle( x: number, y: number, radius: number, fillStyle: string | CanvasGradient | CanvasPattern = 'red' ): void {
        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.fillStyle = fillStyle;
            this.context2D.beginPath();

            // 圆是圆弧的特殊表示形式
            this.context2D.arc( x, y, radius, 0, Math.PI * 2 );
            this.context2D.fill();
            this.context2D.restore();
        }
    }

    // 绘制颜色方块
    public fillRectangleWithColor( rect: Rectangle, fillColor: string = "black" ): void {
        if ( rect.isEmpty() ) {
            return;
        }

        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.fillStyle = fillColor;
            this.context2D.rect( rect.origin.x, rect.origin.y, rect.size.width, rect.size.height );
            this.context2D.fill();
            this.context2D.restore();
        }
    }

    // 线段的绘制
    // 和以前的绘制方法相比， 没有进行状态的save/restore 操作
    // 也没有任何的修改渲染属性
    // 纯粹的stroke操作
    // 这是因为这个方法被其他方法调用多次，由调用方进行状态的管理和状态的设置
    public strokeLine( x0: number, y0: number, x1: number, y1: number, ): void {
        if ( this.context2D !== null ) {
            this.context2D.beginPath();
            this.context2D.moveTo( x0, y0 );
            this.context2D.lineTo( x1, y1 );
            this.context2D.stroke();
        }
    }

    // 调用上面的strokeLine方法，绘制坐标系
    public strokeCoord( originX: number, originY: number, width: number, height: number ): void {
        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.strokeStyle = "red";
            this.strokeLine( originX, originY, originX + width, originY );
            this.context2D.strokeStyle = 'blue';
            this.strokeLine( originX, originY, originX, originY + height );
            this.context2D.restore();
        }
    }

    // 绘制圆
    public strokeCircle( x: number, y: number, radius: number, strokeStyle: string = "black", lineWidth: number = 2 ): void {
        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.strokeStyle = strokeStyle;
            this.context2D.lineWidth = lineWidth;

            this.context2D.beginPath();
            this.context2D.arc( x, y, radius, 0 * Math.PI / 180, 360 * Math.PI / 180 );
            this.context2D.closePath();
            this.context2D.stroke();
            this.context2D.restore();
        }
    }

    // 制网格背景
    // 参数interval控制每个网格横向和纵向的间隔大小
    public strokeGrid( color: string = 'grey', interval: number = 10 ): void {
        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.strokeStyle = color;
            // 从左到右每隔interval个像素绘制一条垂线
            for ( let i = interval; i <= this.canvas.height; i += interval )
                this.strokeLine( 0, i, this.canvas.width, i );

            // 从上到下每隔interval个像素绘制一条水平线
            for ( let i = interval; i <= this.canvas.width; i += interval )
                this.strokeLine( i, 0, i, this.canvas.height );
            this.context2D.restore();

            // 绘制网格背景的全局坐标系原定
            this.fillCircle( 0, 0, 5, "green" );
            // 为网格背景绘制坐标系
            // canvas中全局坐标系的原点在左上角，并且x轴总是指向右侧，y轴指向下方
            this.strokeCoord( 0, 0, this.canvas.width, this.canvas.height );
        }
    }

    // 绘制文本
    public fillText( text: string, x: number, y: number, color: string = 'white', align: TextAlign = "left", baseLine: TextBaseLine = "top", font: FontType = "10px sans-serif" ): void {
        if ( this.context2D !== null ) {
            this.context2D.save();

            this.context2D.textAlign = align;
            this.context2D.textBaseline = baseLine;
            this.context2D.font = font;
            this.context2D.fillStyle = color;
            this.context2D.fillText( text, x, y );

            this.context2D.restore();
        }
    }

    public strokeRect( x: number, y: number, w: number, h: number, color: string = 'black' ): void {
        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.strokeStyle = color;
            this.context2D.beginPath();
            this.context2D.moveTo( x, y );
            this.context2D.lineTo( x + w, y );
            this.context2D.lineTo( x + w, y + h );
            this.context2D.lineTo( x, y + h );
            this.context2D.closePath();
            this.context2D.stroke();
            this.context2D.restore();
        }
    }

    // 测试文本对齐方式
    public testCanvas2DTextLayout(): void {

        // 要绘制的矩形离canvas的margin分别是[ 20 , 20, 20, 20]
        let x: number = 20;
        let y: number = 20;
        let width: number = this.canvas.width - x * 2;
        let height: number = this.canvas.height - y * 2;
        let drawX: number = x;
        let drawY: number = y;
        let radius: number = 3;
        // 1. 画背景rect
        this.fillRectWithTitle( x, y, width, height );
        // 2. 左上
        this.fillText( "left-top", drawX, drawY, 'white', 'left', 'top', '20px sans-serif' );
        this.fillCircle( drawX, drawY, radius, 'black' );
        // 3. 右上
        drawX = x + width;
        drawY = y;
        this.fillText( "right-top", drawX, drawY, 'white', 'right', 'top', '20px sans-serif' );
        this.fillCircle( drawX, drawY, radius, 'black' );
        // 4. 右下
        drawX = x + width;
        drawY = y + height;
        this.fillText( "right-bottom", drawX, drawY, 'white', 'right', 'bottom', '20px sans-serif' );
        this.fillCircle( drawX, drawY, radius, 'black' );
        // 5. 左下
        drawX = x;
        drawY = y + height;
        this.fillText( "left-bottom", drawX, drawY, 'white', 'left', 'bottom', '20px sans-serif' );
        this.fillCircle( drawX, drawY, radius, 'black' );
        // 6. 中心
        drawX = x + width * 0.5;
        drawY = y + height * 0.5;
        this.fillText( "center-middle", drawX, drawY, 'red', 'center', 'middle', '20px sans-serif' );
        this.fillCircle( drawX, drawY, radius, 'black' );
        // 7. 中上
        drawX = x + width * 0.5;
        drawY = y;
        this.fillText( "center-top", drawX, drawY, 'blue', 'center', 'top', '20px sans-serif' );
        this.fillCircle( drawX, drawY, radius, 'black' );
        // 8. 右中;
        drawX = x + width;
        drawY = y + height * 0.5;
        this.fillText( "right-middle", drawX, drawY, 'blue', 'right', 'middle', '20px sans-serif' );
        this.fillCircle( drawX, drawY, radius, 'black' );
        // 9. 中下
        drawX = x + width * 0.5;
        drawY = y + height;
        this.fillText( "center-bottom", drawX, drawY, 'blue', 'center', 'bottom', '20px sans-serif' );
        this.fillCircle( drawX, drawY, radius, 'black' );
        // 8. 左中;
        drawX = x;
        drawY = y + height * 0.5;
        this.fillText( "left-middle", drawX, drawY, 'blue', 'left', 'middle', '20px sans-serif' );
        this.fillCircle( drawX, drawY, radius, 'black' );
    }

    // 测对齐文本
    public testMyTextLayout( font: string = this.makeFontString( "10px", "normal", "normal", "normal", 'sans-serif' ) ): void {
        let x: number = 20;
        let y: number = 20;
        let width: number = this.canvas.width - x * 2;
        let height: number = this.canvas.height - y * 2;
        let right: number = x + width;
        let bottom: number = y + height;
        let drawX: number = x;
        let drawY: number = y;
        let drawWidth: number = 150;
        let drawHeight: number = 50;

        if ( this.context2D !== null ) {
            this.context2D.save();
            this.context2D.font = font;

            // 1. 画背景rect
            this.fillRectWithTitle( x, y, width, height );
            // 2. 左上
            this.fillRectWithTitle( drawX, drawY, drawWidth, drawHeight, 'LEFT-TOP', ELayout.LEFT_TOP, 'rgba( 255, 255,0, 0.2)' );
            // 3. 右上
            drawX = right - drawWidth;
            drawY = y;
            this.fillRectWithTitle( drawX, drawY, drawWidth, drawHeight, "RIGHT-TOP", ELayout.RIGHT_TOP, 'rgba( 255, 255,0, 0.2)' );
            // 4. 右下
            drawX = right - drawWidth;
            drawY = bottom - drawHeight;
            this.fillRectWithTitle( drawX, drawY, drawWidth, drawHeight, "RIGHT-BOTTOM", ELayout.RIGHT_BOTTOM, 'rgba( 255, 255,0, 0.2)' );
            // 5. 左下
            drawX = x;
            drawY = bottom - drawHeight;
            this.fillRectWithTitle( drawX, drawY, drawWidth, drawHeight, "LEFT-BOTTOM", ELayout.LEFT_BOTTOM, 'rgba( 255, 255,0, 0.2)' );
            // 6. 中心
            drawX = ( right - drawWidth ) * 0.5;
            drawY = ( bottom - drawHeight ) * 0.5;
            this.fillRectWithTitle( drawX, drawY, drawWidth, drawHeight, "CENTER-MIDDLE", ELayout.CENTER_MIDDLE, 'rgba( 255, 0,0, 0.2)' );
            // 7. 中上
            drawX = ( right - drawWidth ) * 0.5;
            drawY = y;
            this.fillRectWithTitle( drawX, drawY, drawWidth, drawHeight, "CENTER-TOP", ELayout.CENTER_TOP, 'rgba( 0, 255,0, 0.2)' );
            // 8. 右中;
            drawX = right - drawWidth;
            drawY = ( bottom - drawHeight ) * 0.5;
            this.fillRectWithTitle( drawX, drawY, drawWidth, drawHeight, "RIGHT-MIDDLE", ELayout.RIGHT_MIDDLE, 'rgba( 0, 255,0, 0.2)' );
            // 9. 中下
            drawX = ( right - drawWidth ) * 0.5;
            drawY = ( bottom - drawHeight );
            this.fillRectWithTitle( drawX, drawY, drawWidth, drawHeight, "CENTER-BOTTOM", ELayout.CENTER_BOTTOM, 'rgba( 0, 255,0, 0.2)' );
            // 8. 左中;
            drawX = x;
            drawY = ( bottom - drawHeight ) * 0.5;
            this.fillRectWithTitle( drawX, drawY, drawWidth, drawHeight, "LEFT-MIDDLE", ELayout.LEFT_MIDDLE, 'rgba( 0, 255,0, 0.2)' );
            this.context2D.restore();
        }

    }

    public calTextSize( text: string, char: string = "W", scale: number = 0.5 ): Size {
        if ( this.context2D !== null ) {
            let size: Size = new Size();
            size.width = this.context2D.measureText( text ).width;
            let w: number = this.context2D.measureText( char ).width;
            size.height = w + w * scale; // 宽度加上scale比例

            return size;
        }

        alert( "context2D渲染上下文为null" );
        throw new Error( "context2D渲染上下文为null" );
    }

    // parentWidth / parentHeight 是父矩形的尺寸
    // 函数返回类型是Rectangle，表示9个文本子矩形之一
    // 这些子矩形是相对父矩形坐标系的表示
    // 这意味着父矩形的原点为[ 0, 0 ]， 所以参数是父矩形的width和height，而没有x和y坐标
    public calcLocalTextRectangle( layout: ELayout, text: string, parentWidth: number, parentHeight: number ): Rectangle {
        // 首先要计算要绘制的文本的尺寸（ width / height ）
        let s: Size = this.calTextSize( text );
        // 创建一个二维向量
        let o: vec2 = vec2.create();
        // 计算出当前文本子矩形左上角相对于父矩形空间中3个关键点( 左上，中心，右下)坐标
        // 1. 当前文本矩形左上角相对于父矩形左上角的坐标，由于局部表示，所以为[ 0, 0 ]
        let left: number = 0;
        let top: number = 0;
        // 2. 当前文本子矩形左上角相对于父矩形右下角坐标
        let right: number = parentWidth - s.width;
        let bottom: number = parentHeight - s.height;
        // 3. 当前文本矩形左上角相对于父矩形中心坐标
        let center: number = right * 0.5;
        let middle: number = bottom * 0.5;
        // 根据ETextLayout的值来匹配这3个点的分量
        // 计算子矩形相对于父矩形原点[ 0, 0 ]偏移量
        switch ( layout ) {
            case ELayout.LEFT_TOP:
                o.x = left;
                o.y = top;
                break;
            case ELayout.RIGHT_TOP:
                o.x = right;
                o.y = top;
                break;
            case ELayout.RIGHT_BOTTOM:
                o.x = right;
                o.y = bottom;
                break;
            case ELayout.LEFT_BOTTOM:
                o.x = left;
                o.y = bottom;
                break;
            case ELayout.CENTER_MIDDLE:
                o.x = center;
                o.y = middle;
                break;
            case ELayout.CENTER_TOP:
                o.x = center;
                o.y = top;
                break;
            case ELayout.RIGHT_MIDDLE:
                o.x = right;
                o.y = middle;
                break;
            case ELayout.CENTER_BOTTOM:
                o.x = center;
                o.y = bottom;
                break;
            case ELayout.LEFT_MIDDLE:
                o.x = left;
                o.y = middle;
                break;
        }
        return new Rectangle( o, s );
    }

    public fillRectWithTitle(
        x: number, y: number,
        width: number, height: number,
        title: string = "",
        layout: ELayout = ELayout.CENTER_MIDDLE,
        color: string = 'gray', showCoord: boolean = true ): void {
        if ( this.context2D !== null ) {

            this.context2D.save();
            // 1. 绘制矩形
            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.rect( x, y, width, height );
            this.context2D.fill();
            // 如果有文字的话，先根据枚举值计算x，y坐标
            if ( title.length !== 0 ) {
                // 2. 绘制文字信息
                // 在矩形的左上角绘制出相关文字信息，使用的是10px大小的文字
                // 调用calcLocalTextRectangle方法
                let rect: Rectangle = this.calcLocalTextRectangle( layout, title, width, height );
                this.fillText( title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', "top" /*,'10px sans-serif'*/ );
                // 绘制文本框
                this.strokeRect( x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba( 0, 0,0,0.5)' );
                // 绘制文本上的额左上角坐标
                this.fillCircle( x + rect.origin.x, y + rect.origin.y, 2 );
            }
            // 3. 绘制变换的局部角坐标系
            // 附加一个坐标， x 和y轴比矩形的width 和height多20个像素
            // 并且绘制3个像素的原点
            if ( showCoord ) {
                this.strokeCoord( x, y, width + 20, height + 20 );
                this.fillCircle( x, y, 3 );
            }
            this.context2D.restore();
        }
    }

    public fillLocalRectWithTitle(
        width: number, height: number,
        title: string = "",
        referencePt: ELayout = ELayout.LEFT_TOP,
        layout: ELayout = ELayout.CENTER_MIDDLE,
        color: string = 'gray',
        showCoord: boolean = false ): void {
        if ( this.context2D !== null ) {
            let x: number = 0;
            let y: number = 0;
            // 首先根据referencePt的值计算相对于左上角的偏移量
            // Canvas2D 中，左上角是默认的坐标系原点，所有原点变换都是相对于左上角的偏移
            switch ( referencePt ) {
                case ELayout.LEFT_TOP:      // 左 上
                    x = 0;
                    y = 0;
                    break;
                case ELayout.LEFT_MIDDLE:   // 左 中
                    x = 0;
                    y = - height * 0.5;
                    break;
                case ELayout.LEFT_BOTTOM:   // 左 下
                    x = 0;
                    y = - height;
                    break;
                case ELayout.RIGHT_TOP:     // 右 上
                    x = - width;
                    y = 0;
                    break;
                case ELayout.RIGHT_MIDDLE:  // 右 中
                    x = - width;
                    y = - height * 0.5;
                    break;
                case ELayout.RIGHT_BOTTOM:  // 右 下
                    x = - width;
                    y = - height;
                    break;
                case ELayout.CENTER_TOP:    // 中 上
                    x = - width * 0.5;
                    y = 0;
                    break;
                case ELayout.CENTER_MIDDLE: // 中 中
                    x = - width * 0.5;
                    y = - height * 0.5;
                    break;
                case ELayout.CENTER_BOTTOM: // 中 下 
                    x = - width * 0.5;
                    y = - height;
                    break;
            }
            this.context2D.save();
            // 1. 绘制矩形
            this.context2D.fillStyle = color;
            this.context2D.beginPath();
            this.context2D.rect( x, y, width, height );
            this.context2D.fill();
            // 如果有文字的话，先根据枚举值计算x，y坐标
            if ( title.length !== 0 ) {
                // 2. 绘制文字信息
                // 在矩形的左上角绘制出相关文字信息，使用的是10px大小的文字
                // 调用calcLocalTextRectangle方法
                let rect: Rectangle = this.calcLocalTextRectangle( layout, title, width, height );
                this.fillText( title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', "top", '10px sans-serif' );
                // 绘制文本框
                this.strokeRect( x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba( 0, 0,0,0.5)' );
                // 绘制文本上的额左上角坐标
                this.fillCircle( x + rect.origin.x, y + rect.origin.y, 2 );
            }
            // 3. 绘制变换的局部角坐标系
            // 附加一个坐标， x 和y轴比矩形的width 和height多20个像素
            // 并且绘制3个像素的原点
            if ( showCoord ) {
                this.strokeCoord( 0, 0, width + 10, height + 10 );
                this.fillCircle( 0, 0, 3 );
            }
            this.context2D.restore();
        }
    }


    public fillLocalRectWithTitleUV(
        width: number,
        height: number,
        title: string = "",
        u: number = 0, v: number = 0,
        layout: ELayout = ELayout.CENTER_MIDDLE,
        color: string = "grey",
        showCoord: boolean = true ): void {
        if ( this.context2D === null ) return;

        let x: number = - width * u;
        let y: number = - height * v;

        this.context2D.save();
        // 1. 绘制矩形
        this.context2D.fillStyle = color;
        this.context2D.beginPath();
        this.context2D.rect( x, y, width, height );
        this.context2D.fill();
        // 如果有文字的话，先根据枚举值计算x，y坐标
        if ( title.length !== 0 ) {
            // 2. 绘制文字信息
            // 在矩形的左上角绘制出相关文字信息，使用的是10px大小的文字
            // 调用calcLocalTextRectangle方法
            let rect: Rectangle = this.calcLocalTextRectangle( layout, title, width, height );
            this.fillText( title, x + rect.origin.x, y + rect.origin.y, 'white', 'left', "top", '10px sans-serif' );
            // 绘制文本框
            this.strokeRect( x + rect.origin.x, y + rect.origin.y, rect.size.width, rect.size.height, 'rgba( 0, 0,0,0.5)' );
            // 绘制文本上的额左上角坐标
            this.fillCircle( x + rect.origin.x, y + rect.origin.y, 2 );
        }
        // 3. 绘制变换的局部角坐标系
        // 附加一个坐标， x 和y轴比矩形的width 和height多20个像素
        // 并且绘制3个像素的原点
        if ( showCoord ) {
            this.strokeCoord( 0, 0, width + 10, height + 10 );
            this.fillCircle( 0, 0, 3 );
        }
        this.context2D.restore();
    }

    // 合成font属性字符串
    public /* static */ makeFontString(
        size: FontSize = '10px',
        weight: FontWeight = 'normal',
        style: FontStyle = 'normal',
        variant: FontVariant = 'normal',
        family: FontFamily = 'sans-serif',
    ): string {

        let strs: string[] = [];
        // 第一个是fontStyle
        strs.push( style );
        // 第二个是fontVariant
        strs.push( variant );
        // 第三个是 fontWeight
        strs.push( weight );
        // 第四个是 fontSzie
        strs.push( size );
        // 第五个是fontFamily
        strs.push( family );

        // 最后需要将数组中的每个属性字符串以空格键合成
        let ret: string = strs.join( " " );
        console.log( ret );
        return ret;
    }

    public loadAndDrawImage( url: string ): void {
        let img: HTMLImageElement = document.createElement( 'img' ) as HTMLImageElement;
        // 设置载入的图片src
        img.src = url;
        img.onload = ( ev: Event ): void => {
            // onload事件表示图像载入完成
            if ( this.context2D !== null ) {
                console.log( url + "尺寸为[" + img.width + ',' + img.height + "]" );
                // this.context2D.drawImage( img, 10, 10 );
                // this.context2D.drawImage( img, img.width + 30, 10, 200, img.height );
                // [ 44, 6, 162, 175, 200 ] = > [200, img.height+ 30, 200, 130]
                // this.context2D.drawImage( img, 44, 6, 162, 175, 200, img.height + 30, 200, 130 );

                this.drawImage( img, Rectangle.create( 0, 0, this.context2D.canvas.width, this.context2D.canvas.height ), Rectangle.create( 0, 0, img.width, img.height ), EImageFillType.REPEAT );
            }
        };
    }

    // 获取 4 * 4 = 16种基本颜色的离屏画布
    public getColorCanvas( amount: number = 32 ): HTMLCanvasElement {
        let step: number = 4;
        // 第一步： 使用createElement 方法，提供tagName为'canvas'关键字创建一个离屏画布对象
        let canvas: HTMLCanvasElement = document.createElement( 'canvas' ) as HTMLCanvasElement;
        // 第二步：设置该画布尺寸
        canvas.width = amount * step;
        canvas.height = amount * step;
        // 第三步从离屏canvas中获取渲染上下文对象
        let context: CanvasRenderingContext2D | null = canvas.getContext( "2d" );
        if ( context == null ) {
            alert( "离屏canvas获取上下文失败" );
            throw new Error( "离屏Canvas获取上下文失败！" );
        }

        for ( let i: number = 0; i < step; i++ ) {
            for ( let j: number = 0; j < step; j++ ) {
                // 将二唯索引转换成一维索引，用来在静态的colors数组中寻址
                let idx: number = step * i + j;
                // 第4步，使用渲染上下文对象绘图
                context.save();
                // 使用其中16中颜色（由于背景是白色，17中颜色包括白色，所以去除白色）
                context.fillStyle = Colors[ idx ];
                context.fillRect( i * amount, j * amount, amount, amount );
                context.restore();
            }
        }
        return canvas;
    }

    public drawImage( img: HTMLImageElement | HTMLCanvasElement, destRect: Rectangle, srcRect: Rectangle = Rectangle.create( 0, 0, img.width, img.height ), fillType: EImageFillType = EImageFillType.STRETCH ): boolean {
        // 绘制image要满足的一些条件
        if ( this.context2D === null ) {
            return false;
        }

        if ( srcRect.isEmpty() ) {
            return false;
        }

        if ( destRect.isEmpty() ) {
            return false;
        }

        // 分为 stretch 和repeat两种方式
        if ( fillType === EImageFillType.STRETCH ) {
            this.context2D.drawImage( img,
                srcRect.origin.x, srcRect.origin.y,
                srcRect.size.width, srcRect.size.height,
                destRect.origin.x, destRect.origin.y,
                destRect.size.width, destRect.size.height );
        } else {    //使用repeat模式
            // 测试使用，绘制出目标区域的大小
            this.fillRectangleWithColor( destRect, 'grey' );
            let rows: number = Math.ceil( destRect.size.width / srcRect.size.width );
            let colums: number = Math.ceil( destRect.size.height / srcRect.size.height );

            let left: number = 0;
            let top: number = 0;
            let right: number = 0;
            let bottom: number = 0;
            let width: number = 0;
            let height: number = 0;
            // 计算目标Rectangle的right和bottom坐标
            let destRight: number = destRect.origin.x + destRect.size.width;
            let destBottom: number = destRect.origin.y + destRect.size.height;

            // REPEAT_X 和 REPEAT_Y是REPEAT的一种特殊形式
            if ( fillType === EImageFillType.REPEAT_X ) {
                colums = 1;     //如果重复填充x轴，则让y轴列数设置为1
            } else if ( fillType === EImageFillType.REPEAT_Y ) {
                rows = 1;       // 如果是重复填充y轴，则让x轴行数设置为1
            }
            for ( let i = 0; i < rows; i++ ) {
                for ( let j = 0; j < colums; j++ ) {
                    left = destRect.origin.x + i * srcRect.size.width;
                    top = destRect.origin.y + j * srcRect.size.height;
                    width = srcRect.size.width;
                    height = srcRect.size.height;

                    // 计算当前要绘制的取悦的右下坐标
                    right = left + width;
                    bottom = top + height;
                    // 计算x轴方向剩余灰色部分的尺寸的算法
                    if ( right > destRight ) {
                        width = srcRect.size.width - ( right - destRight );
                    }
                    // 计算y轴方向（上下）剩余灰色部分的尺寸的算法
                    if ( bottom > destBottom ) {
                        height = srcRect.size.height - ( bottom - destBottom );
                    }

                    // 调用drawImage方法
                    this.context2D.drawImage( img, srcRect.origin.x, srcRect.origin.y, width, height, left, top, width, height );
                }
            }
        }
        return true;
    }

    public drawColorCanvas(): void {
        let drawColorCanvas: HTMLCanvasElement = this.getColorCanvas();
        this.drawImage( drawColorCanvas, Rectangle.create( 0, 0, drawColorCanvas.width, drawColorCanvas.height ) );
    }

    public testChangePartCanvasImageData( rRow: number = 2, rColum: number = 0, cRow: number = 1, cColum: number = 0, size: number = 32 ): void {
        let drawColorCanvas: HTMLCanvasElement = this.getColorCanvas( size );
        // 获取离屏canvas的上下文对象
        let context2d: CanvasRenderingContext2D | null = drawColorCanvas.getContext( '2d' );
        if ( context2d === null ) {
            alert( "canvas 获取上下文失败" );
            throw new Error( "canvas 获取上下文失败" );
        }

        this.setShadowState();

        // 显示未修改时的离屏画布效果
        this.drawImage( drawColorCanvas, Rectangle.create( 0, 0, drawColorCanvas.width, drawColorCanvas.height ) );

        // 使用createImage方法，大小为size * size 像素
        let imgData: ImageData = context2d.createImageData( size, size );
        // imgData.data.length = size * size * 4
        let data: Uint8ClampedArray = imgData.data;
        let rgbaCount: number = data.length / 4;
        for ( let i = 0; i < rgbaCount; i++ ) {
            // 注意下面索引的计算方式
            data[ i * 4 + 0 ] = 255;        // 红色
            data[ i * 4 + 1 ] = 0;
            data[ i * 4 + 2 ] = 0;
            data[ i * 4 + 3 ] = 255;        // 不透明
        }
        // 一定要调用putImageData方法替换context的像素数据
        context2d.putImageData( imgData, size * rColum, size * rRow, 0, 0, size, size );
        imgData = context2d.getImageData( size * cColum, size & cRow, size, size );
        data = imgData.data;

        let component = 0;
        for ( let i = 0; i < imgData.width; i++ ) {
            for ( let j = 0; j < imgData.height; j++ ) {
                // 由于每个像素有包含4个分量，[ r, g, b, a ] 三重循环
                for ( let k = 0; k < 4; k++ ) {
                    let idx: number = ( i * imgData.height + j ) * 4 + k;
                    component = data[ idx ];
                    if ( idx % 4 !== 3 ) {
                        data[ idx ] = 255 - component;      // 翻转rgb ，但是alpha不变，仍旧是255
                    }
                }
            }
        }
        context2d.putImageData( imgData, size * cColum, size * cRow, 0, 0, size, size );
        // 将修改后的结果显示出来
        this.drawImage( drawColorCanvas, Rectangle.create( 300, 100, drawColorCanvas.width, drawColorCanvas.height ) );

    }

    // 打印阴影相关属性
    public printShadowState(): void {
        if ( this.context2D !== null ) {
            console.log( "********** ShadowState **********" );
            console.log( " shadowBlur: " + this.context2D.shadowBlur );
            console.log( " shadowColor: " + this.context2D.shadowColor );
            console.log( " shadowOffsetX: " + this.context2D.shadowOffsetX );
            console.log( " shadowOffsetY: " + this.context2D.shadowOffsetY );
        }
    }

    // 设置阴影
    public setShadowState( shadowBlur: number = 5, shadowColor: string = "rgba( 127, 127, 127, 0.5)", shadowOffsetX: number = 10, shadowOffsetY: number = 10 ): void {
        if ( this.context2D !== null ) {
            this.context2D.shadowBlur = shadowBlur;
            this.context2D.shadowColor = shadowColor;
            this.context2D.shadowOffsetX = shadowOffsetX;
            this.context2D.shadowOffsetY = shadowOffsetY;
        }
    }

    // TEST:绘制canvas 画布中心点击及相交于中心点的x和y轴
    public drawCanvasCoordCenter(): void {
        // 绘制image要满足的一些条件
        if ( this.context2D === null ) return;
        // 计算canvas的中心坐标
        let halfWidth: number = this.canvas.width * 0.5;
        let halfHeight: number = this.canvas.height * 0.5;
        this.context2D.save();
        this.context2D.lineWidth = 2;

        this.context2D.strokeStyle = "rgba( 255, 0, 0, 0.5 )";
        // 使用alpha为0.5的红线来绘制X轴
        this.strokeLine( 0, halfHeight, this.canvas.width, halfHeight );

        this.context2D.strokeStyle = "rgba( 0, 0, 255, 0.5 )";
        // 使用alpha 为0.5 的蓝线来绘制y轴
        this.strokeLine( halfWidth, 0, halfWidth, this.canvas.height );

        this.context2D.restore();

        this.fillCircle( halfWidth, halfHeight, 5, "rgba( 0 ,0, 0, 0.5 )" );
    }

    // TEST: 绘制某个点的信息
    public drawCoordInfo( info: string, x: number, y: number ): void {
        this.fillText( info, x, y, "black", "center", 'bottom' );
    }

    public distance( x0: number, y0: number, x1: number, y1: number ): number {
        let diffX: number = x1 - x0;
        let diffY: number = y1 - y0;
        return Math.sqrt( diffX * diffX + diffY * diffY );
    }

    public doTransform1(): void {
        if ( this.context2D !== null ) {
            // 要绘制的矩形的尺寸
            let width: number = 100;
            let height: number = 60;
            // 计算出画布的中心点坐标
            let x: number = this.canvas.width * 0.5;
            let y: number = this.canvas.height * 0.5;
            this.context2D.save();
            // 调用translate 平移到画布中心
            this.context2D.translate( x, y );
            this.fillRectWithTitle( 0, 0, width, height, "0 度旋转" );
            this.context2D.restore();
        }
    }

    public doTransform2( degree: number, rotateFirst: boolean = true ): void {
        // 将角度转换为弧度，由此可见，本方法参数degree是以角度而不是弧度表示
        let radians: number = Math2D.toRadian( degree );
        // 顺时针旋转
        this.context2D!.save();
        if ( rotateFirst ) {
            // 先顺时针旋转
            this.context2D!.rotate( radians );
            // 然后在平移
            this.context2D!.translate( this.canvas.width * 0.5, this.canvas.height * 0.5 );
        } else {
            // 与上面正好相反
            this.context2D!.translate( this.canvas.width * 0.5, this.canvas.height * 0.5 );
            // 然后再顺时针旋转20.
            this.context2D!.rotate( radians );
        }
        this.fillLocalRectWithTitle( 100, 60, `${ degree }度旋转` );
        this.context2D?.restore();

        // 逆时针旋转
        this.context2D!.save();
        if ( rotateFirst ) {
            // 先顺时针旋转
            this.context2D!.rotate( -radians );
            // 然后在平移
            this.context2D!.translate( this.canvas.width * 0.5, this.canvas.height * 0.5 );
        } else {
            // 与上面正好相反
            this.context2D!.translate( this.canvas.width * 0.5, this.canvas.height * 0.5 );
            // 然后再顺时针旋转20.
            this.context2D!.rotate( -radians );
        }
        this.fillLocalRectWithTitle( 100, 60, `${ -degree }度旋转` );
        this.context2D?.restore();
    }

    public rotateTranslate( degree: number, layout: ELayout = ELayout.LEFT_TOP, width: number = 40, height: number = 20 ): void {
        if ( this.context2D === null ) {
            return;
        }
        // 将角度转换为弧度，由此可见，本方法的参数degree是以角度而不是弧度表示
        let radians: number = Math2D.toRadian( degree );
        // 顺时针旋转
        this.context2D.save();

        this.context2D.rotate( radians );
        this.context2D.translate( this.canvas.width * 0.5, this.canvas.height * 0.5 );
        this.fillLocalRectWithTitle( width, height, "", layout );

        this.context2D.restore();
    }

    public testFillLocalRectWitTile(): void {
        if ( this.context2D !== null ) {
            this.rotateTranslate( 0, ELayout.LEFT_TOP );

            this.rotateTranslate( 10, ELayout.LEFT_MIDDLE );
            this.rotateTranslate( 20, ELayout.LEFT_BOTTOM );
            this.rotateTranslate( 30, ELayout.CENTER_TOP );
            this.rotateTranslate( 40, ELayout.CENTER_MIDDLE );

            this.rotateTranslate( -10, ELayout.CENTER_BOTTOM );
            this.rotateTranslate( -20, ELayout.RIGHT_TOP );
            this.rotateTranslate( -30, ELayout.RIGHT_MIDDLE );
            this.rotateTranslate( -40, ELayout.RIGHT_BOTTOM );

            // 计算半径
            let radians: number = this.distance( 0, 0, this.canvas.width * 0.5, this.canvas.height * 0.5 );
            this.strokeCircle( 0, 0, radians );
        }
    }

    public doLocalTransform(): void {
        if ( this.context2D === null ) {
            return;
        }

        let width: number = 100;
        let height: number = 60;
        let coordWidth: number = width * 1.2;
        let coordHeight: number = height * 1.2;
        let radius: number = 5;
        this.context2D.save();

        this.fillLocalRectWithTitle( width, height, '1 初始状态' );

        this.context2D.translate( this.canvas.width * 0.5, 10 );
        this.strokeCoord( 0, 0, coordWidth, coordHeight );
        this.fillLocalRectWithTitle( width, height, '2 平移' );
        this.fillCircle( 0, 0, radius );

        this.context2D.translate( 0, this.canvas.height * 0.5 - 10 );
        this.strokeCoord( 0, 0, coordWidth, coordHeight );
        this.fillLocalRectWithTitle( width, height, '3 平移到中心' );
        this.fillCircle( 0, 0, radius );

        this.context2D.rotate( Math2D.toRadian( - 120 ) );
        this.strokeCoord( 0, 0, coordWidth, coordHeight );
        this.fillLocalRectWithTitle( width, height, '4 旋转-120度' );
        this.fillCircle( 0, 0, radius );

        this.context2D.rotate( Math2D.toRadian( - 130 ) );
        this.strokeCoord( 0, 0, coordWidth, coordHeight );
        this.fillLocalRectWithTitle( width, height, '5 旋转-130度' );
        this.fillCircle( 0, 0, radius );

        this.context2D.translate( 100, 100 );
        this.strokeCoord( 0, 0, coordWidth, coordHeight );
        this.fillLocalRectWithTitle( width, height, '6 平移100个单位' );
        this.fillCircle( 0, 0, radius );

        this.context2D.scale( 1.5, 2.0 );
        this.fillLocalRectWithTitle( width, height, '7 缩放局部坐标系', ELayout.LEFT_MIDDLE );
        this.strokeCoord( 0, 0, coordWidth, coordHeight );
        this.fillCircle( 0, 0, radius );
        // this.context2D.scale( 1.5, 2.0 );
        // this.strokeCoord( 0, 0, coordWidth, coordHeight );
        // this.fillLocalRectWithTitle( width * 1.5, height * 1.5, '7 x轴放大1.5，y轴放大2' );
        // this.fillCircle( 0, 0, radius );

        this.context2D.restore();
    }

    public translateRotateTranslateDrawRect( degree: number, u: number = 0, v: number = 0, radius: number = 200, width: number = 40, height: number = 20 ) {
        if ( this.context2D === null ) return;

        let radians: number = Math2D.toRadian( degree );
        this.context2D.save();

        // 将局部坐标平移到画布中心
        this.context2D.translate( this.canvas.width * 0.5, this.canvas.height * 0.5 );
        // 然后再将局部坐标系旋转某个弧度
        this.context2D.rotate( radians );
        // 然后再将位于画布中心旋转后的局部坐标系沿着局部x轴的方向平移250个单位
        this.context2D.translate( radius, 0 );
        // 变换后的局部坐标系中根据u,v的值绘制矩形
        this.fillLocalRectWithTitleUV( width, height, "", u, v );

        this.context2D.restore();
    }

    public testFillLocalRectWithTitleUV(): void {
        if ( this.context2D === null ) return;

        let radius: number = 200;
        let steps: number = 18;     // 将圆分成上下各18等分，-180 ~ 180 每个等分10

        // [ 0, 180 ]绘制u系数从 0 ~ 1，v系数不变
        for ( let i = 0; i < steps; i++ ) {
            let n: number = i / steps;
            this.translateRotateTranslateDrawRect( i * 10, n, 0, radius );
        }

        // [ 0 , - 180 ]绘制
        for ( let i = 0; i <= steps; i++ ) {
            let n: number = i / steps;
            this.translateRotateTranslateDrawRect( - i * 10, 0, n, radius );
        }

        // 画布中心绘制4个像素绘制不同的uv矩形，
        this.context2D.save();
        this.context2D.translate( this.canvas.width * .5 - radius * .4, this.canvas.height * .5 - radius * .4 );
        this.fillLocalRectWithTitleUV( 100, 60, 'u = .5 / v = .5', .5, .5 );
        this.context2D.restore();

        this.context2D.save();
        this.context2D.translate( this.canvas.width * .5 + radius * .2, this.canvas.height * .5 - radius * .2 );
        this.fillLocalRectWithTitleUV( 100, 60, 'u = 0 / v = 1', 0, 1 );
        this.context2D.restore();

        this.context2D.save();
        this.context2D.translate( this.canvas.width * .5 + radius * .3, this.canvas.height * .5 + radius * .4 );
        this.fillLocalRectWithTitleUV( 100, 60, 'u = .3 / v = .6', .3, .6 );
        this.context2D.restore();

        this.context2D.save();
        this.context2D.translate( this.canvas.width * .5 - radius * .1, this.canvas.height * .5 + radius * .25 );
        this.fillLocalRectWithTitleUV( 100, 60, 'u = 1 / v = .2', 1, .2 );
        this.context2D.restore();

        this.strokeCircle( this.canvas.width * .5, this.canvas.height * .5, radius, "rgba(0, 255, 255, 255, 0.5)", 10 );
    }

    public rotationAndRevolutionSimulation( radius: number = 250 ): void {
        if ( this.context2D === null ) return;

        // 将自转rotation转换为弧度表示
        let rotationMoon: number = Math2D.toRadian( this._rotationMoon );
        let rotationSun: number = Math2D.toRadian( this._rotationSun );
        let rotationRevolution: number = Math2D.toRadian( this._revolution );

        this.context2D.save();
        // 将局部坐标平移到画布中心
        this.context2D.translate( this.canvas.width * .5, this.canvas.height * .5 );
        // 绘制矩形在画布在画布中心自转
        this.context2D.save();
        this.context2D.rotate( rotationSun );
        this.fillLocalRectWithTitleUV( 100, 100, "自转", .5, .5 );
        this.context2D.restore();

        // 公转 + 自转，注意顺序
        this.context2D.save();
        this.context2D.rotate( rotationRevolution );
        this.context2D.translate( radius, 0 );
        this.context2D.rotate( rotationMoon );
        this.fillLocalRectWithTitleUV( 80, 80, "自转+公转", .5, .5 );
        this.context2D.restore();

        this.context2D.restore();
    }


}
let canvas: HTMLCanvasElement | null = document.querySelector( '#canvas' ) as HTMLCanvasElement;

let app: ApplicationTest = new ApplicationTest( canvas );

let startBtn: HTMLButtonElement = document.querySelector( '#start' ) as HTMLButtonElement;
let stopBtn: HTMLButtonElement = document.querySelector( '#stop' ) as HTMLButtonElement;

// app.fillPatternRect( 0, 0, canvas.width, canvas.height );
// app.strokeCoord( 5, 5, canvas.width - 5, canvas.height - 5 );
app.strokeGrid();
// app.testCanvas2DTextLayout();
// app.testMyTextLayout();

// app.loadAndDrawImage( 'resource/test.jpg' );
// app.drawColorCanvas();
// app.testChangePartCanvasImageData( 0, 1, 3, 3 );

// app.printShadowState();

// app.render();
// app.doLocalTransform();
app.testFillLocalRectWithTitleUV();

// app.rotationAndRevolutionSimulation();

startBtn.onclick = ( ev: MouseEvent ): void => {
    app.start();
};

stopBtn.onclick = ( ev: MouseEvent ): void => {
    app.stop();
};

