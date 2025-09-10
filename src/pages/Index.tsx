import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Users, Shield, Lightbulb, Phone, BookOpen, User, LogOut, BarChart3 } from "lucide-react";
import MoodTracker from "@/components/MoodTracker";
import WellnessAssessment from "@/components/WellnessAssessment";
import WellnessResources from "@/components/WellnessResources";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import AuthModal from "@/components/AuthModal";
import { useSupabase } from "@/hooks/useSupabase";
import wellnessHero from "@/assets/wellness-hero.jpg";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSection, setActiveSection] = useState('mood');
  const { user, loading, signOut } = useSupabase();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">MindWell</span>
            </a>
          </div>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Button
              variant={activeSection === 'mood' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('mood')}
            >
              Mood Tracker
            </Button>
            <Button
              variant={activeSection === 'assessment' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('assessment')}
            >
              Wellness Check
            </Button>
            <Button
              variant={activeSection === 'analytics' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('analytics')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeSection === 'resources' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('resources')}
            >
              Resources
            </Button>
          </nav>
          <div className="flex-1" />
          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {activeSection === 'mood' && (
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
        )}

        {activeSection === 'assessment' && (
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
        )}

        {activeSection === 'analytics' && (
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
        )}

        {activeSection === 'resources' && (
          <section className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Support & Resources</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access helpful resources and support when you need it most.
              </p>
            </div>
            <WellnessResources />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-xl font-bold text-primary">MindWell</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Supporting student mental health with anonymous, accessible wellness tools.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;