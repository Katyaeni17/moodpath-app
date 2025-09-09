import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const moods = [
  { emoji: '😊', label: 'Great', value: 5, color: 'text-success' },
  { emoji: '🙂', label: 'Good', value: 4, color: 'text-peaceful-foreground' },
  { emoji: '😐', label: 'Okay', value: 3, color: 'text-warning-foreground' },
  { emoji: '😔', label: 'Down', value: 2, color: 'text-muted-foreground' },
  { emoji: '😢', label: 'Sad', value: 1, color: 'text-destructive' },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [currentStreak, setCurrentStreak] = useState(7);

  const handleMoodSelection = (moodValue: number) => {
    setSelectedMood(moodValue);
    const selectedMoodData = moods.find(mood => mood.value === moodValue);
    toast({
      title: "Mood recorded! 💙",
      description: `Thank you for checking in. You're feeling ${selectedMoodData?.label.toLowerCase()} today.`,
    });
  };

  return (
    <Card className="bg-gradient-hero border-calm shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-foreground mb-2">
          How are you feeling today?
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Your daily check-in helps track your wellness journey
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-sm text-success-foreground font-medium">
            {currentStreak} day streak! 🔥
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-3 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelection(mood.value)}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-soft ${
                selectedMood === mood.value
                  ? 'border-primary bg-primary/5 shadow-wellness'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <span className="text-3xl mb-2">{mood.emoji}</span>
              <span className={`text-sm font-medium ${mood.color}`}>
                {mood.label}
              </span>
            </button>
          ))}
        </div>
        
        {selectedMood && (
          <div className="text-center p-4 bg-calm/20 rounded-lg border border-calm">
            <p className="text-sm text-calm-foreground mb-3">
              Would you like to explore some wellness resources?
            </p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" className="bg-gradient-wellness">
                Breathing Exercise
              </Button>
              <Button size="sm" variant="secondary">
                Positive Affirmations
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;