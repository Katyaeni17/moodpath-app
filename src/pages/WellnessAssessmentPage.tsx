import WellnessAssessment from "@/components/WellnessAssessment";

const WellnessAssessmentPage = () => {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Quick Wellness Check</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get personalized insights about your mental health and well-being.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <WellnessAssessment />
      </div>
    </section>
  );
};

export default WellnessAssessmentPage;