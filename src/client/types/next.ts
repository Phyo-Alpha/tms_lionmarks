import { SearchParams } from "nuqs";
import type { ReactNode } from "react";

export interface PageProps<
  TParams extends object = object,
  TSeach extends object = Promise<SearchParams>,
> {
  params: Promise<TParams>;
  searchParams: TSeach;
}
export interface LayoutProps<TParams extends object = object> {
  params: Promise<TParams>;
  children: ReactNode;
}
