import format from "date-fns/format";
import { CSSProperties, FC } from "react";
import { get95Percentile } from "../lib/data";
import classes from "../styles/tables.module.css";
import { AlertState, AlertTypes } from "../types/DB/LatestAlertState";
import {
  LatestReading,
  Station,
  StationResponse,
} from "../types/StationResponse";

// copied from api/cron
const pretty = (s: string) => {
  return s
    .replace(/([A-Z])/g, " $1")
    .replace(/([0-9]+)/g, " $1")
    .trim();
};

const d = (s: string) => format(new Date(s), "dd/MM/yyyy - kk:mm");

const TD: FC<{
  children?: string | number | null | boolean;
  style?: CSSProperties;
  append?: string;
  alt?: string;
}> = ({ children, style, append, alt = "no" }) => (
  <td style={style}>
    {children || alt}
    {children ? append : null}
  </td>
);

export interface Props {
  data: AlertTableData;
}

export interface AlertTableData {
  state: AlertState;
  station: StationResponse;
  p95: LatestReading | null;
  readings: LatestReading[];
}

const extra = (
  station: Station,
  alert: AlertTypes,
  readings: LatestReading[]
) => {
  const style: CSSProperties = { fontSize: "0.8em", color: "#f5dcd5" };

  switch (alert) {
    case AlertTypes.HigherThanTypicalRangeHigh:
      return (
        <span style={style}>
          ({station.stageScale.typicalRangeHigh} Meters)
        </span>
      );
    case AlertTypes.HigherThanMaxOnRecord:
      return (
        <span style={style}>
          ({station.stageScale.maxOnRecord.value} Meters)
        </span>
      );
    case AlertTypes.HigherThanHighestRecent:
      return (
        <span style={style}>
          ({station.stageScale.highestRecent.value} Meters)
        </span>
      );
    case AlertTypes.DeltaSpike:
      return <span style={style}>(greater than 10% change)</span>;
    case AlertTypes.HigherThan95Percentile:
    case AlertTypes.TenPercentHigherThan95Percentile:
    case AlertTypes.FiftyPercentHigherThan95Percentile:
    case AlertTypes.HundredPercentHigherThan95Percentile:
      return (
        <span style={style}>
          <>({get95Percentile(readings)?.value} meters)</>
        </span>
      );
  }
};

const style: CSSProperties = {
  backgroundColor: "#16383b",
  textAlign: "left",
  border: "1px solid black",
};

export const AlertTable: FC<Props> = ({ data }) => (
  <table className={classes.Table}>
    <caption>Alerts</caption>
    <thead>
      <tr>
        <th style={style}>Datapoint</th>
        <th style={style} scope="col">
          Is triggered
        </th>
        <th style={style} scope="col">
          Value (in meters)
        </th>
        <th style={style} scope="col">
          At
        </th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(data.state).map(([key, val]) => {
        return (
          <tr key={key}>
            <th style={style} scope="row">
              <span>{pretty(key)}</span>{" "}
              <span>
                {extra(data.station.items, key as AlertTypes, data.readings)}
              </span>
            </th>
            <TD style={style}>{val && val.activated && "yes"}</TD>
            <TD style={style} append=" Meters" alt="--">
              {val && val.value}
            </TD>
            <TD style={style} alt="--">
              {val && d(val.dateTime)}
            </TD>
          </tr>
        );
      })}
    </tbody>
  </table>
);
