import type { PropsWithChildren } from "react";
import type { Merge } from "type-fest";

declare global {
  declare type BaseProps<T = unknown> = Merge<
    Partial<{ id: string; testId: string }>,
    T
  >;
  declare type BasePropsWithChildren<T = unknown> = PropsWithChildren<
    BaseProps<T>
  >;
  declare type KeyOf<T> = Extract<keyof T, string>;
}
