import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = "mongodb+srv://st10095103:Leadpost%4085@cluster0.l2svcve.mongodb.net/cluster0?retryWrites=true&w=majority";
console.log(url);
const client = new MongoClient(url);

let conn;
  try {
    conn = await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }


let db = client.db("users");

export default db;
