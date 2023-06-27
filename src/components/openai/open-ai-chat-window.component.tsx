"use client";

import { Message } from 'ai';
import { useChat } from 'ai/react';

export default function OpenAIChatWindow() {

    // https://sdk.vercel.ai/docs/guides/openai
    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/openai',
    });

    return (
        <div className="bot-chat-window">
            {messages.map((m: Message) => {
                return (
                    <div key={m.id} className="bot-message-bubble">
                        {m.role === 'user' ? 'User: ' : 'BOT: '}
                        {m.content}
                    </div>
                );
            })}
            <form onSubmit={handleSubmit}>
                <label>
                    Talk to the Machine Spirit...
                    <input className="chat-bot-input" value={input} onChange={handleInputChange} />
                </label>
                <button type="submit">Send</button>
            </form>
        </div>
    );
}