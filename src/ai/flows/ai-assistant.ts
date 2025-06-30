'use server';
/**
 * @fileOverview An AI assistant for courses.
 *
 * - askCourseAssistant - A function that handles answering student questions.
 * - CourseAssistantInput - The input type for the askCourseAssistant function.
 * - CourseAssistantOutput - The return type for the askCourseAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseAssistantInputSchema = z.object({
  courseContext: z
    .string()
    .describe('The context of the course, including title, description, and lecture topics.'),
  question: z
    .string()
    .describe('The question from the student.'),
});
export type CourseAssistantInput = z.infer<typeof CourseAssistantInputSchema>;

const CourseAssistantOutputSchema = z.object({
  answer: z.string().describe("The answer to the student's question. The answer should be in Markdown format."),
});
export type CourseAssistantOutput = z.infer<typeof CourseAssistantOutputSchema>;

export async function askCourseAssistant(input: CourseAssistantInput): Promise<CourseAssistantOutput> {
  return courseAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseAssistantPrompt',
  input: {schema: CourseAssistantInputSchema},
  output: {schema: CourseAssistantOutputSchema},
  prompt: `You are a friendly and helpful AI teaching assistant for an online course. Your goal is to answer student questions based on the provided course context. Be clear, concise, and encouraging. If the question is outside the scope of the course, politely say that you cannot answer it.

Course Context:
---
{{{courseContext}}}
---

Student's Question:
"{{{question}}}"

Your Answer (in Markdown):`,
});

const courseAssistantFlow = ai.defineFlow(
  {
    name: 'courseAssistantFlow',
    inputSchema: CourseAssistantInputSchema,
    outputSchema: CourseAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
