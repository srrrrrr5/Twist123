'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Trash2, CheckCircle2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function PostCard({ post, currentUserId, onDelete }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    toast.success(isLiked ? 'Unliked post' : 'Liked post!');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete post');

      toast.success('Post deleted successfully');
      if (onDelete) onDelete(post.id);
    } catch (error) {
      toast.error('Failed to delete post');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwnPost = currentUserId === post.author_id;

  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300 hover:border-indigo-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-indigo-100">
              <AvatarImage src={post.author?.avatar_url} alt={post.author?.username} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                {post.author?.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-base hover:underline cursor-pointer">
                  {post.author?.display_name || post.author?.username}
                </span>
                {post.author?.is_verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                )}
                {!post.is_public && (
                  <Badge variant="secondary" className="text-xs">Private</Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">@{post.author?.username}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{formatDate(post.created_at)}</span>
            {isOwnPost && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete post'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base whitespace-pre-wrap leading-relaxed">{post.content}</p>
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {post.media_urls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Post media ${idx + 1}`}
                className="rounded-lg object-cover w-full h-48"
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`transition-all ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          {likeCount > 0 ? likeCount : 'Like'}
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
  );
}
