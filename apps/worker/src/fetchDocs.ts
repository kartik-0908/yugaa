import axios from 'axios';
import { Buffer } from 'buffer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { embeddingModel } from './lib/azureOpenai/embedding';
import { MongoClient } from 'mongodb';
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb';


const getFileType = (url: string): string => {
    const match = url.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    if (!match) { return ""; }
    return match[1]?.toLowerCase() || "";
};

const downloadFile = async (url: string): Promise<Buffer> => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
};


export async function addDocs(url: string, shop: string, id: string) {
    let text = '';
    // const indexName = extractIndexName(shop)
    try {
        const fileType = getFileType(url);
        const data = await downloadFile(url);
        switch (fileType) {
            case 'pdf':
                const pdfData = await pdfParse(data);
                text = pdfData.text;
                break;
            case 'docx':
                const docxResult = await mammoth.extractRawText({ buffer: Buffer.from(data) });
                text = docxResult.value;
                break;
            case 'txt':
                text = data.toString('utf8');
                break;
            default:
                throw new Error('Unsupported file type');
        }
        const textSplitter = new CharacterTextSplitter({
            separator: "\n\n",
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const texts = await textSplitter.createDocuments([text], [{ yugaa_type: 'doc', doc_id: id,yugaa_shop: shop }]);
        const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
        const collection = client.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_DB_COLLECTION || "");
        const vectorstore = await new MongoDBAtlasVectorSearch(embeddingModel, {
            collection,
        }).addDocuments(texts);
        console.log(vectorstore);
    } catch (error) {
        console.log(error)
    }
}

export async function deletDocs(id: number) {

    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(process.env.MONGO_DB_NAME);
        const collection = db.collection(process.env.MONGO_DB_COLLECTION || "");
        const result = await collection.deleteMany({ doc_id: id });
        console.log(`${result.deletedCount} document(s) were deleted.`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }

}