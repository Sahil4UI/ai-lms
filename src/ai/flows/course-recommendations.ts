// src/ai/flows/course-recommendations.ts
'use server';

/**
 * @fileOverview A course recommendation AI agent.
 *
 * - getCourseRecommendations - A function that handles the course recommendation process.
 * - CourseRecommendationsInput - The input type for the getCourseRecommendations function.
 * - CourseRecommendationsOutput - The return type for the getCourseRecommendations function.
 */

import {defineFlow} from 'genkit';
import {ai} from '@/ai/genkit';
import {z} from 'zod';

const CourseRecommendationsInputSchema = z.object({
  learningHistory: z
    .string()
    .describe('The learning history of the student, including courses taken and subjects studied.'),
  preferences: z
    .string()
    .describe('The preferences of the student, including preferred subjects and difficulty level.'),
});
export type CourseRecommendationsInput = z.infer<typeof CourseRecommendationsInputSchema>;

const CourseRecommendationsOutputSchema = z.object({
  courses: z
    .array(z.string())
    .describe('A list of course titles that are recommended for the student.'),
});
export type CourseRecommendationsOutput = z.infer<typeof CourseRecommendationsOutputSchema>;

export async function getCourseRecommendations(input: CourseRecommendationsInput): Promise<CourseRecommendationsOutput> {
  return courseRecommendationsFlow(input);
}

const courseRecommendationsFlow = defineFlow(
  {
    name: 'courseRecommendationsFlow',
    inputSchema: CourseRecommendationsInputSchema,
    outputSchema: CourseRecommendationsOutputSchema,
  },
  async input => {
    const prompt = `You are an AI course recommendation engine. Based on the learning history and preferences of the student, you will recommend a list of courses that are relevant and interesting to the student.

Learning History: ${input.learningHistory}
Preferences: ${input.preferences}

Recommended Courses:`;

    const llmResponse = await ai.generate({
      prompt,
      model: 'googleai/gemini-pro',
      output: {
        format: 'json',
        schema: CourseRecommendationsOutputSchema,
      },
    });

    return llmResponse.output()!;
  }
);
