'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCourseRecommendations } from '@/ai/flows/course-recommendations';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Recommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setRecommendations([]);

    const formData = new FormData(event.currentTarget);
    const learningHistory = formData.get('learningHistory') as string;
    const preferences = formData.get('preferences') as string;

    try {
      const result = await getCourseRecommendations({
        learningHistory,
        preferences,
      });
      setRecommendations(result.courses);
    } catch (error) {
        console.error('Failed to get recommendations', error);
        toast({
            title: "Error",
            description: "Could not fetch recommendations. Please try again.",
            variant: "destructive"
        })
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="font-headline text-2xl">
            AI Course Recommender
          </CardTitle>
        </div>
        <CardDescription>
          Tell us about your interests and past studies to get personalized course
          recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="learningHistory">Learning History</Label>
            <Textarea
              id="learningHistory"
              name="learningHistory"
              placeholder="e.g., 'Completed Intro to Python', 'Studied web development for 2 years'"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferences">Preferences</Label>
            <Input
              id="preferences"
              name="preferences"
              placeholder="e.g., 'Interested in AI and machine learning', 'Beginner difficulty'"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Recommendations
          </Button>
        </form>

        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Recommended for you:</h3>
            <ul className="list-disc list-inside bg-muted p-4 rounded-md">
                {recommendations.map((course, index) => (
                    <li key={index}>{course}</li>
                ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
