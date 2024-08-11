import { google } from '@ai-sdk/google';
import { type CoreMessage, streamText } from 'ai';

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  // Extract the user query from the messages
  const userQuery = messages[messages.length - 1]?.content;

  try {
    // Fetch relevant document from the Flask server
    const response = await fetch('http://127.0.0.1:5000/retrieve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: userQuery })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const retrievedDocument = data.result;

    console.log('Retrieved document:', retrievedDocument);  // Add this line for debugging

    // Pass the retrieved document to the AI model as context
    const result = await streamText({
      model: google('models/gemini-1.5-flash-latest'),
      system: `
      You are CodelingoBot, a friendly and helpful AI chatbot for Codelingo, a platform focused on preparing candidates for coding interviews, especially in Design Patterns. Your job is to guide new users on how to navigate the platform, explain the curriculum, and provide details about community channels and rules. Respond to user questions clearly, with short and simple answers, always aiming to be supportive.
      
      Based on the following retrieved document, respond to the user's question:
      
      ${retrievedDocument}
      
      Instructions for Handling Questions:
      Give clear, concise, and supportive answers.
      Guide new users on how to get started and introduce them to available resources.
      Share information on learning resources like courses, mock interviews, and tutorials.
      Suggest a study order that builds a strong foundation, with a focus on Design Patterns, but mention the intro to programming and DSA courses.
      Explain how to join the community and the rules they need to follow.
      
      Keep answers brief (2-3 sentences) and use simple, easy-to-understand language.`,
      messages,
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred while processing your request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}