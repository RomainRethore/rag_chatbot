import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

import { MongoClient } from "mongodb";

import dotenv from "dotenv";

dotenv.config();

const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
    model: process.env.HUGGINGFACE_MODEL,
});

async function createIndex(collection_name) {
    try {
        const client = new MongoClient(process.env.MONGO_DB_CLOUD_URL || "");
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection(collection_name);
        const vector_collection = db.collection(`${collection_name}_vectors`);

        const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
            collection: vector_collection,
            indexName: "default", // The name of the Atlas search index. Defaults to "default"
            textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
            embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
        })

        await db.collection(`${collection_name}_vectors`).deleteMany({});


        const collection_items = await collection.find({}).toArray();

        const documents = [];

        collection_items.forEach(item => {
            const document = {
                pageContent: `Country : ${item.country}, Transnational Issues: Illicit drugs:${item.data["Transnational Issues: Illicit drugs"]}`,
                metadata: { country: item.country, data: item.data["Transnational Issues: Illicit drugs"] },
            };
            documents.push(document);
            // console.log(document);
        });

        await vectorStore.addDocuments(documents);
        await client.close();

    } catch (error) {
        console.error("Error creating index:", error);
    }
}

async function main() {
    await createIndex("countries");

}

main()
    .then(() => {
        console.log("Index creation completed");
    })
    .catch((error) => {
        console.error("Error in index creation:", error);
    });