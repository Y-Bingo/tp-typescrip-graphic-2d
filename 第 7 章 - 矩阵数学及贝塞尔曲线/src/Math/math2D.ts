import { mat2d } from "./matrix";
import { vec2 } from "./vec2";

// 为了避免浮点数误差，使用了EPSILON进行容差处理，默认情况下为0.00001
export const EPSILON = 0.00001;

export const PiBy180: number = 0.017453292519943295;  // Math.PI / 180

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

    /**
     * 矩阵变换向量
     */
    public static transform( mat: mat2d, pt: vec2, result: vec2 | null ): vec2 {
        if ( result === null ) result = vec2.create();
        result.values[ 0 ] = mat.values[ 0 ] * pt.values[ 0 ] + mat.values[ 2 ] * pt.values[ 1 ] + mat.values[ 4 ];
        result.values[ 1 ] = mat.values[ 1 ] * pt.values[ 0 ] + mat.values[ 3 ] * pt.values[ 1 ] + mat.values[ 5 ];

        return result;
    }

    // 二次贝塞尔曲线标量版
    public static getQuadraticBezierPosition( start: number, ctrl: number, end: number, t: number ): number {
        if ( t < 0.0 || t > 1.0 ) {
            throw new Error( 't 的取值范围必须为[ 0, 1 ]' );
        }
        let t1: number = 1.0 - t;
        let t2: number = t1 * t1;
        return t2 * start + 2.0 * t * t1 * ctrl + t * t * end;
    }

    // 二次贝塞尔曲线向量版
    public static getQuadraticBezierVector( start: vec2, ctrl: vec2, end: vec2, t: number, result: vec2 | null = null ): vec2 {
        if ( result === null ) result = vec2.create();

        result.x = Math2D.getQuadraticBezierPosition( start.x, ctrl.x, end.x, t );

        result.y = Math2D.getQuadraticBezierPosition( start.y, ctrl.y, end.y, t );

        return result;
    }

    // 三次贝塞尔曲线标量版
    public static getCubicBezierPosition( start: number, ctrl0: number, ctrl1: number, end: number, t: number ): number {
        if ( t < 0.0 || t > 1.0 ) {
            throw new Error( 't 的取值范围必须为[ 0, 1 ]' );
        }
        let t1: number = 1.0 - t;
        let t2: number = t * t;
        let t3: number = t2 * t;
        return ( t1 * t1 * t1 ) * start + 3 * t * ( t1 * t1 ) * ctrl0 + ( 3 * t2 * t1 ) * ctrl1 + t3 * end;
    }

    // 二次贝塞尔曲线向量版
    public static getCubicBezierVector( start: vec2, ctrl0: vec2, ctrl1: vec2, end: vec2, t: number, result: vec2 | null = null ): vec2 {
        if ( result === null ) result = vec2.create();

        result.x = Math2D.getCubicBezierPosition( start.x, ctrl0.x, ctrl1.x, end.x, t );

        result.y = Math2D.getCubicBezierPosition( start.y, ctrl0.y, ctrl1.y, end.y, t );

        return result;
    }

}




