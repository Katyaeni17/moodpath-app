import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MoodTracker from '@/components/MoodTracker';
import WellnessAssessment from '@/components/WellnessAssessment';
import WellnessResources from '@/components/WellnessResources';
import { Heart, Shield, Users, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/wellness-hero.jpg';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'mood' | 'assessment' | 'resources'>('mood');

  const features = [
    {
      icon: Heart,
      title: "Anonymous & Safe",
      description: "Your privacy is protected. Check in without judgment or data tracking."
    },
    {
      icon: Shield,
      title: "Evidence-Based",
      description: "Tools backed by mental health research and therapeutic practices."
    },
    {
      icon: Users,
      title: "Supportive Community",
      description: "Connect with peers who understand your journey to wellness."
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your wellness journey with insights and streak tracking."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-wellness rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-primary">MindWell</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" size="sm">About</Button>
              <Button variant="ghost" size="sm">Resources</Button>
              <Button variant="ghost" size="sm">Support</Button>
              <Button size="sm" className="bg-gradient-wellness">Get Help</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Your Mental Health
                  <span className="block text-primary">Matters</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  A safe, anonymous space for students to check in with their mental wellness. 
                  Track your mood, access resources, and build healthy habits.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="bg-gradient-wellness shadow-wellness">
                  Start Your Check-in
                </Button>
                <Button size="lg" variant="secondary">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>Student Focused</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Mental wellness and self-care illustration"
                className="rounded-2xl shadow-wellness w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose MindWell?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for students, our platform combines evidence-based wellness tools 
              with the privacy and accessibility you need.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card shadow-soft hover:shadow-wellness transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-wellness rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Wellness Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Start Your Wellness Journey
            </h2>
            <p className="text-muted-foreground">
              Choose how you'd like to check in with yourself today
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-muted p-1 rounded-lg flex space-x-1">
              <Button
                onClick={() => setActiveTab('mood')}
                variant={activeTab === 'mood' ? 'default' : 'ghost'}
                size="sm"
                className={activeTab === 'mood' ? 'bg-gradient-wellness' : ''}
              >
                Mood Check
              </Button>
              <Button
                onClick={() => setActiveTab('assessment')}
                variant={activeTab === 'assessment' ? 'default' : 'ghost'}
                size="sm"
                className={activeTab === 'assessment' ? 'bg-gradient-wellness' : ''}
              >
                Quick Assessment
              </Button>
              <Button
                onClick={() => setActiveTab('resources')}
                variant={activeTab === 'resources' ? 'default' : 'ghost'}
                size="sm"
                className={activeTab === 'resources' ? 'bg-gradient-wellness' : ''}
              >
                Resources
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'mood' && <MoodTracker />}
            {activeTab === 'assessment' && (
              <div className="max-w-2xl mx-auto">
                <WellnessAssessment />
              </div>
            )}
            {activeTab === 'resources' && <WellnessResources />}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-wellness rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-primary">MindWell</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Supporting student mental health with anonymous, accessible wellness tools.
              </p>
              <p className="text-sm text-muted-foreground">
                Remember: This platform is for wellness support, not crisis intervention. 
                If you're in crisis, please contact emergency services or a crisis hotline.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Crisis Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">National Suicide Prevention</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Crisis Text Line</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Campus Counseling</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Emergency Services</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MindWell. Made with ❤️ for student wellbeing.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;