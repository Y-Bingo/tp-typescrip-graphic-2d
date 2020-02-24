import { IDoom3Token, IDoom3Tokenizer, Doom3Factory, ETokenType } from "./doom3Tokenizer";

let str: string = `
    numMeshes  5
    /*
    * joints 关键字定义了骨骼动画的bindPose
    */
    joints {
        "origin" -1 ( 0 0 0 ) ( -0.5 -0.5 -0.5 )
        "Body" 0 ( -12.10138131714 0 79.004776001 ) ( -0.5 -0.5 -0.5 )
        // orign
    }
`;

let input: string = " [ 3.14, -3.14, .14, -.14, 3., -3. ] ";

// 从Doom3Factory 工厂创建IDoom3Tokenizer接口
let tokenizer: IDoom3Tokenizer = Doom3Factory.createDoom3Tokenizer();
// IDoom3Tokenizer接口创建IDoomToken接口
// let token: IDoom3Token = tokenizer.createDoom3Token(); 
tokenizer.setSource( str );
while ( tokenizer.moveNext() ) {
    if ( tokenizer.current.type === ETokenType.NUMBER ) {
        console.log( "NUMBER :" + tokenizer.current.getFloat() );
    } else {
        console.log( "STRING : " + tokenizer.current.getString() );
    }
}