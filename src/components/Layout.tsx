import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, User, LogOut, BarChart3 } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import { useSupabase } from "@/hooks/useSupabase";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading, signOut } = useSupabase();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => location.pathname === path;

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
            <Link className="mr-6 flex items-center space-x-2" to="/">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">MindWell</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/">Mood Tracker</Link>
            </Button>
            <Button
              variant={isActive('/assessment') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/assessment">Wellness Check</Link>
            </Button>
            <Button
              variant={isActive('/analytics') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button
              variant={isActive('/resources') ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link to="/resources">Resources</Link>
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
        {children}
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

export default Layout;