import { NextApiHandler } from "next";
import fetch from "node-fetch";
import stations from "../../../manual-scraped-data/stations.json";
import { CRON_API_SECRET, NODE_ENV, NOTIFICATION_EMAILS } from "../../config";
import { addReading, saveStation } from "../../lib/bucketStorage";
import { Station } from "../../types/StationResponse";

// const maybeSendEmail = async (station: Station) => {
//   const { ses } = aws();

//   const {
//     highestRecent,
//     maxOnRecord,
//     typicalRangeHigh,
//   } = station.items.stageScale;

//   const alerts: string[] = [];

//   ses.send(
//     new SendEmailCommand({
//       Destination: { ToAddresses: NOTIFICATION_EMAILS },
//       Message: {
//         Subject: {
//           Data: `${station.items.riverName} - ${}`
//         },
//         Body: ``,
//       },
//       Source: "noreply@smartriver.top",
//     })
//   );
// };

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
        const station = (await response.json()) as Station;

        await saveStation(station);
        await addReading(
          station.items.notation,
          station.items.measures.latestReading
        );
      } else {
        console.error("error (%d) response from %s", response.status, url);
      }
    })
  );

  res.status(200).send("OK");
};

export default handler;
