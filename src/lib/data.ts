import {
  AlertState,
  AlertTypes,
  LatestAlertState,
  RecordedAlertState,
} from "../types/DB/LatestAlertState";
import { LatestReading, StationResponse } from "../types/StationResponse";
import { getReadings } from "./bucketStorage";
import { getStationId } from "./getStationId";

export const get95Percentile = (
  readings: LatestReading[]
): LatestReading | null => {
  // n = (percentile/100) x numVals
  // where numVals = number of values in the data set, P = percentile,
  // and n = ordinal rank of a given value (with the values in
  // the data set sorted from smallest to largest).
  const numVals = readings.length;
  const percentile = 95;
  const n = (percentile / 100) * numVals;
  const vals = readings.slice();

  vals.sort((a, b) => a.value - b.value);

  return vals[Math.floor(n)] || null;
};

export const getAlertState = async (
  state: AlertState,
  station: StationResponse,
  readings: LatestReading[]
): Promise<[boolean, AlertState]> => {
  let hasNewAlert = false;
  let {
    HigherThan95Percentile,
    TenPercentHigherThan95Percentile,
    FiftyPercentHigherThan95Percentile,
    HundredPercentHigherThan95Percentile,
    HigherThanTypicalRangeHigh,
    HigherThanHighestRecent,
    HigherThanMaxOnRecord,
    DeltaSpike,
  } = state;

  const { highestRecent, maxOnRecord, typicalRangeHigh } =
    station.items.stageScale;

  const { dateTime, value } = station.items.measures.latestReading;

  const doCalc = (
    alert: RecordedAlertState | undefined,
    isOver: unknown
  ): RecordedAlertState => {
    if (!isOver) {
      return false;
    }

    if (alert) {
      return alert;
    }

    hasNewAlert = true;

    return {
      activated: true,
      dateTime,
      value,
    };
  };

  HigherThanTypicalRangeHigh = doCalc(
    HigherThanTypicalRangeHigh,
    value > typicalRangeHigh
  );
  HigherThanHighestRecent = doCalc(
    HigherThanHighestRecent,
    value > highestRecent.value
  );
  HigherThanMaxOnRecord = doCalc(
    HigherThanMaxOnRecord,
    value > maxOnRecord.value
  );

  const sorted = readings.slice();
  sorted.sort((a, b) => a.value - b.value);
  const latestPrevValue = sorted.pop();
  const diff = latestPrevValue && value - latestPrevValue.value;
  const tenPercentChange = latestPrevValue ? latestPrevValue.value * 0.1 : 0;

  DeltaSpike = doCalc(DeltaSpike, diff && diff > 0 && diff > tenPercentChange);

  const nfPercentile = get95Percentile(readings);
  const isHigher = nfPercentile && value > nfPercentile?.value;

  //% increase = Increase ÷ Original Number × 100.
  const increase = nfPercentile && value - nfPercentile.value;
  const higherBy = increase && (increase / nfPercentile.value) * 100;

  HigherThan95Percentile = doCalc(HigherThan95Percentile, isHigher);
  TenPercentHigherThan95Percentile = doCalc(
    TenPercentHigherThan95Percentile,
    higherBy && higherBy > 10
  );
  FiftyPercentHigherThan95Percentile = doCalc(
    FiftyPercentHigherThan95Percentile,
    higherBy && higherBy > 50
  );
  HundredPercentHigherThan95Percentile = doCalc(
    HundredPercentHigherThan95Percentile,
    higherBy && higherBy > 100
  );

  return [
    hasNewAlert,
    {
      HigherThan95Percentile,
      TenPercentHigherThan95Percentile,
      FiftyPercentHigherThan95Percentile,
      HundredPercentHigherThan95Percentile,
      HigherThanTypicalRangeHigh,
      HigherThanHighestRecent,
      HigherThanMaxOnRecord,
      DeltaSpike,
    },
  ];
};
