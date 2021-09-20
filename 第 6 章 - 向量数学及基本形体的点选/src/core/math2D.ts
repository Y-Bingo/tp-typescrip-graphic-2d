// 为了避免浮点数误差，使用了EPSILON进行容差处理，默认情况下为0.00001
const EPSILON = 0.00001;

const PiBy180: number = 0.017453292519943295;  // Math.PI / 180

export class Math2D {
    // 以角度都表示的参数转换为弧度表示
    public static toRadian( degree: number ): number {
        return degree * PiBy180;
    }
    // 以弧度表示的参数转换为角度表示
    public static toDegree( radian: number ): number {
        return radian / PiBy180;
    }

    public static atan2( x: number, y: number ): number {
        return Math.atan2( y, x );
    }

    public static isEquals( left: number, right: number, epsilon: number = EPSILON ): boolean {
        if ( Math.abs( left - right ) > epsilon )
            return false;
        return true;
    }

    /**
     * 将一个pt点投影到start和end形成的线段上
     * 返回true：pt点在线段之间，此时closePoint输出的参数返回线段上的投影坐标
     * 返回false：pt点在线段之外，此时closePoint输出参数返回线段的起点或终点
     */
    public static projectPointOnLineSegment( pt: vec2, start: vec2, end: vec2, closePoint: vec2 ): boolean {
        let v0: vec2 = vec2.create();
        let v1: vec2 = vec2.create();
        let d: number = 0;

        // 向量减法，形成方向向量
        vec2.difference( pt, start, v0 );
        vec2.difference( end, start, v1 );

        d = v1.normalize();
        // 将v0投影到v1上，获取投影长度t
        let t: number = vec2.dotProduct( v0, v1 );

        if ( t < 0 ) {
            closePoint.x = start.x;
            closePoint.y = start.y;
            return false;
        } else if ( t > d ) {
            closePoint.x = end.x;
            closePoint.y = end.y;
            return false;
        } else {
            vec2.scaleAdd( start, v1, t, closePoint );
            return true;
        }
    }

    /** 
     * 判断点是否与圆发生碰撞 
    */
    public static isPointInCircle( pt: vec2, center: vec2, radius: number ): boolean {
        let diff: vec2 = vec2.difference( pt, center );
        let len2: number = diff.squaredLength;
        if ( len2 <= radius ) {
            return true;
        }
        return false;
    }

    /**
     * 判断点是否与一条直线发生碰撞检测
     */
    public static isPointOnLineSegment( pt: vec2, start: vec2, end: vec2, radius: number = 2 ): boolean {
        let closePt: vec2 = vec2.create();
        if ( Math2D.projectPointOnLineSegment( pt, start, end, closePt ) == false ) {
            return false;
        }
        return Math2D.isPointInCircle( pt, closePt, radius );
    }

    /**
     * 判断点与矩形的碰撞检测
     */
    public static isPointInRect( ptX: number, ptY: number, x: number, y: number, w: number, h: number ): boolean {
        // 一个点在矩形的上下左右范围之内，则发生碰撞
        if ( ptX >= x && ptX <= x + w && ptY >= y && ptY <= y + h ) {
            return true;
        }
        return false;
    }

    /**
     * 判断点与椭圆的碰撞检测
     * ( ptX - centerX )² / radiusX² + ( ptY - centerY )² / radiusY² <= 1.0
     */
    public static isPointInEllipse( ptX: number, ptY: number, centerX: number, centerY: number, radiusX: number, radiusY: number ): boolean {
        let diffX = ptX - centerX;
        let diffY = ptY - centerY;
        let n: number = ( diffX * diffX ) / ( radiusX * radiusX ) + ( diffY * diffY ) / ( radiusY * radiusY );
        return ( n <= 1.0 );
    }

    /**
     * 计算三角型两条边向量的叉积
     */
    public static sign( v0: vec2, v1: vec2, v2: vec2 ): number {
        // e1 = v2 -> v0 边向量
        let e1: vec2 = vec2.difference( v0, v2 );
        // e2 = v2 -> v1 边向量
        let e2: vec2 = vec2.difference( v1, v2 );
        // 获取 e1 cross e2 的值
        return vec2.crossProduct( e1, e2 );
    }

    /**
     * 判断点与三角型的碰撞检测
     */
    public static isPointInTriangle( pt: vec2, v0: vec2, v1: vec2, v2: vec2 ): boolean {
        // 计算三角形的三个点与pt点形成的子三角形的边向量的叉积
        let b1 = Math2D.sign( v0, v1, pt ) < 0.0;
        let b2 = Math2D.sign( v1, v2, pt ) < 0.0;
        let b3 = Math2D.sign( v2, v0, pt ) < 0.0;

        return ( b1 === b2 ) && ( b2 === b3 );
    }

    /**
     * 检测点与多边形发生碰撞
     */
    public static isPointInPolygon( pt: vec2, points: vec2[] ): boolean {
        // 三角形是最小的凸多边形
        if ( points.length < 3 )
            return false;
        // 以point[ 0 ]为共享节点，遍历多边形节点集，构建三角形，调用ispointInTriangle方法
        for ( let i = 2; i < points.length; i++ ) {
            // 一旦点与某个三角形发生碰撞，就返回true
            if ( Math2D.isPointInTriangle( pt, points[ 0 ], points[ i - 1 ], points[ i ] ) ) {
                return true;
            }
        }
        // 没有与多边形的任何一个三角形发生碰撞，返回false
        return false;
    }

    /**
     * 判断是否为凸多边形
     */
    public static isConvex( points: vec2[] ): boolean {
        // 第一个三角形的顶点顺序
        let sign: boolean = Math2D.sign( points[ 0 ], points[ 1 ], points[ 2 ] ) < 0.0;
        let j: number, k: number;
        for ( let i = 1; i < points.length; i++ ) {
            j = ( i + 1 ) % points.length;
            k = ( i + 2 ) % points.length;
            if ( sign !== Math2D.sign( points[ i ], points[ j ], points[ k ] ) < 0.0 ) {
                // 凹多边形
                return false;
            }
        }
        // 凸多边形
        return true;
    }

}

export class vec2 {
    public values: Float32Array;        // 使用float32Array，不需要进行引用类型到值类型，以及值类型到引用类型的转换，效率高

    public constructor ( x: number = 0, y: number = 0 ) {
        this.values = new Float32Array( [ x, y ] );
    }

    // 特殊单位向量
    public static xAxis = new vec2( 1, 0 );
    public static yAxis = new vec2( 0, 1 );
    public static nXAxis = new vec2( -1, 0 );
    public static nYAxis = new vec2( 0, -1 );

    public toString(): string {
        return " [ " + this.values[ 0 ] + " , " + this.values[ 1 ] + " ] ";
    }

    get x(): number { return this.values[ 0 ]; }
    set x( x: number ) { this.values[ 0 ] = x; }

    get y(): number { return this.values[ 1 ]; }
    set y( y: number ) { this.values[ 1 ] = y; }

    public reset( x: number = 0, y: number ): vec2 {
        this.values[ 0 ] = x;
        this.values[ 1 ] = y;
        return this;
    }

    public static create( x: number = 0, y: number = 0 ): vec2 {
        return new vec2( x, y );
    }

    // 复制当前向量到result中
    public static copy( src: vec2, result: vec2 | null = null ): vec2 {
        if ( result == null ) result = new vec2();
        result.values[ 0 ] = src.values[ 0 ];
        result.values[ 1 ] = src.values[ 1 ];
        return result;
    }

    // 避免误差使用EPSILON做容差处理
    public equals( vector: vec2 ): boolean {
        if ( Math.abs( this.values[ 0 ] - vector.values[ 0 ] ) > EPSILON )
            return false;
        if ( Math.abs( this.values[ 1 ] - vector.values[ 1 ] ) > EPSILON )
            return false;
        return true;
    }

    // 返回没有开根号的向量大小
    public get squaredLength(): number {
        let x = this.values[ 0 ];
        let y = this.values[ 1 ];
        return ( x * x + y * y );
    }

    // 返回真正的向量大小
    public get length(): number {
        return Math.sqrt( this.squaredLength );
    }

    // 修改内部的向量的x和y值，修改后的向量大小为1.0（单位向量），并返回未修改前的向量大小
    public normalize(): number {
        let len: number = this.length;
        // 对0向量的判断与处理
        if ( Math2D.isEquals( len, 0 ) ) {
            console.log( "长度为0，非方向向量，this.length = 0" );
            this.values[ 0 ] = 0;
            this.values[ 1 ] = 0;
            return 0;
        }

        // 如果是单位向量， 直接返回1.0
        if ( Math2D.isEquals( len, 1 ) ) {
            return 1.0;
        }

        // 否者计算出单位向量（也就是方向）
        this.values[ 0 ] /= len;
        this.values[ 1 ] /= len;

        return len;
    }

    // 静态方法：向量加法
    public static sum( left: vec2, right: vec2, result: vec2 | null = null ): vec2 {
        // 如果输出参数result为null，则分配内存给result
        if ( result == null ) result = new vec2();
        // x和y分量分别相加，结果仍然是一个向量
        result.values[ 0 ] = left.values[ 0 ] + right.values[ 0 ];
        result.values[ 1 ] = left.values[ 1 ] + right.values[ 1 ];

        return result;
    }

    // 实例方法：向量加法
    public add( right: vec2 ): vec2 {
        // this + right = this
        vec2.sum( this, right, this );
        return this;
    }

    // 静态减法：向量减法
    public static difference( end: vec2, start: vec2, result: vec2 | null = null ): vec2 {
        // 如果输出参数result为null，则分配内存给result变量
        if ( result == null ) result = new vec2();
        // x 和 y分量分别相减，结果仍旧为一个向量
        result.values[ 0 ] = end.values[ 0 ] - start.values[ 0 ];
        result.values[ 1 ] = end.values[ 1 ] - start.values[ 1 ];

        return result;
    }

    // 实例方法： 向量减法
    public substract( another: vec2 ): vec2 {
        // this - right = this;
        vec2.difference( this, another, this );
        return this;
    }

    // 负向量，得到一个以原来向量方向相反，大小相同的向量
    public negative(): vec2 {
        this.values[ 0 ] = -this.values[ 0 ];
        this.values[ 1 ] = -this.values[ 1 ];
        return this;
    }

    // 静态方法：向量与标量的相乘
    public static scale( direction: vec2, scalar: number, result: vec2 | null = null ): vec2 {
        if ( result == null ) result = new vec2();
        result.values[ 0 ] = direction.values[ 0 ] * scalar;
        result.values[ 1 ] = direction.values[ 1 ] * scalar;
        return result;
    }

    // 静态方法： result = start + direction * scalar; 将一个点沿着direction方向，移动scalar个单位
    public static scaleAdd( start: vec2, direction: vec2, scalar: number, result: vec2 | null = null ): vec2 {
        if ( result == null ) result = new vec2();
        vec2.scale( direction, scalar, result );

        return vec2.sum( start, result, result );
    }

    // 静态方法： 点积
    public static dotProduct( left: vec2, right: vec2 ): number {
        return left.values[ 0 ] * right.values[ 0 ] + left.values[ 1 ] * right.values[ 1 ];
    }

    // 实例方法： 內积
    public innerProduct( right: vec2 ): number {
        return vec2.dotProduct( this, right );
    }

    // 静态方法： 叉积，返回标量
    public static crossProduct( left: vec2, right: vec2 ): number {
        return left.x * right.y - left.y * right.x;
    }

    // 静态方法： 向量夹角的计算
    public static getAngle( a: vec2, b: vec2, isRadian: boolean = false ): number {
        let dot: number = vec2.dotProduct( a, b );
        let radian = Math.acos( dot / ( a.length * b.length ) );
        if ( isRadian == false )
            radian = Math2D.toDegree( radian );
        return radian;
    }

    // 静态方法：朝向，表示物体的方向
    public static getOrientation( from: vec2, to: vec2, isRadian: boolean = false ): number {
        let diff: vec2 = vec2.difference( to, from );
        let radian = Math.atan2( diff.y, diff.x );
        if ( isRadian )
            radian = Math2D.toDegree( radian );
        return radian;
    }
}

export class Size {

    public values: Float32Array;
    constructor ( w: number = 1, h: number = 1 ) {
        this.values = new Float32Array( [ w, h ] );     // 
    }

    public set width( value: number ) { this.values[ 0 ] = value; }
    public get width(): number { return this.values[ 0 ]; }

    public set height( value: number ) { this.values[ 1 ] = value; }
    public get height(): number { return this.values[ 1 ]; }

    public static create( w: number = 1, h: number = 1 ): Size {
        return new Size();
    }
}

// 矩形包围框
export class Rectangle {
    public origin: vec2;
    public size: Size;
    public constructor ( origin: vec2 = new vec2(), size: Size = new Size( 1, 1 ) ) {
        this.origin = origin;
        this.size = size;
    }

    public static create( x: number = 0, y: number = 0, w: number = 1, h: number = 1 ): Rectangle {
        let origin: vec2 = new vec2( x, y );
        let size: Size = new Size( w, h );
        return new Rectangle( origin, size );
    }

    isEmpty(): boolean {
        let area: number = this.size.width * this.size.height;
        if ( area === 0 ) {
            return true;
        }
        return false;
    }
}