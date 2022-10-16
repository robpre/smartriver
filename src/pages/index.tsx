import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import stations from "../../manual-scraped-data/stations.json";
import { getReadings } from "../lib/bucketStorage";
import { manualHeightData, ConvertedCSV } from "../lib/processReadings";
import { LatestReading, StationID } from "../types/StationResponse";

interface Props {
  allReadings: Array<{
    id: StationID;
    readings: LatestReading[];
    scraped: ConvertedCSV | null;
    station: typeof stations.items[number];
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
          <section key={r.id}>
            <h2>
              station: {r.station.riverName} -- {r.station.label} ({r.id})
            </h2>

            <a
              href={`https://check-for-flooding.service.gov.uk/station/${r.station.RLOIid}`}
              target="_blank"
              rel="noreferrer"
            >
              check-for-flooding.service.gov.uk/station/{r.station.RLOIid}
            </a>

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
          </section>
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
        station,
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
