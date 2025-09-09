import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Smile, Moon, Zap, Users } from 'lucide-react';

const resources = [
  {
    icon: Heart,
    title: "Breathing Exercise",
    description: "5-minute guided breathing to reduce stress",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20"
  },
  {
    icon: Brain,
    title: "Mindfulness",
    description: "Quick meditation for mental clarity",
    color: "text-primary",
    bgColor: "bg-primary/10", 
    borderColor: "border-primary/20"
  },
  {
    icon: Smile,
    title: "Positive Affirmations",
    description: "Daily encouragement and motivation",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20"
  },
  {
    icon: Moon,
    title: "Sleep Hygiene",
    description: "Tips for better rest and recovery",
    color: "text-healing-foreground",
    bgColor: "bg-healing",
    borderColor: "border-healing"
  },
  {
    icon: Zap,
    title: "Energy Boost",
    description: "Quick exercises to increase vitality",
    color: "text-energetic-foreground",
    bgColor: "bg-energetic",
    borderColor: "border-energetic"
  },
  {
    icon: Users,
    title: "Connect & Share",
    description: "Anonymous peer support community",
    color: "text-peaceful-foreground",
    bgColor: "bg-peaceful",
    borderColor: "border-peaceful"
  }
];

const motivationalQuotes = [
  "You are stronger than you think 💪",
  "Every small step counts 🌱",
  "Your mental health matters ❤️",
  "Progress, not perfection 🌟",
  "You're not alone in this journey 🤝"
];

const WellnessResources = () => {
  const todaysQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="space-y-6">
      {/* Motivational Quote */}
      <Card className="bg-gradient-calm shadow-soft border-peaceful">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-peaceful-foreground mb-2">
            Daily Inspiration
          </h3>
          <p className="text-xl font-medium text-peaceful-foreground">
            {todaysQuote}
          </p>
        </CardContent>
      </Card>

      {/* Wellness Resources Grid */}
      <Card className="bg-card shadow-soft">
        <CardHeader>
          <CardTitle className="text-xl">Wellness Resources</CardTitle>
          <p className="text-muted-foreground">
            Explore tools and techniques to support your mental wellbeing
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${resource.bgColor} ${resource.borderColor} hover:shadow-soft transition-all duration-300 hover:scale-105 cursor-pointer group`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${resource.bgColor} border ${resource.borderColor}`}>
                      <Icon className={`w-5 h-5 ${resource.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${resource.color} mb-1 group-hover:text-primary transition-colors`}>
                        {resource.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Resources */}
      <Card className="bg-warning/10 border-warning/30 shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-warning-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-warning-foreground">Need immediate support?</h4>
              <p className="text-sm text-muted-foreground">Crisis resources available 24/7</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">
              Crisis Hotline
            </Button>
            <Button size="sm" variant="secondary">
              Campus Counseling
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellnessResources;