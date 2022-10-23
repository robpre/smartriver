import Corpusty from "../../manual-scraped-data/Corpusty-height-data.csv.json";
import Ingworth from "../../manual-scraped-data/Ingworth-height-data.csv.json";

import { StationLabel, StationResponse } from "../types/StationResponse";

export type ConvertedCSV = typeof Corpusty | typeof Ingworth;

export interface AllManualData extends Record<StationLabel, ConvertedCSV> {
  Corpusty: typeof Corpusty;
  Ingworth: typeof Ingworth;
}

export const manualHeightData: AllManualData = {
  Corpusty,
  Ingworth,
};
