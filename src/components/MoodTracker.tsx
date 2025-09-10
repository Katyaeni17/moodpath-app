import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMoodTracker } from "@/hooks/useMoodTracker";

const moods = [
  { emoji: "😢", label: "Very Sad", value: 1, color: "text-red-500" },
  { emoji: "😟", label: "Sad", value: 2, color: "text-orange-500" },
  { emoji: "😐", label: "Neutral", value: 3, color: "text-yellow-500" },
  { emoji: "😊", label: "Happy", value: 4, color: "text-green-500" },
  { emoji: "😄", label: "Very Happy", value: 5, color: "text-emerald-500" },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const { currentStreak, totalCheckIns, isSubmitting, submitMoodEntry } = useMoodTracker();

  const handleMoodSelection = async (moodValue: number) => {
    setSelectedMood(moodValue);
    const selectedMoodData = moods.find(mood => mood.value === moodValue);
    
    if (selectedMoodData) {
      await submitMoodEntry(moodValue, selectedMoodData.label, notes);
      setNotes("");
    }
  };

  return (
    <Card className="bg-gradient-hero border-calm shadow-soft">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-foreground mb-2">
          How are you feeling today?
        </CardTitle>
        <CardDescription className="text-center">
          Track your daily emotions and build healthy habits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Current Streak: <span className="font-bold text-primary">{currentStreak} days</span>
            {totalCheckIns > 0 && (
              <span className="ml-4">Total Check-ins: <span className="font-bold text-secondary">{totalCheckIns}</span></span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {moods.map((mood) => (
            <Button
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              className={`h-20 flex flex-col gap-2 ${mood.color}`}
              onClick={() => handleMoodSelection(mood.value)}
              disabled={isSubmitting}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Optional notes (private)</label>
          <Textarea
            placeholder="How are you feeling today? What's on your mind?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px]"
          />
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