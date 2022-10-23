import { LatestAlertState } from "./DB/LatestAlertState";

export type EntityNames = string & "LatestAlertState";

export type Entity<E extends EntityNames> = E extends "LatestAlertState"
  ? LatestAlertState
  : never;

export interface Key<E extends EntityNames> {
  id: string;
  entity: E;
}

export type NoKey<T> = T extends Entity<infer E>
  ? Omit<T, keyof Key<E>>
  : never;
