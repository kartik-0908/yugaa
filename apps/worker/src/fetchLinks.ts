require('dotenv').config();
console.log(process.env.SCRAPING_ANT_API_KEY);
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { embeddingModel } from "./lib/azureOpenai/embedding";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import axios from "axios";


export async function addLinks(id: number, shop: string, url: string) {
    const res = await axios.get(`https://api.scrapingant.com/v2/markdown?url=${url}&x-api-key=${process.env.SCRAPING_ANT_API_KEY}`);
    const { markdown } = res.data;
    //   console.log(newDocuments);
    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
    const collection = client.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_DB_COLLECTION || "");
    const textSplitter = new CharacterTextSplitter({
        separator: "\n\n",
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const texts = await textSplitter.createDocuments([markdown], [{ yugaa_type: 'url', url_id: id, yugaa_shop: shop }]);
    texts.map(async (text) => {
        console.log(text);
        const res = await new MongoDBAtlasVectorSearch(embeddingModel, {
            collection,
        }).addDocuments([text]);
        console.log(res);
    })
}


export async function deleteLinks(id: number) {

    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(process.env.MONGO_DB_NAME);
        const collection = db.collection(process.env.MONGO_DB_COLLECTION || "");
        const result = await collection.deleteMany({ url_id: id });
        console.log(`${result.deletedCount} document(s) were deleted.`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }

}