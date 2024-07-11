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
type LayoutRouteId = RouteId | "/" | "/og/sec1/chapter2/worksheet2b" | "/og/sec1/chapter2/worksheet2d" | "/og/sec1/chapter4/worksheet4a" | "/og/sec1/chapter4/worksheet4b" | "/og/sec1/chapter4/worksheet4c" | "/og/sec1/chapter4/worksheet4d" | "/og/sec1/chapter5/worksheet5a" | "/og/sec1/chapter5/worksheet5b" | "/og/sec1/chapter6/worksheet6b" | "/og/sec2/chapter1/worksheet1d" | "/og/sec2/chapter2/worksheet2a" | "/og/sec2/chapter3/worksheet3a" | "/og/sec2/chapter3/worksheet3b" | "/og/sec2/chapter3/worksheet3c" | "/og/sec2/chapter3/worksheet3d" | "/og/sec2/chapter4/worksheet4a" | "/og/sec2/chapter4/worksheet4b" | "/og/sec2/chapter4/worksheet4c" | "/og/sec2/chapter6/worksheet6a" | "/og/sec2/chapter6/worksheet6b" | "/og/sec2/chapter6/worksheet6c" | "/tys/amath/unit1" | "/tys/amath/unit10" | "/tys/amath/unit11" | "/tys/amath/unit12" | "/tys/amath/unit13" | "/tys/amath/unit2" | "/tys/amath/unit3" | "/tys/amath/unit4" | "/tys/amath/unit5" | "/tys/amath/unit6" | "/tys/amath/unit8" | "/tys/emath/chapter1/unit1" | "/tys/emath/chapter1/unit5" | "/tys/emath/chapter1/unit7" | "/world" | null
type LayoutParams = RouteParams & {  }
type LayoutParentData = EnsureDefined<{}>;

export type PageServerData = null;
export type PageData = Expand<PageParentData>;
export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;