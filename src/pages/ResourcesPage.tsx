import WellnessResources from "@/components/WellnessResources";

const ResourcesPage = () => {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Support & Resources</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Access helpful resources and support when you need it most.
        </p>
      </div>
      <WellnessResources />
    </section>
  );
};

export default ResourcesPage;