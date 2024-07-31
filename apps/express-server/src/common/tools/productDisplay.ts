require("dotenv").config();
import { tool } from "@langchain/core/tools";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoClient } from "mongodb";
import { z } from "zod";
import { ioCache } from "../ioCache";
const retriverSchema = z.object({
    query: z.string(),
    limit: z.number(),
    shopDomain: z.string()
});
const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
const collection = client.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_DB_COLLECTION || "");
const embeddingModel = new OpenAIEmbeddings(
    {
        azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME || "",
        azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME || "",
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY || "",
        azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION || ""
    }
);
export const productDisplayTool = tool(
    async (input:{query: string, limit: number,shopDomain: string}, config): Promise<any> => {
        // const vectorStore = new MongoDBAtlasVectorSearch(embeddingModel, {
        //     collection
        // });
        // let shop = input.shopDomain + ".myshopify.com"
        // const retriever = vectorStore.asRetriever({
        //     filter:{
        //         preFilter:{
        //             yugaa_shop:{
        //                 $eq: shop
        //             },
        //             yugaa_type:{
        //                 $eq: "product"
        //             }
        //         }
        //     }
        // })
        // console.log(input.query)
        // const resultOne = await retriever.invoke(input.query);
        // const io = ioCache.get(config?.configurable.thread_id);
        // let finalResult : {products: string[]} = {products : []};
        // resultOne.map(doc=>{
        //     finalResult.products.push(JSON.stringify(doc.metadata))
        // })
        // console.log(finalResult.products)
        // io.emit("products",{products: finalResult.products})

        return 'Write now you dont have ability to show images';
    },
    {
        name: "productDisplayTool",
        description: "Finds relevant information about products and displays to the consumer",
        schema: retriverSchema,
    }
);
