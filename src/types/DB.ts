export type EntityNames = string & "AlertState";

export type Entity<E extends EntityNames> = E extends "AlertState"
  ? AlertState
  : never;

export interface Key<E extends EntityNames> {
  id: string;
  entity: E;
}

export type NoKey<T> = T extends Entity<infer E> ? Exclude<T, Key<E>> : never;

export enum AlertTypes {
  TenHigherThan95Percentile = "TenHigherThan95Percentile",
  FiftyHigherThan95Percentile = "FiftyHigherThan95Percentile",
  HundredHigherThan95Percentile = "HundredHigherThan95Percentile",
  HigherThanTypicalRangeHigh = "HigherThanTypicalRangeHigh",
}

export interface AlertState extends Key<"AlertState"> {
  lastAlerts: AlertTypes[];
  state: Record<AlertTypes, boolean>;
}
