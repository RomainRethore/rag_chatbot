import { Ollama } from "@langchain/ollama";

import { performVectorSearch } from "./retrieval.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import dotenv from "dotenv";
dotenv.config();

async function generateAnswer(question) {
    const llm = new Ollama({
        model: process.env.OLLAMA_GENERATIVE_MODEL,
        temperature: 0.7,
        maxRetries: 2,
    });

    const template = `
    You are a stonehead who tried every drugs in the world and you are now a drug expert.
    You speak like a stoner and you are very chill.
    Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Always say "Peace." at the end of the answer.
    
    {context}
    
    Question: {question}
    
    Helpful Answer:`;

    const promptTemplateCustom = ChatPromptTemplate.fromMessages([
        ["user", template],
    ]);

    const retrievedDocs = await performVectorSearch(question, 5);

    const docsContent = retrievedDocs.map((doc) => doc.metadata);
    const messages = await promptTemplateCustom.invoke({
        question: question,
        context: docsContent,
    });
    // console.log(messages);

    const answer = await llm.invoke(messages);

    // console.log(answer);

    return answer;
}

export { generateAnswer };