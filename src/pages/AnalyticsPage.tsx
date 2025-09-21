import AnalyticsDashboard from "@/components/AnalyticsDashboard";

const AnalyticsPage = () => {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Your Wellness Journey</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your progress and discover patterns in your mental health.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <AnalyticsDashboard />
      </div>
    </section>
  );
};

export default AnalyticsPage;