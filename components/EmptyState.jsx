'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, MessageSquare } from 'lucide-react';

export function EmptyState({ type = 'posts' }) {
  const configs = {
    posts: {
      icon: FileText,
      title: 'No posts yet',
      description: 'Be the first to share something amazing!',
    },
    profile: {
      icon: Users,
      title: 'Complete your profile',
      description: 'Add more information to make your profile stand out.',
    },
    comments: {
      icon: MessageSquare,
      title: 'No comments yet',
      description: 'Start the conversation!',
    },
  };

  const config = configs[type] || configs.posts;
  const Icon = config.icon;

  return (
    <Card className="shadow-lg border-2">
      <CardContent className="py-16 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <Icon className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{config.title}</h3>
            <p className="text-muted-foreground">{config.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
