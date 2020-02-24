export interface IEnumerator<T> {
    // 将迭代器重置为初始位置
    reset(): void;
    // 如果没有越界，moveNext将current设置为下一个元素，并返回true
    // 如果已越界，moveNext返回false
    moveNext(): boolean;
    // 只读属性，用于获取当前元素，返回泛型T
    readonly current: T;
}


// 容器对象如果要支持迭代器模式，需要实现IEnumerable < T > 泛型接口
export interface IEnumerable<T> {

    getEnumerator(): IEnumerator<T>;

}