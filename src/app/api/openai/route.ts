/**
 * https://platform.openai.com/docs/api-reference/chat/create
 */
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";

// Create OpenAI client
const config: Configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai: OpenAIApi = new OpenAIApi(config);

export const runtime = 'edge';

export async function POST(request: NextRequest) {

    const { messages } = await request.json();

    // Ask OpenAI for a streaming chat completion
    const response: Response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages,
    });

    // Convert the response into a text-stream
    // first we pass the streaming response we receive from 
    // OpenAI to `OpenAIStream`. This method decodes/extracts the 
    // text tokens in the response and the re-encode them properly 
    // for simple consumption.
    const stream: ReadableStream<any> = OpenAIStream(response);

    // return the stream
    // We can now pass the new stream directly to `StreamingTextResponse`
    // This is a utility class that extends the normal Node/Edge runtime
    // `Response` class with the default headers with we want.
    // (`Content-Type`: `text/plain`; charset=utf8; etc)
    return new StreamingTextResponse(stream);
}