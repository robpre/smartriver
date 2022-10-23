import { GetServerSideProps } from "next";
import { FC } from "react";
import stations from "../../manual-scraped-data/stations.json";
import { AlertTable, AlertTableData } from "../components/AlertTable";
import { StationSection } from "../components/StationSection";
import { getReadings, getStation } from "../lib/bucketStorage";
import { get95Percentile, getAlertState } from "../lib/data";
import { getStationId } from "../lib/getStationId";

interface Props {
  states: AlertTableData[];
}

const AlertPage: FC<Props> = ({ states }) => {
  return (
    <main>
      {states.map((s) => (
        <StationSection key={s.station.items["@id"]} station={s.station.items}>
          <>
            <AlertTable data={s} />
          </>
        </StationSection>
      ))}
    </main>
  );
};

export default AlertPage;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const states = await Promise.all(
    stations.items.map(async (s) => {
      const station = await getStation(getStationId(s));
      const [_, state] = await getAlertState(
        {},
        station,
        await getReadings(getStationId(station))
      );
      const readings = await getReadings(getStationId(s));

      return {
        state,
        station: station,
        p95: get95Percentile(readings),
        readings,
      };
    })
  );

  return {
    props: {
      states,
    },
  };
};
