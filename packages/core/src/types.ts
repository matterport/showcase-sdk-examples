/**
 * A general purpose, indexable object type
 */
export type Dict<V = any> = {
  [key: string]: V;
};

export type DeepPartial<T> = {
  [P in keyof T]?:
    T[P] extends Function ? T[P] :
    T[P] extends Array<infer U> ? Array<U> :
    T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<U> :
    T[P] extends {} ? DeepPartial<T[P]> :
    T[P];
}