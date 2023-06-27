import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server";

// create Hugging Face Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Docs require us to set the runtime to edge.
export const runtime = 'edge';

// Build a prompt from the messages out of the request
// This is specific to the OpenAssistant model we are using.
// @see https://huggingface.co/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5#prompting
function buildOpenAssistantPrompt(
    messages: { content: string, role: 'system' | 'user' | 'assistant' }[]
) {
    return (
        messages
          .map(({ content, role }) => {
            if (role === 'user') {
              return `<|prompter|>${content}<|endoftext|>`
            } else {
              return `<|assistant|>${content}<|endoftext|>`
            }
          })
          .join('') + '<|assistant|>'
      )
}

export async function POST(request: NextRequest): Promise<StreamingTextResponse> {

    // Extract the messages from the request body
    const { messages } = await request.json();

    const response = Hf.textGenerationStream({
        model: process.env.HUGGINGFACE_AI_MODEL ?? 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
        inputs: buildOpenAssistantPrompt(messages),
        parameters: {
            max_new_tokens: parseInt(process.env.MAX_NEW_TOKENS ?? "200", 10),
            // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
            typical: parseFloat(process.env.TYPICAL ?? "0.2"),
            repetition_penalty: parseInt(process.env.REPETITION_PENALTY ?? "1", 10), 
            truncate: parseInt(process.env.TRUNCATE ?? "1000", 10),
            return_full_text: ((process.env.RETURN_FULL_TEXT ?? "false") === "true"),
        },
    });

    // Convert the response into a friendly text-stream
    const stream = HuggingFaceStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}