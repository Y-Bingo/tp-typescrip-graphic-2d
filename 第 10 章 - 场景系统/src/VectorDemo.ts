import { Canvas2DApplication } from "./Core/Canvas2DApplication";
import { CanvasMouseEvent } from "./Core/Event";
import { TextAlign, TextBaseLine, FontType } from "./ApplicationTest";
import { Math2D } from "./Math/math2D";
import { vec2 } from "./Math/vec2";


class VectorDemo extends Canvas2DApplication {

    private _mouseX: number = 0;
    private _mouseY: number = 0;

    private _lineStart: vec2 = vec2.create( 150, 150 );     // 起点
    private _lineEnd: vec2 = vec2.create( 400, 300 );       // 终点
    private _closePt: vec2 = vec2.create();                 // 缓存点
    private _hitted: boolean = false;                       // 是否在起点和终点范围内

    public isSupportMouseMove: boolean = true;

    constructor( canvas: HTMLCanvasElement, contextAttributes?: CanvasRenderingContext2DSettings ) {
        super( canvas, contextAttributes );
    }

    public update( elapsedMsec: number, intervalSec: number ): void {
        super.update( elapsedMsec, intervalSec );

    }

    public render(): void {
        if ( this.context2D === null ) return;

        this.context2D.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        this.strokeGrid();

        // this.drawMouseLineProjection();
        this.drawMouseLineHitTest();

        this.drawCoordInfo(
            '[' + this._mouseX + ',' + this._mouseY + "]",
            this._mouseX,
            this._mouseY
        );
    }

    protected dispatchMouseMove( evt: CanvasMouseEvent ): void {
        this._mouseX = evt.canvasPosition.x;
        this._mouseY = evt.canvasPosition.y;

        // this._hitted = Math2D.projectPointOnLineSegment( vec2.create( evt.canvasPosition.x, evt.canvasPosition.y ), this._lineStart, this._lineEnd, this._closePt );
        this._hitted = Math2D.isPointOnLineSegment( vec2.create( evt.canvasPosition.x, evt.canvasPosition.y ), this._lineStart, this._lineEnd );
    }

    public fillText(
        title: string,
        x: number,
        y: number,
        color: string = 'white',
        align: TextAlign = "left",
        baseLine: TextBaseLine = "top",
        font: string = "10px sans-serif"
    ): void {
        if ( this.context2D === null ) return;

        this.context2D.save();

        this.context2D.textAlign = align;
        this.context2D.textBaseline = baseLine;
        this.context2D.fillStyle = color;
        this.context2D.font = font;
        this.context2D.fillText( title, x, y );

        this.context2D.restore();
    }

    public fillCircle( x: number, y: number, radius: number = 10, color: string = 'black' ): void {
        if ( this.context2D === null ) return;

        this.context2D.save();
        this.context2D.fillStyle = color;
        this.context2D.beginPath();
        this.context2D.arc( x, y, radius, 0, 2 * Math.PI );
        this.context2D.fill();
        this.context2D.restore();
    }

    public strokeLine( x0: number, y0: number, x1: number, y1: number ): void {
        if ( this.context2D === null ) return;

        this.context2D.save();
        this.context2D.beginPath();
        this.context2D.moveTo( x0, y0 );
        this.context2D.lineTo( x1, y1 );
        this.context2D.stroke();
        this.context2D.restore();
    }

    public strokeCoord( originX: number, originY: number, width: number, height: number ): void {
        if ( this.context2D === null ) return;

        this.context2D.save();
        this.context2D.beginPath();
        this.context2D.lineWidth = 5;
        this.context2D.strokeStyle = "red";
        this.strokeLine( originX, originY, originX + width, originY );
        this.context2D.strokeStyle = "green";
        this.strokeLine( originX, originY, originX, originY + height );

        this.context2D.restore();
    }

    public drawCoordInfo( info: string, x: number, y: number ): void {
        this.fillText( info, x, y, "black", "center", 'bottom' );
    }

    public strokeGrid( color: string = "gred", interval: number = 10 ): void {
        if ( this.context2D === null ) return;

        this.context2D.save();
        this.context2D.strokeStyle = color;
        this.context2D.lineWidth = 1;
        // 横
        for ( let i = 0; i < this.canvas.height; i += interval )
            this.strokeLine( 0, i, this.canvas.width, i );
        // 纵
        for ( let i = 0; i < this.canvas.width; i += interval )
            this.strokeLine( i, 0, i, this.canvas.height );
        this.context2D.restore();

        this.fillCircle( 0, 0, 5, 'green' );
        this.strokeCoord( 0, 0, this.canvas.width + 20, this.canvas.height + 20 );
    }

    // 绘制三角型
    public drawTriangle( x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, stroke: boolean = true ): void {
        if ( this.context2D == null ) return;
        this.context2D.save();
        this.context2D.lineWidth = 3;
        this.context2D.strokeStyle = 'rgba(0,0,0,0.5)';
        this.context2D.beginPath();
        this.context2D.moveTo( x0, y0 );
        this.context2D.lineTo( x1, y1 );
        this.context2D.lineTo( x2, y2 );
        this.context2D.closePath();

        if ( stroke ) {
            this.context2D.stroke();
        } else {
            this.context2D.fill();
        }
        this.fillCircle( x2, y2, 5 );
        this.context2D.restore();
    }

    /**
     * 
     * @param len          要绘制的向量长度
     * @param arrowLen     要绘制的向量的箭头长度 
     * @param beginText    表示向量尾部和头部的信息，如[ 150, 150 ] 和 [ 400, 300 ]
     * @param endText 
     * @param lineWidth    用来加粗显示向量
     * @param isLineDash   是否虚线显示向量 
     * @param showInfo     是否显示向量长度
     * @param alpha        是否半透明方式来显示向量
     */
    public drawVec(
        len: number,
        arrowLen: number = 10,
        beginText: string = "",
        endText: string = "",
        lineWidth: number = 1,
        isLineDash: boolean = false,
        showInfo: boolean = true,
        alpha: boolean = false ): void {
        if ( this.context2D == null ) return;

        // 当绘制负向量时，len为负数
        // 不做处理，会导致箭头的绘制错误
        if ( len < 0 )
            arrowLen = -arrowLen;

        this.context2D.save();

        this.context2D.lineWidth = lineWidth;
        if ( isLineDash )
            this.context2D.setLineDash( [ 2, 2 ] );
        // 绘制向量的起点圆
        if ( lineWidth > 1 )
            this.fillCircle( 0, 0, 5 );
        else
            this.fillCircle( 0, 0, 3 );

        // 绘制向量箭头
        this.context2D.save();
        if ( alpha === true )
            this.context2D.strokeStyle = 'rgba(0,0,0,0.3)';

        // 绘制长度为len的线段表示向量
        this.strokeLine( 0, 0, len, 0 );

        // 绘制箭头的上半部分
        this.context2D.save();
        this.strokeLine( len, 0, len - arrowLen, arrowLen );
        this.context2D.restore();
        // 绘制箭头的下半部分
        this.context2D.save();
        this.strokeLine( len, 0, len - arrowLen, -arrowLen );
        this.context2D.restore();

        this.context2D.restore();

        // 绘制起点到终点的信息
        let font: FontType = '15px sans-serif';
        if ( beginText !== undefined && beginText.length != 0 ) {
            if ( len > 0 )
                this.fillText( beginText, 0, 0, 'black', 'right', 'bottom', font );
            else
                this.fillText( beginText, 0, 0, 'black', 'left', 'bottom', font );
        }
        len = parseFloat( len.toFixed( 2 ) );
        if ( endText !== undefined && endText.length != 0 ) {
            if ( len > 0 )
                this.fillText( endText, len, 0, 'black', 'right', 'bottom', font );
            else
                this.fillText( endText, len, 0, 'black', 'left', 'bottom', font );
        }

        // 绘制向量点额长度信息
        if ( showInfo === true ) {
            this.fillText( Math.abs( len ).toString(), len * 0.5, 0, 'black', 'center', 'bottom' );
        }

        this.context2D.restore();
    }

    // 计算两点的向量，并画出来
    public drawVecFromLine(
        start: vec2,
        end: vec2,
        arrowLen: number = 10,
        beginText: string = "",
        endText: string = "",
        lineWidth: number = 1,
        isLineDash: boolean = false,
        showInfo: boolean = false,
        alpha: boolean = false ): number {

        let angle: number = vec2.getOrientation( start, end );
        if ( this.context2D == null ) return angle;

        // 获取从start-end形成的向量与x轴方向之间形成的夹角
        let diff: vec2 = vec2.difference( end, start );
        let len: number = diff.length;
        this.context2D.save();
        // 局部坐标变换

        this.context2D.translate( start.x, start.y );
        this.context2D.rotate( angle );
        this.drawVec( len, arrowLen, beginText, endText, lineWidth, isLineDash, showInfo, alpha );
        this.context2D.restore();


        return angle;
    }

    // 根据hitted的状态绘制closePt的内容
    public drawMouseLineProjection(): void {
        if ( this.context2D == null ) return;

        // 鼠标位置在线段范围外的效果
        if ( this._hitted === false ) {
            this.drawVecFromLine( this._lineStart, this._lineEnd, 10, this._lineStart.toString(), this._lineEnd.toString(), 1, false, true );
        } else {
            let angle: number = 0;
            let mousePt: vec2 = vec2.create( this._mouseX, this._mouseY );

            this.context2D.save();

            angle = this.drawVecFromLine( this._lineStart, this._lineEnd, 10, this._lineStart.toString(), this._lineEnd.toString(), 3, false, true );

            this.fillCircle( this._closePt.x, this._closePt.y, 5 );
            // 绘制线段起点到鼠标点向量
            this.drawVecFromLine( this._lineStart, mousePt, 10, "", "", 1, true, true, false );
            // 绘制鼠标点到投影点的线段
            this.drawVecFromLine( mousePt, this._closePt, 10, "", "", 1, true, true, false );
            this.context2D.restore();

            // 计算出线段与鼠标之间的夹角，以弧度表示
            angle = vec2.getAngle( vec2.difference( this._lineEnd, this._lineStart ), vec2.difference( mousePt, this._lineStart ), false );
            // 绘制出夹角
            this.drawCoordInfo( angle.toFixed( 2 ), this._lineStart.x + 10, this._lineStart.y + 10 );
        }
    }

    public drawMouseLineHitTest(): void {
        if ( this.context2D === null ) return;
        if ( this._hitted == false ) {
            this.drawVecFromLine( this._lineStart, this._lineEnd, 10, this._lineStart.toString(), this._lineEnd.toString(), 1, false, true );
        } else {
            // let mousePt: vec2 = vec2.create( this._mouseX, this._mouseY );

            this.context2D.save();
            this.drawVecFromLine( this._lineStart, this._lineEnd, 10, this._lineStart.toString(), this._lineEnd.toString(), 3, false, true );
            // 绘制投影点
            this.fillCircle( this._closePt.x, this._closePt.y, 5 );
            this.context2D.restore();
        }
    }
}



let canvas: HTMLCanvasElement = document.querySelector( '#canvas' ) as HTMLCanvasElement;
let startBtn: HTMLButtonElement = document.querySelector( '#start' ) as HTMLButtonElement;
let stopBtn: HTMLButtonElement = document.querySelector( '#stop' ) as HTMLButtonElement;

let app: VectorDemo = new VectorDemo( canvas );

app.render();

startBtn.onclick = ( ev: MouseEvent ): void => {
    app.start();
    console.log( "开始 帧！" );
};

stopBtn.onclick = ( ev: MouseEvent ): void => {
    app.stop();
    console.log( "停止 帧！" );
};
