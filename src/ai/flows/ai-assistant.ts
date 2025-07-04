
'use server';
/**
 * @fileOverview An AI assistant for courses.
 *
 * - askCourseAssistant - A function that handles answering student questions.
 * - CourseAssistantInput - The input type for the askCourseAssistant function.
 * - CourseAssistantOutput - The return type for the askCourseAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CourseAssistantInputSchema = z.object({
  courseTitle: z.string(),
  courseDescription: z.string(),
  lectures: z.array(z.object({
    title: z.string(),
    notes: z.string().optional(),
  })).describe("A list of lectures with their titles and detailed notes."),
  question: z
    .string()
    .describe('The current question from the student.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model', 'assistant']),
    content: z.string()
  })).optional().describe("The conversation history between the user and the assistant.")
});
export type CourseAssistantInput = z.infer<typeof CourseAssistantInputSchema>;

const CourseAssistantOutputSchema = z.object({
  answer: z.string().describe("The answer to the student's question. The answer should be in Markdown format."),
});
export type CourseAssistantOutput = z.infer<typeof CourseAssistantOutputSchema>;

export async function askCourseAssistant(input: CourseAssistantInput): Promise<CourseAssistantOutput> {
  return courseAssistantFlow(input);
}

const prompt = ai.definePrompt(
  {
    name: 'courseAssistantPrompt',
    input: { schema: CourseAssistantInputSchema },
    output: { schema: CourseAssistantOutputSchema },
    system: `You are LearnAI Bot, a friendly and brilliant AI teaching assistant for an online course. Your goal is to help students learn by answering their questions.

- Base your answers *only* on the provided course context (title, description, and lecture notes).
- If a question is outside the scope of the course material, politely state that you can only answer questions about this course.
- Use the provided conversation history to understand follow-up questions.
- Keep your answers clear, concise, and encouraging.
- Format code snippets using Markdown with the correct language identifier (e.g., \`\`\`javascript).
- When you provide a code example, briefly explain what the code does.

## Course Context
Course Title: {{{courseTitle}}}
Course Description: {{{courseDescription}}}

---
Available Course Lectures and Notes:
{{#each lectures}}
Lecture: {{{title}}}
Notes:
{{{notes}}}
---
{{/each}}`,
  },
);

const courseAssistantFlow = ai.defineFlow(
  {
    name: 'courseAssistantFlow',
    inputSchema: CourseAssistantInputSchema,
    outputSchema: CourseAssistantOutputSchema,
  },
  async (input) => {
    // Map the role 'assistant' from our app to 'model' for Genkit
    const history = (input.history || []).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      content: [{text: msg.content}]
    }));

    const llmResponse = await ai.generate({
        prompt: input.question,
        history: history,
        model: 'googleai/gemini-1.5-flash-preview',
        system: prompt.compile({input: input}),
        output: {
            schema: CourseAssistantOutputSchema
        }
    });

    return llmResponse.output!;
  }
);
