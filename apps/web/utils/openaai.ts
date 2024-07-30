import { OpenAIEmbeddings } from '@langchain/openai';
import { MongoDBAtlasVectorSearch, MongoDBAtlasVectorSearchLibArgs } from '@langchain/mongodb';
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

let embeddingsInstance: OpenAIEmbeddings | null = null;

const client = new MongoClient(process.env.MONGODB_URI!);
const dbName = process.env.MONGO_DB_NAME!;
const collectionName = process.env.MONGO_DB_COLLECTION!;
const collection = client.db(dbName).collection(collectionName);

export function getEmbeddingsTransformer(): OpenAIEmbeddings {
    try {
        if (!embeddingsInstance) {
            embeddingsInstance = new OpenAIEmbeddings(
                {
                    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME || "",
                    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME || "",
                    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY || "",
                    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION || ""
                }
            );
        }
        return embeddingsInstance;
    } catch (error) {
        // Handle errors gracefully, providing informative messages and potential mitigation strategies
        console.error("Error creating OpenAIEmbeddings instance:", error);

        // Consider retrying based on error type or implementing exponential backoff for robustness
        // Log details about the error and retry attempt for debugging purposes
        console.error("Retrying creation of OpenAIEmbeddings...");
        embeddingsInstance = new OpenAIEmbeddings(); // Attempt retry

        // If multiple retries fail, provide a clear fallback mechanism or throw a more specific error
        if (!embeddingsInstance) {
            throw new Error("Failed to create OpenAIEmbeddings instance after retries. Check the logs for details.");
        }

        return embeddingsInstance; // Return the successfully created instance after retries
    }
}

