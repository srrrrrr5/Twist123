'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Users, MessageCircle, Image, Shield, Zap } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
              <span className="text-4xl font-bold text-white">T</span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to TWIST
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              A modern social media platform where connections matter and conversations thrive
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-2 font-semibold text-lg"
              >
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="border-2 hover:border-indigo-300 transition-colors hover:shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Connect with People</CardTitle>
              <CardDescription>
                Build meaningful connections with people who share your interests
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-300 transition-colors hover:shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Share Your Story</CardTitle>
              <CardDescription>
                Express yourself with posts, stories, and direct messages
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-pink-300 transition-colors hover:shadow-xl">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Privacy First</CardTitle>
              <CardDescription>
                Your data is secure with enterprise-grade encryption and privacy controls
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Secondary Features */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="border-2 bg-gradient-to-br from-white to-indigo-50/30">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
                <div>
                  <Image className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                  <p className="text-sm font-semibold">Media Sharing</p>
                </div>
                <div>
                  <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-semibold">Real-time Updates</p>
                </div>
                <div>
                  <Users className="w-8 h-8 mx-auto mb-2 text-pink-600" />
                  <p className="text-sm font-semibold">Communities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 TWIST. Built with Next.js, Clerk, and Supabase.</p>
        </div>
      </footer>
    </div>
  );
}
