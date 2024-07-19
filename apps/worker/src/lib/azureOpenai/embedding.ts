import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";

require('dotenv').config();


export const embeddingModel = new OpenAIEmbeddings(
    {
        azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME,
        azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION
    }
);

export const chatModel = new ChatOpenAI(
    {
      azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_CHAT_DEPLOYMENT_NAME,
      azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_CHAT_VERSION,
    }
  );