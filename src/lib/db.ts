import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { mustGetSecrets } from "../getSecrets";
import { Key, Entity, EntityNames, NoKey } from "../types/DB";
import { aws } from "./aws";

export async function putItem<E extends EntityNames>(
  key: Key<E>,
  obj: NoKey<Entity<E>>
): Promise<Entity<E>> {
  const { db } = aws();
  const { appStorageTableName } = mustGetSecrets();

  const Item: Entity<E> = {
    ...obj,
    ...key,
  };

  await db.send(
    new PutCommand({
      TableName: appStorageTableName,
      Item,
    })
  );

  return Item;
}

export async function getItem<E extends EntityNames>(
  key: Key<E>
): Promise<Entity<E> | null> {
  const { db } = aws();
  const { appStorageTableName } = mustGetSecrets();

  const response = await db.send(
    new GetCommand({
      TableName: appStorageTableName,
      Key: key,
    })
  );

  if (!response.Item) {
    return null;
  }

  return response.Item as Entity<E>;
}
