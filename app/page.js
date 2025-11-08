'use client';

import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PenSquare, Home, User, CheckCircle2, Loader2, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';
import { toast as sonnerToast } from 'sonner';

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

  // Post creation form
  const [postContent, setPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);

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
      sonnerToast.error('Failed to fetch profile');
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
      sonnerToast.error('Username is required');
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
      sonnerToast.success('Profile created successfully! 🎉');
    } catch (error) {
      console.error('Error creating profile:', error);
      sonnerToast.error(error.message);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!postContent.trim()) {
      sonnerToast.error('Post content cannot be empty');
      return;
    }

    setCreatingPost(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: postContent,
          is_public: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      setPosts([data.post, ...posts]);
      setPostContent('');
      sonnerToast.success('Post created successfully! ✨');
    } catch (error) {
      console.error('Error creating post:', error);
      sonnerToast.error(error.message);
    } finally {
      setCreatingPost(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600" />
          <p className="text-muted-foreground">Loading TWIST...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Card className="w-full max-w-md mx-4 shadow-xl border-2">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">T</span>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to TWIST
            </CardTitle>
            <CardDescription className="text-base">
              A modern social media platform where connections matter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <SignInButton mode="modal">
                <Button className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" className="w-full h-12 border-2 font-semibold text-lg">
                  Create Account
                </Button>
              </SignUpButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCreateProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-lg shadow-xl border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Your Profile</CardTitle>
            <CardDescription>
              Let's set up your TWIST profile to get started
            </CardDescription>
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
              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Create Profile
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Toaster richColors position="top-center" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TWIST
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('home')}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('profile')}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Create Post Card */}
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <PenSquare className="w-5 h-5 mr-2" />
                  Create a Post
                </CardTitle>
              </CardHeader>
              <form onSubmit={handleCreatePost}>
                <CardContent>
                  <Textarea
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    disabled={creatingPost || !postContent.trim()}
                    className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {creatingPost ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Feed</h2>
              {posts.length === 0 ? (
                <Card className="shadow-lg border-2">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground text-lg">No posts yet. Be the first to share something!</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id} className="shadow-lg border-2 hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={post.author?.avatar_url} />
                            <AvatarFallback>
                              {post.author?.username?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{post.author?.display_name || post.author?.username}</span>
                              {post.author?.is_verified && (
                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">@{post.author?.username}</span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatDate(post.created_at)}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base whitespace-pre-wrap">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2 border-t">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                        <Heart className="w-4 h-4 mr-2" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Comment
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <div className="space-y-6">
            <Card className="shadow-lg border-2">
              <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-lg"></div>
              <CardHeader className="relative pt-0">
                <Avatar className="w-24 h-24 border-4 border-white -mt-12">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="text-2xl">
                    {profile.username?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="pt-4">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-2xl">{profile.display_name || profile.username}</CardTitle>
                    {profile.is_verified && (
                      <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <CardDescription className="text-base">@{profile.username}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.bio && (
                  <p className="text-base">{profile.bio}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <span>📍 {profile.location}</span>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      🌐 {profile.website_url}
                    </a>
                  )}
                  <span>📅 Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle>Your Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {posts.filter(p => p.author_id === profile.id).length} posts
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
