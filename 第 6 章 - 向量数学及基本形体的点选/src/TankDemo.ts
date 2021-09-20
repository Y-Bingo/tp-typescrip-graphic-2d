<<<<<<< HEAD
import { TextAlign, TextBaseLine } from "./applicationTest";
import { Canvas2DApplication } from "./core/Canvas2DApplication";
import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./core/Event";
import { Math2D } from "./core/math2D";
=======
import { Canvas2DApplication } from "./core/Canvas2DApplication";
import { TextAlign, TextBaseLine } from "./applicationTest";
import { Math2D } from "./core/math2D";
import { CanvasMouseEvent, CanvasKeyBoardEvent } from "./core/Event";
>>>>>>> origin/master

export class TankDemo extends Canvas2DApplication {

    public _tank: Tank;

    private _mouseX: number = 0;
    private _mouseY: number = 0;

    public isSupportMouseMove: boolean = true;

<<<<<<< HEAD
    constructor( canvas: HTMLCanvasElement, contextAttributes?: CanvasRenderingContext2DSettings ) {
=======
    constructor ( canvas: HTMLCanvasElement, contextAttributes?: CanvasRenderingContext2DSettings ) {
>>>>>>> origin/master
        super( canvas, contextAttributes );

        this._tank = new Tank();
        this._tank.x = canvas.width * .5;
        this._tank.y = canvas.height * .5;

        this._tank.scaleX = 2;
        this._tank.scaleY = 2;

        this._tank.tankRotation = Math2D.toRadian( 90 );
        // this._tank.turretRotation = Math2D.toRadian( -30 );
    }

    public update( elapsedMsec: number, intervalSec: number ): void {
        super.update( elapsedMsec, intervalSec );

        this._tank.update( intervalSec );
    }

    public render(): void {
        if ( this.context2D === null ) return;

        this.context2D.clearRect( 0, 0, this.canvas.width, this.canvas.height );
        this.strokeGrid();

        this.drawCanvasCoordCenter();
        this.draw4Quadrant();
        this.drawTank();

        this.drawCoordInfo(
            `
                坐标：[${ ( this._mouseX - this._tank.x ).toFixed( 2 ) },  ${ ( this._mouseY - this._tank.y ).toFixed( 2 ) } ]
<<<<<<< HEAD
                角度：${ Math2D.toDegree( Math2D.atan2( this._mouseX - this._tank.x, this._mouseY - this._tank.y ) ).toFixed( 2 ) }
=======
                角度：${Math2D.toDegree( Math2D.atan2( this._mouseX - this._tank.x, this._mouseY - this._tank.y ) ).toFixed( 2 ) }
>>>>>>> origin/master
            `, this._mouseX, this._mouseY );
    }

    protected dispatchMouseMove( evt: CanvasMouseEvent ): void {
        this._mouseX = evt.canvasPosition.x;
        this._mouseY = evt.canvasPosition.y;
        this._tank.onMouseMove( evt );
    }

    protected dispatchKeyPress( evt: CanvasKeyBoardEvent ): void {
        this._tank.onKeyPress( evt );
    }

    public drawTank(): void {
        this._tank.draw( this );
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
        this.context2D.lineWidth = 2;
        this.context2D.strokeStyle = "red";
        this.strokeLine( originX, originY, originX + width, originY );
        this.context2D.strokeStyle = "green";
        this.strokeLine( originX, originY, originX, originY + height );

        this.context2D.restore();
    }

    public strokeGrid( color: string = "gred", interval: number = 10 ): void {
        if ( this.context2D === null ) return;

        this.context2D.save();
        this.context2D.strokeStyle = color;
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

    public drawCoordInfo( info: string, x: number, y: number ): void {
        this.fillText( info, x, y, "black", "center", 'bottom' );
    }

    public drawCanvasCoordCenter(): void {
        if ( this.context2D === null ) return;

        let halfWidth: number = this.canvas.width * .5;
        let halfHeight: number = this.canvas.height * .5;

        this.context2D.save();
        this.context2D.lineWidth = 3;
        this.context2D.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';
        this.strokeLine( halfWidth, 0, halfWidth, this.canvas.height );
        this.context2D.strokeStyle = 'rgba( 0, 0, 255, 0.5 )';
        this.strokeLine( 0, halfHeight, this.canvas.width, halfHeight );
        this.context2D.restore();

        this.fillCircle( halfWidth, halfHeight, 5, "rgba( 0 ,0, 0, 0.5 )" );

    }

    public draw4Quadrant(): void {
        if ( this.context2D === null ) return;

        this.context2D.save();

        this.fillText( "第一象限", this.canvas.width, this.canvas.height, 'rgba(0, 0, 255, 0.5)', 'right', 'bottom', '20px bold sans-serif' );
        this.fillText( "第二象限", 0, this.canvas.height, 'rgba(0, 0, 255, 0.5)', 'left', 'bottom', '20px sans-serif' );
        this.fillText( "第三象限", 0, 0, 'rgba(0, 0, 255, 0.5)', 'left', 'top', '20px sans-serif' );
        this.fillText( "第四象限", this.canvas.width, 0, 'rgba(0, 0, 255, 0.5)', 'right', 'top', '20px sans-serif' );
    }

    public distance( x0: number, y0: number, x1: number, y1: number ): number {
        let diffX: number = x1 - x0;
        let diffY: number = y1 - y0;
        return Math.sqrt( diffX * diffX + diffY * diffY );
    }
}

class Tank {
    public width: number = 80;
    public height: number = 50;
    // 默认位置
    public x: number = 100;
    public y: number = 100;
    // x、y方向上的缩放系数
    public scaleX: number = 1.0;
    public scaleY: number = 1.0;
    // 坦克旋转角度
    public tankRotation: number = 0;        // 坦克旋转角度 弧度
    public turretRotation: number = 0;      // 炮塔旋转角度 弧度

    public initYAxis: boolean = false;       // 用来标记坦克是否朝着y轴正方向
    public showLine: boolean = false;       // 是否显示坦克原点于画布中心点和目标 的连线

    public showCoord: boolean = false;     // 是否显示坦克本身的局部坐标系
    public gunLength: number = Math.max( this.width, this.height );         // 炮管长度，default情况下，等于坦克的width 和height 中最大的一个数值
    public gunMuzzleRadius: number = 5;

    private _targetX: number = 0;
    private _targetY: number = 0;

    private linearSpeed: number = 10;       // 线性速率

    public turretRotateSpeed: number = Math2D.toRadian( 2 );        // 旋转速度

    public draw( app: TankDemo ): void {
        if ( app.context2D === null ) return;

        // 绘制坦克
        app.context2D.save();
        // 整个坦克移动和旋转，注意局部变换的经典顺序（trs： translate -> rotation -> scale ）
        app.context2D.translate( this.x, this.y );
        app.context2D.rotate( this.initYAxis ? this.tankRotation - Math.PI * .5 : this.tankRotation );
        app.context2D.scale( this.scaleX, this.scaleY );

        // 绘制坦克的底盘
        app.context2D.save();
        app.context2D.fillStyle = 'grey';
        app.context2D.beginPath();
        if ( this.initYAxis ) {
            app.context2D.rect( - this.height * 0.5, -this.width * 0.5, this.height, this.width );
        } else {
            app.context2D.rect( -this.width * 0.5, - this.height * 0.5, this.width, this.height );
        }
        app.context2D.fill();
        app.context2D.restore();

        // 绘制炮塔
        app.context2D.save();
        app.context2D.rotate( this.turretRotation );
        // 椭圆炮塔ellipse方法
        app.context2D.fillStyle = "red";
        app.context2D.beginPath();
        if ( this.initYAxis ) {
            app.context2D.ellipse( 0, 0, 10, 15, 0, 0, 2 * Math.PI );
        } else {
            app.context2D.ellipse( 0, 0, 15, 10, 0, 0, 2 * Math.PI );
        }
        app.context2D.fill();
        // 炮管
        app.context2D.strokeStyle = 'blue';
        app.context2D.lineWidth = 5;
        app.context2D.lineCap = 'round';
        app.context2D.moveTo( 0, 0 );
        if ( this.initYAxis ) {
            app.context2D.lineTo( 0, this.gunLength );
        } else {
            app.context2D.lineTo( this.gunLength, 0 );
        }
        app.context2D.stroke();
        if ( this.initYAxis ) {
            app.context2D.translate( 0, this.gunLength );
            app.context2D.translate( 0, this.gunMuzzleRadius );
        } else {
            app.context2D.translate( this.gunLength, 0 );
            app.context2D.translate( this.gunMuzzleRadius, 0 );
        }
        app.fillCircle( 0, 0, 10, 'green' );
        app.context2D.restore();


        // 绘制一个圆球，标记坦克的正方向，一旦炮管旋转后，可以知道正方向在哪里
        app.context2D.save();
        if ( this.initYAxis ) {
            app.context2D.translate( 0, this.width * 0.5 );
        } else {
            app.context2D.translate( this.width * 0.5, 0 );
        }
        app.fillCircle( 0, 0, 10, 'green' );
        app.context2D.restore();


        // 跟随坦克的坐标系
        if ( this.showCoord ) {
            app.context2D.save();
            app.context2D.lineWidth = 1;
            app.context2D.lineCap = "butt";
            app.strokeCoord( 0, 0, this.width * 1.2, this.height * 1.2 );
            app.context2D.restore();
        }

        app.context2D.restore();

        if ( !this.showLine )
            return;
        // 绘制坦克原点到画布中心原点的连线
        app.context2D.save();
        app.strokeLine( this.x, this.y, app.canvas.width * .5, app.canvas.height * .5 );
        // 绘制坦克原点到目标原点的连线
        app.strokeLine( this.x, this.y, this._targetX, this._targetY );
        app.context2D.restore();
    }

    private _lookAt(): void {
        // 将鼠标点的x和y变换为相对坦克的坐标系的原点的标示值
        let diffX: number = this._targetX - this.x;
        let diffY: number = this._targetY - this.y;

        // 计算弧度
        let radian = Math.atan2( diffY, diffX );

        this.tankRotation = radian;
    }

    public onKeyPress( evt: CanvasKeyBoardEvent ): void {
        if ( evt.key == "r" ) {
            this.turretRotation += this.turretRotateSpeed;
        } else if ( evt.key == "t" ) {
            this.turretRotation = 0;
        } else if ( evt.key === 'e' ) {
            this.turretRotation -= this.turretRotateSpeed;
        }
    }

    public onMouseMove( evt: CanvasMouseEvent ): void {
        // 每次移动， 记录当前鼠标指针在canvas2d画布中的位置
        this._targetX = evt.canvasPosition.x;
        this._targetY = evt.canvasPosition.y;

        this._lookAt();
    }

    private _moveTowardTo( intervalSec: number ): void {
        let diffX: number = this._targetX - this.x;
        let diffY: number = this._targetY - this.y;

        let curSpeed: number = this.linearSpeed * intervalSec;
        // 判断坦克是否要停止运动
        if ( ( diffX * diffX + diffY * diffY ) > curSpeed * curSpeed ) {
            this.x = this.x + Math.cos( this.tankRotation ) * curSpeed;
            this.y = this.y + Math.sin( this.tankRotation ) * curSpeed;
        }
    }

    public update( intervalSec: number ): void {
        this._moveTowardTo( intervalSec );
    }
}


let canvas: HTMLCanvasElement = document.querySelector( '#canvas' ) as HTMLCanvasElement;
let startBtn: HTMLButtonElement = document.querySelector( '#start' ) as HTMLButtonElement;
let stopBtn: HTMLButtonElement = document.querySelector( '#stop' ) as HTMLButtonElement;

let app: TankDemo = new TankDemo( canvas );

// app.render();

let ptX: number = 600;
let ptY: number = 500;

app.strokeGrid();
app.drawCanvasCoordCenter();
app.draw4Quadrant();

<<<<<<< HEAD
// app.drawTank();
// app._tank.tankRotation = Math.atan2( ptX - app.canvas.width * .5, ptY - app.canvas.height * .5 );
// app.drawTank();

// let len = app.distance( ptX, ptY, app.canvas.width * .5, app.canvas.height * .5 );
// app._tank.x = app._tank.x + Math.cos( app._tank.tankRotation ) * len * .5;
// app._tank.y = app._tank.y + Math.sin( app._tank.tankRotation ) * len * .5;

// app.drawTank();

// app._tank.x = app._tank.x + Math.cos( app._tank.tankRotation ) * len * .5;
// app._tank.y = app._tank.y + Math.sin( app._tank.tankRotation ) * len * .5;

// app.drawTank();

// 绘制三角型
// app.drawTriangle( app.canvas.width * .5, app.canvas.height * .5, ptX, app.canvas.height * .5, ptX, ptY );
=======
app.drawTank();
app._tank.tankRotation = Math.atan2( ptX - app.canvas.width * .5, ptY - app.canvas.height * .5 );
app.drawTank();

let len = app.distance( ptX, ptY, app.canvas.width * .5, app.canvas.height * .5 );
app._tank.x = app._tank.x + Math.cos( app._tank.tankRotation ) * len * .5;
app._tank.y = app._tank.y + Math.sin( app._tank.tankRotation ) * len * .5;

app.drawTank();

app._tank.x = app._tank.x + Math.cos( app._tank.tankRotation ) * len * .5;
app._tank.y = app._tank.y + Math.sin( app._tank.tankRotation ) * len * .5;

app.drawTank();

// 绘制三角型
app.drawTriangle( app.canvas.width * .5, app.canvas.height * .5, ptX, app.canvas.height * .5, ptX, ptY );
>>>>>>> origin/master

startBtn.onclick = ( ev: MouseEvent ): void => {
    app.start();
};

stopBtn.onclick = ( ev: MouseEvent ): void => {
    app.stop();
};
