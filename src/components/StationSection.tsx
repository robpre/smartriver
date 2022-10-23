import { FC, PropsWithChildren } from "react";
import { getStationId } from "../lib/getStationId";
import { Station } from "../types/StationResponse";

export interface Props extends PropsWithChildren {
  station: Station;
}

export const StationSection: FC<Props> = ({ station, children }) => (
  <section>
    <h2>
      station: {station.riverName} -- {station.label} ({getStationId(station)})
    </h2>

    <a
      href={`https://check-for-flooding.service.gov.uk/station/${station.RLOIid}`}
      target="_blank"
      rel="noreferrer"
    >
      check-for-flooding.service.gov.uk/station/{station.RLOIid}
    </a>

    {children}
  </section>
);
