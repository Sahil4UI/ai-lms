'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { askCourseAssistant } from '@/ai/flows/ai-assistant';
import { Bot, Loader2, Send, User, LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Course } from '@/lib/data';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiAssistant({ course }: { course: Course }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <Card className="sticky top-24">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>AI Course Assistant</CardTitle>
              <CardDescription>Log in to ask questions!</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Unlock the power of our AI Assistant by logging in. Get instant answers to your course-related questions and accelerate your learning.
          </p>
          <Button asChild className="w-full">
            <Link href="/auth/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login to Get Started
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const courseContext = `Title: ${course.title}\nDescription: ${
    course.description
  }\nLectures: ${course.lectures.map((l) => l.title).join(', ')}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await askCourseAssistant({
        courseContext,
        question: input,
      });
      const assistantMessage: Message = { role: 'assistant', content: result.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get answer:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-primary" />
            <div>
                <CardTitle>AI Course Assistant</CardTitle>
                <CardDescription>Ask me anything about this course!</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[450px]">
            <ScrollArea className="flex-1 mb-4 pr-4">
                <div className="space-y-4">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                        Your conversation will appear here.
                    </div>
                )}
                {messages.map((message, index) => (
                    <div
                    key={index}
                    className={cn(
                        'flex items-start gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                    >
                    {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={18} /></AvatarFallback>
                        </Avatar>
                    )}
                     <div
                        className={cn(
                        'rounded-lg p-3 text-sm max-w-[80%]',
                        message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                         <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none prose-p:my-0">
                            {message.content}
                         </ReactMarkdown>
                    </div>
                    {message.role === 'user' && (
                         <Avatar className="h-8 w-8">
                            <AvatarFallback><User size={18} /></AvatarFallback>
                        </Avatar>
                    )}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={18} /></AvatarFallback>
                        </Avatar>
                         <div className="rounded-lg p-3 text-sm bg-muted flex items-center space-x-2">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <span>Thinking...</span>
                         </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Explain Big O notation..."
                className="flex-1"
                rows={1}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as any);
                    }
                }}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
      </CardContent>
    </Card>
  );
}
