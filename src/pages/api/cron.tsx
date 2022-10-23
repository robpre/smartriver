import ReactDOMServer from "react-dom/server";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { NextApiHandler } from "next";
import fetch from "node-fetch";
import format from "date-fns/format";

import stations from "../../../manual-scraped-data/stations.json";
import { CRON_API_SECRET, NODE_ENV, NOTIFICATION_EMAILS } from "../../config";
import { aws } from "../../lib/aws";
import { addReading, getReadings, saveStation } from "../../lib/bucketStorage";
import { get95Percentile, getAlertState } from "../../lib/data";
import { getStationId } from "../../lib/getStationId";
import { getItem, putItem } from "../../lib/db";
import { StationResponse } from "../../types/StationResponse";
import { AlertTable } from "../../components/AlertTable";

const maybeSendEmail = async (station: StationResponse) => {
  if (!station?.items?.measures?.latestReading) {
    console.log("missing latest reading from ", station);
    return;
  }

  const readings = await getReadings(getStationId(station));
  const { ses } = aws();
  let last = await getItem({
    id: getStationId(station),
    entity: "LatestAlertState",
  });

  if (!last) {
    last = {
      entity: "LatestAlertState",
      id: getStationId(station),
      state: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  const [hasNewAlert, state] = await getAlertState(
    last.state,
    station,
    readings
  );
  last.lastUpdated = new Date().toISOString();
  last.state = state;

  await putItem({ id: last.id, entity: last.entity }, last);

  if (hasNewAlert) {
    await ses.send(
      new SendEmailCommand({
        Destination: { ToAddresses: NOTIFICATION_EMAILS },
        Message: {
          Subject: {
            Data: `ALERT: ${station.items.riverName} - ${station.items.label} at ${station.items.measures.latestReading.value} meters`,
          },
          Body: {
            Html: {
              Data: ReactDOMServer.renderToString(
                <>
                  <h1>
                    Current height: {station.items.measures.latestReading.value}{" "}
                    meters
                  </h1>
                  <a
                    href={`https://check-for-flooding.service.gov.uk/station/${station.items.RLOIid}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    check here for a graph gov.uk/station/{station.items.RLOIid}
                  </a>
                  <AlertTable
                    data={{
                      p95: get95Percentile(readings),
                      state,
                      station,
                      readings,
                    }}
                  />
                </>
              ),
              Charset: "utf-8",
            },
          },
        },
        Source: "noreply@smartriver.top",
      })
    );
  }
};

const handler: NextApiHandler = async (req, res) => {
  if (NODE_ENV !== "development") {
    if (!CRON_API_SECRET) {
      res.status(500).send("missing key in environment");
      console.error("missing CRON_API_SECRET in environment");
      return;
    }

    if (!req.headers.authorization?.includes(CRON_API_SECRET)) {
      return res.status(401).send("Unauthorised");
    }
  }

  await Promise.all(
    stations.items.map(async ({ "@id": url }) => {
      const response = await fetch(url);

      if (response.status === 200) {
        const station = (await response.json()) as StationResponse;

        await saveStation(station);
        await addReading(
          station.items.notation,
          station.items.measures.latestReading
        );

        await maybeSendEmail(station);
      } else {
        console.error("error (%d) response from %s", response.status, url);
      }
    })
  );

  res.status(200).send("OK");
};

export default handler;
