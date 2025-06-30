import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Playground',
  description: 'Experiment, practice, and perfect your coding skills in JavaScript, Python, and more, right here in your browser.',
};


export default function PlaygroundPage() {
  const placeholderCode = `// Welcome to the LearnAI Playground!
// This is a space for you to experiment with code.
// Select a language from the dropdown and start coding.
// Full compiler and interpreter support is coming soon!

function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Learner");
`;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-br from-primary via-slate-400 to-accent bg-clip-text text-transparent">
          Code Playground
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Experiment, practice, and perfect your coding skills right here in your browser.
        </p>
      </header>

      <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>My Scratchpad</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="javascript">
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select Environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python" disabled>Python (coming soon)</SelectItem>
                  <SelectItem value="html" disabled>HTML/CSS (coming soon)</SelectItem>
                  <SelectItem value="flutter" disabled>Flutter (coming soon)</SelectItem>
                  <SelectItem value="excel" disabled>Excel Simulator (coming soon)</SelectItem>
                  <SelectItem value="mysql" disabled>MySQL (coming soon)</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Play className="mr-2 h-4 w-4" />
                Run Code
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your code here..."
            className="min-h-[400px] font-code text-base bg-black/50 border-white/20"
            defaultValue={placeholderCode}
          />
           <p className="text-xs text-muted-foreground mt-2">
            Note: Code execution is a mock-up. Full-fledged compilers and interpreters are under development.
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
