'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Import our new components
import { LandingPage } from '@/components/LandingPage';
import { Navigation } from '@/components/Navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PostCard } from '@/components/PostCard';
import { CreatePostForm } from '@/components/CreatePostForm';
import { ProfileHeader } from '@/components/ProfileHeader';
import { EmptyState } from '@/components/EmptyState';

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Profile creation form
  const [profileForm, setProfileForm] = useState({
    username: '',
    display_name: '',
    bio: '',
  });

  useEffect(() => {
    if (isSignedIn) {
      fetchProfile();
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, [isSignedIn]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      
      if (data.profile) {
        setProfile(data.profile);
        setShowCreateProfile(false);
      } else {
        setShowCreateProfile(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts?limit=20');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    
    if (!profileForm.username) {
      toast.error('Username is required');
      return;
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create profile');
      }

      setProfile(data.profile);
      setShowCreateProfile(false);
      toast.success('Profile created successfully! 🎉');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error(error.message);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  // Loading state
  if (!isLoaded || loading) {
    return <LoadingSpinner message="Loading TWIST..." />;
  }

  // Not signed in - show landing page
  if (!isSignedIn) {
    return <LandingPage />;
  }

  // Create profile screen
  if (showCreateProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <Toaster richColors position="top-center" />
        <Card className="w-full max-w-lg shadow-xl border-2">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">T</span>
            </div>
            <CardTitle className="text-2xl font-bold">Create Your Profile</CardTitle>
            <p className="text-muted-foreground">
              Let's set up your TWIST profile to get started
            </p>
          </CardHeader>
          <form onSubmit={handleCreateProfile}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="@username"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  placeholder="Your name"
                  value={profileForm.display_name}
                  onChange={(e) => setProfileForm({ ...profileForm, display_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Create Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // Main app
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Toaster richColors position="top-center" />
      
      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Home Tab - Posts Feed */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Create Post */}
            <CreatePostForm profile={profile} onPostCreated={handlePostCreated} />

            {/* Posts Feed */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center justify-between">
                <span>Feed</span>
                <span className="text-sm text-muted-foreground font-normal">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </span>
              </h2>
              
              {posts.length === 0 ? (
                <EmptyState type="posts" />
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserId={profile?.id}
                      onDelete={handlePostDeleted}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && profile && (
          <div className="space-y-6">
            <ProfileHeader
              profile={profile}
              postsCount={posts.filter(p => p.author_id === profile.id).length}
              isOwnProfile={true}
            />

            {/* User's Posts */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Posts</h2>
              {posts.filter(p => p.author_id === profile.id).length === 0 ? (
                <EmptyState type="posts" />
              ) : (
                posts
                  .filter(p => p.author_id === profile.id)
                  .map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserId={profile?.id}
                      onDelete={handlePostDeleted}
                    />
                  ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © 2025 TWIST. Built with Next.js, Clerk, and Supabase.
          </p>
          <p className="text-xs text-muted-foreground">
            A modern social media platform where connections matter.
          </p>
        </div>
      </footer>
    </div>
  );
}
