import "dotenv/config";
import {DataAPIClient} from "@datastax/astra-db-ts"

const Url=process.env.ASTRA_DB_API_ENDPOINT
const token=process.env.ASTRA_DB_APPLICATION_TOKEN



if(!token){
    throw new Error("missing Astra app token");
}

if (!Url) {
  throw new Error("Missing ASTRA_DB_API_ENDPOINT");
}

const client =new DataAPIClient(token);
export const db=client.db(Url);



(async () => {
  const colls = await db.listCollections();
  console.log('Connected to AstraDB:', colls);
})();