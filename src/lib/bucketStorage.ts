import {
  GetObjectCommand,
  PutObjectCommand,
  NoSuchKey,
  NotFound,
  GetObjectOutput,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { mustGetSecrets } from "../getSecrets";
import { Station, LatestReading, StationID } from "../types/StationResponse";
import { aws } from "./aws";

export const getStation = async (id: StationID): Promise<Station> => {
  const { s3 } = aws();
  const { historicReadingsBucket } = mustGetSecrets();

  const response = await s3.send(
    new GetObjectCommand({
      Bucket: historicReadingsBucket,
      Key: `stations/${id}/station.json`,
    })
  );

  if (!response.Body) {
    throw new Error("not found");
  }

  const text = await collectBody(response.Body);

  return JSON.parse(text);
};

export const saveStation = async (station: Station) => {
  const id = station.items.notation;
  const { s3 } = aws();
  const { historicReadingsBucket } = mustGetSecrets();

  await s3.send(
    new PutObjectCommand({
      Bucket: historicReadingsBucket,
      Key: `stations/${id}/station.json`,
      Body: JSON.stringify(station),
    })
  );
};

const collectBody = async (
  body: Exclude<GetObjectOutput["Body"], undefined>
): Promise<string> => {
  if ("text" in body) {
    return body.text();
  }

  if (!(body instanceof Readable)) {
    console.error("what is tryGetObject", body);
    throw new Error("no idea how to process Body");
  }

  return new Promise((resolve, reject) => {
    let chunks = "";

    body.once("error", (err) => reject(err));

    body.on("data", (chunk) => (chunks += chunk));

    body.once("end", () => resolve(chunks));
  });
};

const tryGetObject = async <T>(Key: string): Promise<T | null> => {
  const { s3 } = aws();
  const { historicReadingsBucket } = mustGetSecrets();

  try {
    const r = await s3.send(
      new GetObjectCommand({
        Bucket: historicReadingsBucket,
        Key,
      })
    );

    if (!r.Body) {
      throw new Error("not found");
    }

    const text = await collectBody(r.Body);

    return JSON.parse(text);
  } catch (err) {
    if (err instanceof NoSuchKey || err instanceof NotFound) {
      return null;
    }

    throw err;
  }
};

const readingsKey = (id: StationID) => `stations/${id}/readings.json`;

export const getReadings = async (id: StationID) => {
  return (await tryGetObject<LatestReading[]>(readingsKey(id))) || [];
};

export const addReading = async (id: StationID, reading: LatestReading) => {
  const { s3 } = aws();
  const { historicReadingsBucket } = mustGetSecrets();
  const Key = readingsKey(id);

  let readings: LatestReading[] = await getReadings(id);

  readings = readings.filter((r) => r.dateTime !== reading.dateTime);

  readings.push(reading);

  await s3.send(
    new PutObjectCommand({
      Bucket: historicReadingsBucket,
      Key,
      Body: JSON.stringify(readings),
    })
  );
};
