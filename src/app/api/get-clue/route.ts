import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { word, definition, level, percentage } = await request.json();

    const prompt = `
      I need a clue for the word "${word}". The word's definition is: "${definition}".
      Please provide a clue that reveals approximately ${percentage}% of the information about the word.
      The clue should be a single sentence that helps guess the word without directly giving it away.
      For a ${level} clue, make it ${level === 'small' ? 'subtle and vague' : level === 'medium' ? 'moderately helpful' : 'quite revealing but not obvious'}.
      Do not include the word itself or any direct derivatives in the clue.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides word game clues. Your clues should be concise, engaging, and appropriate for the requested difficulty level."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const clue = completion.choices[0].message.content?.trim();

    return NextResponse.json({ clue });
  } catch (error) {
    console.error('Error generating clue:', error);
    return NextResponse.json(
      { error: 'Failed to generate clue' },
      { status: 500 }
    );
  }
}
