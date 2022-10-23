import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import stations from "../../manual-scraped-data/stations.json";
import { StationSection } from "../components/StationSection";
import { getReadings, getStation } from "../lib/bucketStorage";
import { getStationId } from "../lib/getStationId";
import { manualHeightData, ConvertedCSV } from "../lib/processReadings";
import { LatestReading, Station, StationID } from "../types/StationResponse";

interface Props {
  allReadings: Array<{
    id: StationID;
    readings: LatestReading[];
    scraped: ConvertedCSV | null;
    station: Station;
  }>;
}

const averageScraped = (n: ConvertedCSV[number][]) => {
  const total = n.reduce((c, next) => {
    return c + parseFloat(next["Height (m)"]);
  }, 0);

  return total / n.length;
};

const Home: NextPage<Props> = ({ allReadings }) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <h1>Water</h1>

        {allReadings.map((r) => (
          <StationSection key={r.id} station={r.station}>
            <p>scraped average: {r.scraped && averageScraped(r.scraped)}</p>

            <p>s3 readings:</p>

            <ul>
              {r.readings.map((r) => (
                <li key={r["@id"]}>
                  <span>
                    {r.dateTime}: {r.value}
                  </span>
                </li>
              ))}
            </ul>
          </StationSection>
        ))}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const allReadings = await Promise.all(
    stations.items.map(async (station) => {
      return {
        id: station.notation,
        station: (await getStation(getStationId(station))).items,
        readings: await getReadings(station.notation),
        scraped: manualHeightData[station.label] || null,
      };
    })
  );

  return {
    props: {
      allReadings,
    },
  };
};

export default Home;
