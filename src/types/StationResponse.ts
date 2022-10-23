export interface StationResponse {
  "@context": string;
  meta: Meta;
  items: Station;
}

export type StationLabel = string;

export type StationID = string;

export interface Station {
  "@id": string;
  RLOIid: string;
  catchmentName: string;
  dateOpened: string;
  datumOffset?: number;
  eaAreaName: string;
  eaRegionName: string;
  easting: number;
  gridReference: string;
  label: StationLabel;
  lat: number;
  long: number;
  measures: Measures;
  northing: number;
  notation: StationID;
  riverName: string;
  stageScale: StageScale;
  stationReference: string;
  status: string;
  town: string;
  type: string[];
  wiskiID: string;
}

export interface Measures {
  "@id": string;
  datumType?: string;
  label: string;
  latestReading: LatestReading;
  notation: string;
  parameter: string;
  parameterName: string;
  period: number;
  qualifier: string;
  station: string;
  stationReference: string;
  type: string[];
  unit: string;
  unitName: string;
  valueType: string;
}

export interface LatestReading {
  "@id": string;
  date: string;
  dateTime: string;
  measure: string;
  value: number;
}

export interface StageScale {
  "@id": string;
  datum: number;
  highestRecent: HighestRecent;
  maxOnRecord: HighestRecent;
  minOnRecord: HighestRecent;
  scaleMax: number;
  typicalRangeHigh: number;
  typicalRangeLow: number;
}

export interface HighestRecent {
  "@id": string;
  dateTime: string;
  value: number;
}

export interface Meta {
  publisher: string;
  licence: string;
  documentation: string;
  version: string;
  comment: string;
  hasFormat: string[];
}
