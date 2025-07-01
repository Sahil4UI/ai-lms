
'use server';
/**
 * @fileOverview Lecture Summarization AI agent.
 *
 * - summarizeLecture - A function that handles the lecture summarization process.
 * - SummarizeLectureInput - The input type for the summarizeLecture function.
 * - SummarizeLectureOutput - The return type for the summarizeLecture function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeLectureInputSchema = z.object({
  lectureVideoDataUri: z
    .string()
    .describe(
      "A video of a lecture, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  topic: z.string().describe('The topic of the lecture.'),
});
export type SummarizeLectureInput = z.infer<typeof SummarizeLectureInputSchema>;

const SummarizeLectureOutputSchema = z.object({
  summary: z.string().describe('A summary of the lecture.'),
});
export type SummarizeLectureOutput = z.infer<typeof SummarizeLectureOutputSchema>;

export async function summarizeLecture(input: SummarizeLectureInput): Promise<SummarizeLectureOutput> {
  return summarizeLectureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLecturePrompt',
  input: { schema: SummarizeLectureInputSchema },
  output: { schema: SummarizeLectureOutputSchema },
  prompt: `You are an expert at summarizing lectures.

You will use this information to create a summary of the lecture.

Topic: {{{topic}}}
Video: {{media url=lectureVideoDataUri}}`,
});

const summarizeLectureFlow = ai.defineFlow(
  {
    name: 'summarizeLectureFlow',
    inputSchema: SummarizeLectureInputSchema,
    outputSchema: SummarizeLectureOutputSchema,
  },
  async (input) => {
    const { output } = await prompt.generate({input: input});
    return output!;
  }
);
