import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsData {
  mood: {
    average: number;
    trend: 'improving' | 'declining' | 'stable';
    distribution: Record<string, number>;
    totalEntries: number;
  };
  wellness: {
    averageStress: number;
    averageSleep: number;
    averageSocial: number;
    totalAssessments: number;
  };
  insights: string[];
  checkInFrequency: number;
}

const AnalyticsDashboard = () => {
  const { user, sessionId } = useSupabase();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [user, sessionId, timeframe]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('wellness-analytics', {
        body: {
          timeframe,
          userId: user?.id || null,
          sessionId: user ? null : sessionId
        }
      });

      if (error) throw error;
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Loading your wellness insights...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>No data available yet. Start tracking to see your insights!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Wellness Analytics</CardTitle>
          <CardDescription>Track your mental health journey over time</CardDescription>
          
          <div className="flex gap-2 mt-4">
            {[
              { value: '7d', label: '7 Days' },
              { value: '30d', label: '30 Days' },
              { value: '3m', label: '3 Months' }
            ].map((option) => (
              <Button
                key={option.value}
                variant={timeframe === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mood">Mood Tracking</TabsTrigger>
          <TabsTrigger value="wellness">Wellness Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
                <span className="text-2xl">😊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.mood.average}/5</div>
                <div className={`text-xs ${getMoodTrendColor(analytics.mood.trend)} flex items-center gap-1`}>
                  <span>{getMoodTrendIcon(analytics.mood.trend)}</span>
                  {analytics.mood.trend}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Check-in Frequency</CardTitle>
                <span className="text-2xl">📅</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.checkInFrequency}%</div>
                <Progress value={analytics.checkInFrequency} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stress Level</CardTitle>
                <span className="text-2xl">😰</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.wellness.averageStress}/10</div>
                <Progress value={(analytics.wellness.averageStress / 10) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sleep Quality</CardTitle>
                <span className="text-2xl">😴</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.wellness.averageSleep}/5</div>
                <Progress value={(analytics.wellness.averageSleep / 5) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.insights.length > 0 ? (
                <ul className="space-y-2">
                  {analytics.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">💡</span>
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Keep tracking to generate personalized insights!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
              <CardDescription>How often you experience different moods</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={Object.entries(analytics.mood.distribution).map(([mood, count]) => ({
                  mood: `Level ${mood}`,
                  count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mood" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellness" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Metrics</CardTitle>
                <CardDescription>Average scores across different areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Stress Level</span>
                    <span>{analytics.wellness.averageStress}/10</span>
                  </div>
                  <Progress value={(analytics.wellness.averageStress / 10) * 100} className="mt-1" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Sleep Quality</span>
                    <span>{analytics.wellness.averageSleep}/5</span>
                  </div>
                  <Progress value={(analytics.wellness.averageSleep / 5) * 100} className="mt-1" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Social Connection</span>
                    <span>{analytics.wellness.averageSocial}/5</span>
                  </div>
                  <Progress value={(analytics.wellness.averageSocial / 5) * 100} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment Summary</CardTitle>
                <CardDescription>Your wellness tracking activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {analytics.wellness.totalAssessments}
                  </div>
                  <p className="text-sm text-muted-foreground">Total assessments completed</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {analytics.mood.totalEntries}
                  </div>
                  <p className="text-sm text-muted-foreground">Mood entries recorded</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;