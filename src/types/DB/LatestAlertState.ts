import { Key } from "../DB";

export enum AlertTypes {
  HigherThan95Percentile = "HigherThan95Percentile",
  TenPercentHigherThan95Percentile = "TenPercentHigherThan95Percentile",
  FiftyPercentHigherThan95Percentile = "FiftyPercentHigherThan95Percentile",
  HundredPercentHigherThan95Percentile = "HundredPercentHigherThan95Percentile",
  HigherThanTypicalRangeHigh = "HigherThanTypicalRangeHigh",
  HigherThanHighestRecent = "HigherThanHighestRecent",
  HigherThanMaxOnRecord = "HigherThanMaxOnRecord",
  DeltaSpike = "DeltaSpike",
}

export type RecordedAlertState =
  | false
  | {
      activated: true;
      dateTime: string;
      value: number;
    };

export type AlertState = Partial<Record<AlertTypes, RecordedAlertState>>;

export interface LatestAlertState extends Key<"LatestAlertState"> {
  state: AlertState;
  lastUpdated: string;
}
