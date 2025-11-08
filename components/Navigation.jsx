'use client';

import { UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Home, User, Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navigation({ activeTab, onTabChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = () => (
    <>
      <Button
        variant={activeTab === 'home' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => {
          onTabChange('home');
          setIsOpen(false);
        }}
        className="justify-start"
      >
        <Home className="w-4 h-4 md:mr-2" />
        <span className="hidden md:inline">Home</span>
      </Button>
      <Button
        variant={activeTab === 'profile' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => {
          onTabChange('profile');
          setIsOpen(false);
        }}
        className="justify-start"
      >
        <User className="w-4 h-4 md:mr-2" />
        <span className="hidden md:inline">Profile</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="justify-start opacity-50"
      >
        <Bell className="w-4 h-4 md:mr-2" />
        <span className="hidden md:inline">Notifications</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="justify-start opacity-50"
      >
        <Search className="w-4 h-4 md:mr-2" />
        <span className="hidden md:inline">Search</span>
      </Button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-white">T</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
            TWIST
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          <NavItems />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px]">
              <div className="flex flex-col space-y-2 mt-8">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
