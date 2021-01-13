export type Awaited<T> = Promise<T> | T;

export type InStringOf<T> = { [P in keyof T]: T[P] extends (number | symbol) ? string : T[P] };
