import MoodTracker from "@/components/MoodTracker";

const MoodTrackerPage = () => {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">How are you feeling today?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Take a moment to check in with yourself. Your emotional well-being matters.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <MoodTracker />
      </div>
    </section>
  );
};

export default MoodTrackerPage;