import { Station, StationResponse } from "../types/StationResponse";
import stations from "../../manual-scraped-data/stations.json";

export const getStationId = (
  station: StationResponse | typeof stations["items"][number] | Station
) => ("items" in station ? station.items.notation : station.notation);
