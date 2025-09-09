import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: "How well did you sleep last night?",
    options: ["Very well", "Well", "Okay", "Poorly", "Very poorly"]
  },
  {
    id: 2,
    question: "How stressed do you feel today?",
    options: ["Not at all", "A little", "Moderately", "Very", "Extremely"]
  },
  {
    id: 3,
    question: "How connected do you feel to others?",
    options: ["Very connected", "Connected", "Neutral", "Disconnected", "Very disconnected"]
  }
];

const WellnessAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <Card className="bg-card shadow-soft">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <CardTitle className="text-xl text-success">Assessment Complete!</CardTitle>
          <p className="text-muted-foreground">
            Thank you for taking time to check in with yourself
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-peaceful/20 rounded-lg border border-peaceful">
            <h4 className="font-medium text-peaceful-foreground mb-2">
              Your Wellness Insights
            </h4>
            <p className="text-sm text-muted-foreground">
              Based on your responses, consider focusing on sleep hygiene and stress management techniques today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={resetAssessment} variant="secondary" className="flex-1">
              Take Again
            </Button>
            <Button className="flex-1 bg-gradient-wellness">
              View Resources
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="bg-card shadow-soft">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">Quick Wellness Check</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-base font-medium mb-4 text-foreground">
            {questions[currentQuestion].question}
          </h3>
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full p-3 text-left rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{option}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessAssessment;