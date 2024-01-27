import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
type RouteParams = {  }
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/0/1/01-simplifying-fractions" | "/0/1/02-multiplying-integers" | "/0/1/03-multiplying-fractions" | "/0/1/04-dividing-fractions" | "/0/1/05-dividing-integers" | "/0/1/06-adding-fractions" | "/0/1/07-subtracting-fractions" | "/0/2/01-addition-negative-integers" | "/0/2/02-multiplying-negative-integers" | "/0/2/03-simplifying-fractions" | "/0/2/04-fraction-arithmetic" | "/1/1/01-simplifying-fractions" | "/1/1/02-multiplying-integers" | "/1/1/03-multiplying-fractions" | "/1/1/04-dividing-fractions" | "/1/1/05-dividing-integers" | "/1/1/06-adding-fractions" | "/1/1/07-subtracting-fractions" | "/1/2/01-addition-negative-integers" | "/1/2/02-multiplying-negative-integers" | "/1/2/03-simplifying-fractions" | "/1/2/04-fraction-arithmetic" | "/[chapter=integer]" | "/[chapter=integer]/[section=integer]" | null
type LayoutParams = RouteParams & { chapter?: string,section?: string }
type LayoutParentData = EnsureDefined<{}>;

export type PageServerData = null;
export type PageData = Expand<PageParentData>;
export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;