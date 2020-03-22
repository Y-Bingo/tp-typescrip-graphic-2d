import { Application } from "./Application";
import { CanvasKeyBoardEvent, CanvasMouseEvent } from "./Event";

export class ApplicationTest extends Application {

    protected dispatchKeyDown( evt: CanvasKeyBoardEvent ): void {
        console.log( ' key: ' + evt.key + ' is down ' );
    }

    protected dispatchMouseDown( evt: CanvasMouseEvent ): void {
        console.log( ' canvasPosition ： ' + evt.canvasPosition );
    }

    public update( elapsedMsec: number, intervalsSec: number ): void {
        // console.log( ' elapsedMsec : ' + elapsedMsec + ' intervalSec : ' + intervalsSec );
    }

    public render(): void {
        // console.log( ' 调用render 方法！' );
    }
}

let canvas: HTMLCanvasElement | null = document.querySelector( '#canvas' ) as HTMLCanvasElement;

let app: ApplicationTest = new ApplicationTest( canvas );


// timer 回调函数
function timerCallback( id: number, data: string ): void {
    console.log( " 当前回调的 TimerID： " + id + " data: " + data );
}

// 3秒钟后触发回调函数，仅回调一次
let timer0: number = app.addTimer( timerCallback, 3, true, " data 是timerCallback的数据 " );

// 每五秒触发一次
let timer1: number = app.addTimer( timerCallback, 5, false, " data是timeCallback的数据 " );

let startBtn: HTMLButtonElement = document.querySelector( '#start' ) as HTMLButtonElement;
let stopBtn: HTMLButtonElement = document.querySelector( '#stop' ) as HTMLButtonElement;

startBtn.onclick = ( ev: MouseEvent ): void => {
    app.start();
};

stopBtn.onclick = ( ev: MouseEvent ): void => {
    // app.stop();
    // 清除timer1的计时器
    app.removeTimer( timer0 );
    console.log( app.timers.length );
    // 重用 0 号计时器，并且10s后回调一次，删除
    let id: number = app.addTimer( timerCallback, 1, true, " data 是timeCallback的数据" );
    console.log( "新 计时器是否重用以前的：", id === 0 );
};

