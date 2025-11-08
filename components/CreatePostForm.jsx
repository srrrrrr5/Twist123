'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PenSquare, Loader2, Image, Smile, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function CreatePostForm({ profile, onPostCreated }) {
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setIsCreating(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          is_public: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      setContent('');
      toast.success('Post created successfully! ✨');
      if (onPostCreated) onPostCreated(data.post);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="shadow-lg border-2 bg-gradient-to-br from-white to-indigo-50/30">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <PenSquare className="w-5 h-5 mr-2 text-indigo-600" />
          Create a Post
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex space-x-3">
            <Avatar className="w-10 h-10 ring-2 ring-indigo-100">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                {profile?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="resize-none border-2 focus:border-indigo-300 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Button type="button" variant="ghost" size="sm" className="hover:text-indigo-600" disabled>
              <Image className="w-4 h-4 mr-2" />
              Photo
            </Button>
            <Button type="button" variant="ghost" size="sm" className="hover:text-indigo-600" disabled>
              <Smile className="w-4 h-4 mr-2" />
              Emoji
            </Button>
            <Button type="button" variant="ghost" size="sm" className="hover:text-indigo-600" disabled>
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {content.length > 0 && `${content.length} characters`}
          </div>
          <Button
            type="submit"
            disabled={isCreating || !content.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {isCreating ? (
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
  );
}
