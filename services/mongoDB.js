import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config'

const CONNECTION_STRING = process.env.CONNECTION_STRING;
const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(CONNECTION_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connect(collection) {
  try {
    await client.connect();
    const db = client.db(DB_NAME);

    return db.collection(collection);
  } catch (err) {
    console.error("Error connecting to the database");
    console.error(err);

    await client.close();
  }
}

export async function checkOwner(collectionName, objectId, idUser) {
  const db = await connect(collectionName);
  const res = await db.findOne({ _id: objectId, idUser })
  if (!res) throw Error("The owner is not the same");
}