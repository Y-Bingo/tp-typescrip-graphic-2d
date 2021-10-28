import { ApplicationTest } from "../ApplicationTest";

import { CanvasMouseEvent, CanvasKeyBoardEvent } from "../Core/Event";
import { mat2d, MatrixStack } from "../Math/matrix";
import { Math2D } from "../Math/math2D";
import { vec2 } from "../Math/vec2";

export class TankDemo extends ApplicationTest {

    public _tank: TankWithMatrix;

    protected _mouseX: number = 0;
    protected _mouseY: number = 0;

    public isSupportMouseMove: boolean = true;

    constructor( canvas: HTMLCanvasElement, contextAttributes?: CanvasRenderingContext2DSettings ) {
        super( canvas, contextAttributes );

        this._tank = new TankWithMatrix();

        this._tank.initYAxis = false;
        this._tank.pos.x = canvas.width * .5;
        this._tank.pos.y = canvas.height * .5;

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
                坐标：[${( this._mouseX - this._tank.pos.x ).toFixed( 2 )},  ${( this._mouseY - this._tank.pos.y ).toFixed( 2 )} ]
                角度：${Math2D.toDegree( Math2D.atan2( this._mouseX - this._tank.pos.x, this._mouseY - this._tank.pos.y ) ).toFixed( 2 )}
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
        // this._tank.draw( this );
        this._tank.drawWithMatrix( this );
    }
}

class TankWithMatrix {
    public width: number = 80;
    public height: number = 50;
    // 默认位置
    public pos: vec2 = new vec2( 100, 100 );
    // x、y方向上的缩放系数
    public scale: vec2 = new vec2( 1, 1 );
    // 坦克旋转角度，使用矩阵来表示
    public tankRotation: mat2d = new mat2d();

    public turretRotation: number = 0;      // 炮塔旋转角度 弧度

    public initYAxis: boolean = false;       // 用来标记坦克是否朝着y轴正方向

    public showLine: boolean = true;       // 是否显示坦克原点于画布中心点和目标 的连线
    public showCoord: boolean = false;     // 是否显示坦克本身的局部坐标系

    public gunLength: number = Math.max( this.width, this.height );         // 炮管长度，default情况下，等于坦克的width 和height 中最大的一个数值
    public gunMuzzleRadius: number = 5;

    public target: vec2 = new vec2();

    private linearSpeed: number = 80.0;       // 线性速率

    public turretRotateSpeed: number = Math2D.toRadian( 2 );        // 旋转速度

    public matStack: MatrixStack = new MatrixStack();

    private _lookAt(): void {
        // 坦克与鼠标位置形成的方向向量
        let v: vec2 = vec2.difference( this.target, this.pos );
        v.normalize();
        //构造从 x 轴向 v 向量的旋转矩阵，而不是上面的 v 向量向 x 轴方向的旋转矩阵
        // this.tankRotation = mat2d.makeRotationFromVectors( v, vec2.xAxis );
        if ( this.initYAxis === true ) {
            this.tankRotation = mat2d.makeRotationFromVectors( vec2.yAxis, v );
        } else {
            this.tankRotation = mat2d.makeRotationFromVectors( vec2.xAxis, v );
        }

    }

    public drawWithMatrix( app: TankDemo ): void {
        if ( app.context2D == null ) return;

        // 绘制整个 tank 
        app.context2D.save();
        this.matStack.pushMatrix();
        // 整个坦克移动和旋转，注意局部变换的经典结合顺序 （ trs： translate -> rotate -> scale ）
        // app.context2D.translate( this.pos.x , this.pos.y );
        // app.transform( this.tankRotation );
        // app.context2D.scale( this.scale.x , this. scale .y );
        this.matStack.translate( this.pos.x, this.pos.y );
        this.matStack.multMatrix( this.tankRotation );
        this.matStack.scale( this.scale.x, this.scale.y );
        app.setTransform( this.matStack.matrix );

        // 绘制坦克的底盘
        // 绘制坦克的底盘
        app.context2D.save();
        this.matStack.pushMatrix();
        app.context2D.fillStyle = 'grey';
        app.context2D.beginPath();
        if ( this.initYAxis ) {
            app.context2D.rect( - this.height * 0.5, -this.width * 0.5, this.height, this.width );
        } else {
            app.context2D.rect( -this.width * 0.5, - this.height * 0.5, this.width, this.height );
        }
        app.context2D.fill();
        this.matStack.popMatrix();
        app.context2D.restore();

        // 绘制炮塔
        app.context2D.save();
        this.matStack.pushMatrix();
        this.matStack.rotate( this.turretRotation );
        // app.context2D.rotate( this.turretRotation );
        app.setTransform( this.matStack.matrix );
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
        // 炮口，先将局部坐标系从当前的方向，向 x 正方向平移炮管长度个单位，此时局部坐标系在炮管的右侧
        if ( this.initYAxis ) {
            // app.context2D.translate( 0, this.gunLength );
            // app.context2D.translate( 0, this.gunMuzzleRadius );
            this.matStack.translate( 0, this.gunLength );
            this.matStack.translate( 0, this.gunMuzzleRadius );
            app.setTransform( this.matStack.matrix );
        } else {
            // app.context2D.translate( this.gunLength, 0 );
            // app.context2D.translate( this.gunMuzzleRadius, 0 );
            this.matStack.translate( this.gunLength, 0 );
            this.matStack.translate( this.gunMuzzleRadius, 0 );
            app.setTransform( this.matStack.matrix );
        }
        app.fillCircle( 0, 0, 10, 'green' );
        this.matStack.popMatrix();
        app.context2D.restore();


        // 绘制一个圆球，标记坦克的正方向，一旦炮管旋转后，可以知道正方向在哪里
        app.context2D.save();
        this.matStack.pushMatrix();
        if ( this.initYAxis ) {
            // app.context2D.translate( 0, this.width * 0.5 );
            this.matStack.translate( 0, this.width * 0.5 );
            app.setTransform( this.matStack.matrix );
        } else {
            // app.context2D.translate( this.width * 0.5, 0 );
            this.matStack.translate( this.width * 0.5, 0 );
            app.setTransform( this.matStack.matrix );
        }
        app.fillCircle( 0, 0, 10, 'green' );
        this.matStack.popMatrix();
        app.context2D.restore();


        // 跟随坦克的坐标系
        if ( this.showCoord ) {
            app.context2D.save();
            this.matStack.pushMatrix();
            app.context2D.lineWidth = 1;
            app.context2D.lineCap = "butt";
            app.strokeCoord( 0, 0, this.width * 1.2, this.height * 1.2 );
            this.matStack.popMatrix();
            app.context2D.restore();
        }

        this.matStack.popMatrix();
        app.context2D.restore();

        if ( !this.showLine )
            return;
        // 绘制坦克原点到画布中心原点的连线
        app.context2D.save();
        this.matStack.pushMatrix();
        app.strokeLine( this.pos.x, this.pos.y, app.canvas.width * .5, app.canvas.height * .5 );
        // 绘制坦克原点到目标原点的连线
        app.strokeLine( this.pos.x, this.pos.y, this.target.x, this.target.y );
        this.matStack.popMatrix();
        app.context2D.restore();

    }

    public draw( app: TankDemo ): void {
        if ( app.context2D === null ) return;

        // 绘制坦克
        app.context2D.save();
        // 整个坦克移动和旋转，注意局部变换的经典顺序（trs： translate -> rotation -> scale ）
        app.context2D.translate( this.pos.x, this.pos.y );
        app.transform( this.tankRotation );
        app.context2D.scale( this.scale.x, this.scale.y );

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
        app.strokeLine( this.pos.x, this.pos.y, app.canvas.width * .5, app.canvas.height * .5 );
        // 绘制坦克原点到目标原点的连线
        app.strokeLine( this.pos.x, this.pos.y, this.target.x, this.target.y );
        app.context2D.restore();
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
        this.target.x = evt.canvasPosition.x;
        this.target.y = evt.canvasPosition.y;

        this._lookAt();
    }

    private _moveTowardTo( intervalSec: number ): void {
        let curSpeed: number = this.linearSpeed * intervalSec;
        let dir: vec2 = vec2.difference( this.target, this.pos );
        dir.normalize();

        this.pos = vec2.scaleAdd( this.pos, dir, curSpeed );
    }

    public update( intervalSec: number ): void {
        this._moveTowardTo( intervalSec );
    }
}


let canvas: HTMLCanvasElement = document.querySelector( '#canvas' ) as HTMLCanvasElement;
let startBtn: HTMLButtonElement = document.querySelector( '#start' ) as HTMLButtonElement;
let stopBtn: HTMLButtonElement = document.querySelector( '#stop' ) as HTMLButtonElement;

let app: TankDemo = new TankDemo( canvas );

app.render();


startBtn.onclick = ( ev: MouseEvent ): void => {
    app.start();
};

stopBtn.onclick = ( ev: MouseEvent ): void => {
    app.stop();
};
