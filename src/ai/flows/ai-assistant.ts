'use server';
/**
 * @fileOverview An AI assistant for courses.
 *
 * - askCourseAssistant - A function that handles answering student questions.
 * - CourseAssistantInput - The input type for the askCourseAssistant function.
 * - CourseAssistantOutput - The return type for the askCourseAssistant function.
 */

import {defineFlow, AITool, defineTool} from 'genkit';
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
    role: z.enum(['user', 'assistant']),
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

const courseAssistantFlow = defineFlow(
  {
    name: 'courseAssistantFlow',
    inputSchema: CourseAssistantInputSchema,
    outputSchema: CourseAssistantOutputSchema,
  },
  async input => {
    const prompt = `You are LearnAI Bot, a friendly and brilliant AI teaching assistant for an online course. Your goal is to help students learn by answering their questions.

- Base your answers *only* on the provided course context (title, description, and lecture notes).
- If a question is outside the scope of the course material, politely state that you can only answer questions about this course.
- Use the provided conversation history to understand follow-up questions.
- Keep your answers clear, concise, and encouraging.
- Format code snippets using Markdown with the correct language identifier (e.g., \`\`\`javascript).
- When you provide a code example, briefly explain what the code does.

## Course Context
Course Title: ${input.courseTitle}
Course Description: ${input.courseDescription}

---
Available Course Lectures and Notes:
${input.lectures.map(l => `Lecture: ${l.title}\nNotes:\n${l.notes || 'No notes available for this lecture.'}`).join('\n---\n')}

## Conversation History
${(input.history || []).map(m => `**${m.role}**: ${m.content}`).join('\n')}

## Current Student Question
"${input.question}"

## Your Answer (in Markdown)`;

    const llmResponse = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-pro',
      output: {
        format: 'json',
        schema: CourseAssistantOutputSchema,
      },
    });
    
    return llmResponse.output()!;
  }
);
