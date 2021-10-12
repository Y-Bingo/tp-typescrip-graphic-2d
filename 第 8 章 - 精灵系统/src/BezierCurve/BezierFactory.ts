import { vec2 } from "../Math/vec2";
import { BezierEnumerator, IBezierEnumerator } from "./BezierEnumetator";

export class BezierFactory {

  public static createQuadraticBezierEnumerator( start: vec2, ctrl: vec2, end: vec2, steps: number = 30 ): IBezierEnumerator {
    return new BezierEnumerator( start, end, ctrl, null, steps );
  }

  public static createCubicBezierEnumerator( start: vec2, ctrl0: vec2, ctrl1: vec2, end: vec2, steps: number = 30 ): IBezierEnumerator {
    return new BezierEnumerator( start, end, ctrl0, ctrl1, steps );
  }
}