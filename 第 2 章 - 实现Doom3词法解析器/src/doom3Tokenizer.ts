import { IEnumerator } from "IEnumerator";

export enum ETokenType {
    NONE,           // 0 default 情况下， enum定义的枚举值是以0开始的数字类型
    STRING,         // 1 字符串类型
    NUMBER          // 2 数字类型
}

export interface IDoom3Token {
    reset(): void;
    isString( string: string ): boolean;
    readonly type: ETokenType;
    getString(): string;
    getFloat(): number;
    getInt(): number;
}

type TokenEnumerator = IEnumerator<IDoom3Token>;

export interface IDoom3Tokenizer extends TokenEnumerator {
    setSource( source: string ): void;              // 设置要解析的字符串
    /**  以下方法在迭代器中均嫩头提供，已经不再需要了
     // 新增创建子接口的方法
     createIDoom3Token(): IDoom3Token;
     reset(): void;                                  // 重置当前索引为 0
     getNextToken( token: IDoom3Token ): boolean;    // 获取下一个Token
     */
}

class Doom3Token implements IDoom3Token {

    // 使用！操作符来显示断言赋值声明
    private _type!: ETokenType;      // 标识当前Token的类型
    private _charArr: string[] = []; // 
    private _val!: number;           // 如果当前的Token类型是NUMBER，则会设置改数值，如果是字符串类型，就忽略该变量

    constructor () {
        // this._charArr.length = 0;
        // this._type = ETokenType.NONE;
        // this._val = 0.0;
        this.reset();
    }

    get type(): ETokenType {
        return this._type;
    }

    /** 获取当前Token的字符串值 */
    public getString(): string {
        return this._charArr.join( '' );
    }

    /** 获取当前Token的浮点类型值 */
    public getFloat(): number {
        return this._val;
    }

    /** 获取当前Token的Int类型值 */
    public getInt(): number {
        return parseInt( this._val.toString(), 10 );
    }

    public isString( str: string ): boolean {
        let count: number = this._charArr.length;
        // 字符串长度不相等，肯定不等
        if ( str.length != count ) {
            return false;
        }
        // 遍历每个字符
        for ( let i = 0; i < count; i++ ) {
            // _charArr 数组里类型找那个每个char 和输入的string类型中的每个char进行严格比较
            // 只要任意一个char不相等，以为着整个字符串都不相等
            if ( this._charArr[ i ] !== str[ i ] ) {
                return false;
            }
        }
        // 完全相等
        return true;
    }

    public reset(): void {
        this._charArr.length = 0;
        this._type = ETokenType.NONE;
        this._val = 0.0;
    }

    /******************** 非接口方法 ********************/
    /** 将一个char添加到_charArr数组的尾部 */
    public addChar( c: string ): void {
        this._charArr.push( c );
    }

    /** 设置数字，并将类型设置为NUMBER */
    public setVal( num: number ): void {
        this._val = num;
        this._type = ETokenType.NUMBER;
    }

    /** 设置类型 */
    public setType( type: ETokenType ): void {
        this._type = type;
    }
}

class Doom3Tokenizer implements IDoom3Tokenizer {

    private _current: IDoom3Token = new Doom3Token();
    get current(): IDoom3Token {
        return this._current;
    }

    moveNext(): boolean {
        return this._getNextToken( this._current );
    }

    createIDoom3Token(): IDoom3Token {
        return new Doom3Token();
    }

    // 要解析的字符串，使用Doom3Tokenizer字符串来初始化变量
    private _source: string = " Doom3Tokenizer ";
    private _currIdx: number = 0;
    // 设置要解析的字符串，并且重置当前索引
    setSource( source: string ): void {
        this._source = source;
        this._currIdx = 0;
    }
    // 不要改变要解析的字符串， 仅重置当前索引
    reset(): void {
        this._currIdx = 0;
    }

    private _digits: string[] = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ];
    private _whiteSpace: string[] = [ " ", "\t", "\v", "\n", "\r" ];

    /** 判断某个字符是不是数字 */
    private _isDigit( c: string ): boolean {
        for ( let i = 0; i < this._digits.length; i++ ) {
            if ( c === this._digits[ i ] )
                return true;
        }
        return false;
    }

    /** 判断某一个字符是不是空白符 */
    // 一般将空白符(" ")、水平制表符("\t")、垂直制表符("\v")及换行符("\n")称为空白符
    private _isWhitespace( c: string ): boolean {
        for ( let i = 0; i < this._whiteSpace.length; i++ ) {
            if ( c == this._whiteSpace[ i ] )
                return true;
        }
        return false;
    }

    // 将左边和右边的大、中、小括号及点号逗号都当做单独的Token进行处理
    // 如果想要增加更多的标点符号作为Token，可以在本函数中进行添加
    private _isSpecialChar( c: string ): boolean {
        switch ( c ) {
            case '(':
            case ")":
            case "[":
            case "]":
            case "{":
            case "}":
            case ",":
            case ".":
                return true;
        }

        return false;
    }

    // 获取当前的索引指向的char，并且将索引加1，后移一位
    // 后++特点是返回当前的索引，并将索引加1
    // 这样的话，_getChar 返回的是当前要处理的char，而索引指向的是下一个要处理的char
    private _getChar(): string {
        // 数组越界检查
        if ( this._currIdx >= 0 && this._currIdx < this._source.length ) {
            return this._source.charAt( this._currIdx++ );
        }
        return "";
    }

    // 探测下一个字符是什么
    private _peekChar(): string {
        // 数字越界检查， 与getChar区别是并没有移动当前的索引
        if ( this._currIdx >= 0 && this._currIdx < this._source.length ) {
            return this._source.charAt( this._currIdx );
        }
        return "";
    }

    // 索引前移1位，前减操作符
    private _ungetChar(): void {
        if ( this._currIdx > 0 ) {
            --this._currIdx;
        }
    }

    /**
     * 解析数字类型
     * 开始条件：当前可能的值是[ 数字， 小数点， 负号]
     * 结束条件： 数据源全部解析完成，或下一个字符既不是数字也不是小数点
     * 例：[ 3.14 -3.14, .14, -.14, 3., -3. ]
     */
    private _getNumber( token: Doom3Token ): void {
        let val: number = 0.0;
        let isFloat: boolean = false;       // 是否为浮点数
        let scaleValue: number = 0.1;       // 缩放倍数

        // 获取当前的字符（当前可能的值是[ 数字， 小数点， 负号]）
        // 当前不支持+3.14类似的表示
        // 如果 -3.14这种情况，由于负号和数字之间有空格， 所以目前会解析成[ '-', 3.14 ]这两个token
        // 目前支持例如：[ 3.14 -3.14, .14, -.14, 3., -3. ]的表示
        let c: string = this._getChar();
        // 预先判断是不是负数
        let isNegate: boolean = ( c === "-" );       // 是不是负数
        let consumed: boolean = false;
        // 获得0的ASCII编码， 使用了字符串的charCodeAt实例方法
        let ascii0 = '0'.charCodeAt( 0 );
        // 只能进来3中类型的字符：[ -, ., 数字 ]
        do {
            // 当前的字符提那家到Token中
            token.addChar( c );
            // 如果当前的字符是.的话，设置为浮点数类型
            if ( c === '.' ) {
                isFloat = true;
            } else if ( c !== "-" ) {
                // 十进制从字符到浮点数的转换算法
                // 否则如果不是-符号的话，说明是数字

                // 这里肯定是数字了，获取当前的数字字符的ASCII编码
                let ascii = c.charCodeAt( 0 );
                // 将当前的数字的ASCII编码减去0的ASCII编码的算法，其实就是进行字符串数字的类型转换算法
                let vc = ( ascii - ascii0 );
                if ( !isFloat ) {        // 整数部分算法，10倍递增，因为十进制
                    val = 10 * val + vc;
                } else {
                    // 小数部分算法
                    val = val + scaleValue * vc;
                    // 10倍递减
                    scaleValue *= 0.1;
                }
            }
            // 上面循环中的代码没有读取并处理过字符，之所以使用consumed变量，是为了探测下一个字符
            if ( consumed === true )
                this._getChar();
            // 获取下一个字符后，才设置consumed为true
            c = this._peekChar();
            consumed = true;
            // 结束条件： 数据源全部解析完成，或下一个字符既不是数字也不是小数点
        } while ( c.length > 0 && ( this._isDigit( c ) || ( !isFloat && c === "." ) ) );
        // 如果是负数，要取反
        if ( isNegate )
            val = -val;

        token.setVal( val );
    }

    // 解析子字符串
    private _getSubString( token: Doom3Token, endChar: string ): void {
        let end: boolean = false;
        let c: string = "";
        token.setType( ETokenType.STRING );
        do {
            // 获取字符
            c = this._getChar();
            // 如果当前字符是结束符（要么是\", 要么是\'）
            if ( c === endChar )
                end = true;         // 结束符
            else
                token.addChar( c );
            // 结束条件： 数据源解析全部完成或遇到换行符（子串不能多行表示）或是结束符号（要么是\",要么是\'）
        } while ( c.length > 0 && c !== "\n" && !end );
    }

    // 进入该函数，说明肯定不是数字，不是单行注释，不是多行注释，也不是子字符串
    // 进入该函数只有两种类型的字符串，即不带双引号或单引号的字符串及specialChar
    private _getString( token: Doom3Token ): void {
        let c = this._getChar();
        token.setType( ETokenType.STRING );
        do {
            // 将当前char添加到Token中
            token.addChar( c );
            if ( !this._isSpecialChar( c ) ) {
                c = this._getChar();        // 只有不是特殊符号，才调用getChar移动当前索引
            }
            // 如果this._isSpecialChar( c ) 为true，不会调用getChar函数，并调出while循环
            // 结束条件： 数据源全部解析完成，或下个字符是空白符或当前字符是特殊符号
        } while ( c.length > 0 && !this._isWhitespace( c ) && !this._isSpecialChar( c ) );
    }

    // 跳过所用的空白字符，将当前索引指向非空白字符
    private _skipWhitespace(): string {
        let c: string = "";
        do {
            c = this._getChar();
        } while ( c.length >= 0 && this._isWhitespace( c ) );
        // 返回正常的非空白字符
        return c;
    }

    /**
     * 跳过单行注释中的所有字符
     * 开始条件：以//开头的字符
     * 结束条件：以\n结尾
     * 例：
     *      // 单行跳过
     */
    private _skipComments0(): string {
        let c: string = "";
        do {
            c = this._getChar();
        } while ( c.length > 0 && c != "\n" );
        // 此时返回的是\n字符
        return c;
    }

    /**
     * 跳过多行注释中的所有字符
     * 开始条件：以 /* 开头的字符
     * 结束条件：以  结尾
     * 
     */
    private _skipComments1(): string {
        // 进入本函数时，当前索引是/字符
        let c: string = "";
        // 读取* 号
        c = this._getChar();
        // 读取所有非* / 这两个符号结尾的所有字符
        do {
            c = this._getChar();
        } while ( c.length > 0 && ( c != "*" || this._peekChar() != "/" ) );
        c = this._peekChar();
        // 此时返回的应该是/字符·
        return c;
    }

    /**
     * 
     */
    private _getNextToken( tok: IDoom3Token ): boolean {
        let token: Doom3Token = tok as Doom3Token;      // 使用as 关键字将IDoom3Token向下转型为Doom3Token类型
        // 初始化为空字符串
        let c: string = "";
        // 重用Token，每次调用reset()函数时,将Token的索引重置为0
        // 避免发生内存重新分配
        token.reset();
        do {
            // 第一步： 跳过所用的空白字符，返回第一个可希纳斯的字符
            // 开始条件：当前字符是空白格
            c = this._skipWhitespace();
            // 第二步：判断非空空白字符的第一个字符是什么
            if ( c === "/" && this._peekChar() === "/" ) {
                // 开始条件：如果是//开头，则跳过单行注释的所有字符
                c = this._skipComments0();
            } else if ( c === "/" && this._peekChar() === "*" ) {
                // 开始条件：如果是/*开头，则跳过多行注释的所有字符
                c = this._skipComments1();
            } else if ( this._isDigit( c ) || c === "-" || ( c === "." && this._isDigit( this._peekChar() ) ) ) {
                // 开始条件：如果当前字符是数字、符号或者以点号且数字开头
                // 则返回到上一个字符索引处，因为第一个字符被读取并处理过了，而_getNumber会重新处理数字情况，这样需要恢复到数字解析的原始状态
                this._ungetChar();
                this._getNumber( token );
                return true;
            } else if ( c === '\"' || c === '\'' ) {
                // 开始条件：如果以 \" 或 \' 开头的字符，例如："origin"或'body'
                this._getSubString( token, c );
                return true;
            } else if ( c.length > 0 ) {
                // 开始条件：排除上诉所有的条件并且确保数据源没有解析完成的情况下
                // 返回到上一个字符索引处，因为_getString会重新处理相关情况
                this._ungetChar();
                this._getString( token );
                return true;
            }
        } while ( c.length > 0 );
        return false;
    }
}

export class Doom3Factory {
    // 注意返回的是IDoomTokenizer接口，恶如不是Doom3Tokenizer实现类
    public static createDoom3Tokenizer(): IDoom3Tokenizer {
        let ret: IDoom3Tokenizer = new Doom3Tokenizer();
        return ret;
    }
}