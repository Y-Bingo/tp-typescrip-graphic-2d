import { HttpRequest, HttpResponse , RequestCB } from "./XMLHttpRequest";
import { Doom3Factory, IDoom3Token, IDoom3Tokenizer, ETokenType } from "./doom3Tokenizer";

let tokenizer: IDoom3Tokenizer = Doom3Factory.createDoom3Tokenizer();
let str: string;

// // 同步请求
// let response: HttpResponse = HttpRequest.doGet( "resource/level.proc" );
// // 如果请求成功，进行文件解析
// if ( response.success == true ) {
//     // 将response转为string类型，因为知道是文本文件
//     str = response.response as string;
//     tokenizer.setSource( str );
//     while ( tokenizer.moveNext() ) {
//         if ( tokenizer.current.type == ETokenType.STRING ) {
//             console.log( "STRING:", tokenizer.current.getString() );
//         } else {
//             console.log( "NUMBER:", tokenizer.current.getFloat() );
//         }
//     }
// }

HttpRequest.doGetAsync( 'resource/level.proc', RequestBC => {
    // 请求成功和失败都在回调函数中处理
    if ( RequestBC.success === true ) {
        str = RequestBC.response as string;
        // 设置要解析的字符串
        tokenizer.setSource( str );
        while ( tokenizer.moveNext() ) {
            if ( tokenizer.current.type == ETokenType.STRING ) {
                console.log( "STRING:", tokenizer.current.getString() );
            } else {
                console.log( "NUMBER:", tokenizer.current.getFloat() );
            }
        }
    } else {
        console.log( "请求失败！！！！" );
    }
} );