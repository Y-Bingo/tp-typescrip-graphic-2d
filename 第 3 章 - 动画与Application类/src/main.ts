// {
//     let start = 0;          // 记录第一次调用step函数的时间点，用于计算与第一次调用step函数的时间差，以毫秒为单位
//     let lastTime = 0;       // 记录上一次调用step函数的时间点，用户计算两帧之间的时间差，以毫秒为单位
//     let count = 0;          // 记录step函数被调用的次数

//     function step( timestamp ) {
//         if ( !start ) start = timestamp;
//         if ( !lastTime ) lastTime = timestamp;

//         // 计算当前时间点与第一次调用step时间差
//         let elapsedMsec = timestamp - start;
//         // 计算当前时间点与上一次调用step时间点的差（可以理解为两帧之间的差）
//         let intervalMsec = timestamp - lastTime;
//         // 记录上一次的时间戳
//         lastTime = timestamp;
//         // 计数器，用于记录step函数被调用的次数
//         count++;
//         console.log( " " + count + " timestamp = " + timestamp );
//         console.log( " " + count + " elapsedMsec = " + elapsedMsec );
//         console.log( " " + count + " intervalMsec = " + intervalMsec );

//         // 使用requestAnimationFrame 调用step函数;
//         window.requestAnimationFrame( step );
//     }

//     window.requestAnimationFrame( step );

//     console.log( "hello world" );
// }