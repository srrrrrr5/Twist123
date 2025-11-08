# TWIST Frontend - Component Architecture

## 🎨 Enhanced React/Tailwind CSS Frontend

The TWIST social media platform now features a **modern, component-based React architecture** with beautiful Tailwind CSS styling.

---

## 📦 Component Library

### 1. **LandingPage.jsx**
**Location:** `/app/components/LandingPage.jsx`

**Purpose:** Beautiful landing page for unauthenticated users

**Features:**
- Hero section with gradient branding
- Feature showcase cards
- Sign up / Sign in CTAs
- Responsive design
- Animated hover effects

**Usage:**
```jsx
import { LandingPage } from '@/components/LandingPage';
<LandingPage />
```

---

### 2. **Navigation.jsx**
**Location:** `/app/components/Navigation.jsx`

**Purpose:** Sticky header navigation with tab switching

**Features:**
- Responsive mobile menu (hamburger)
- Active tab highlighting
- User button integration (Clerk)
- Gradient logo
- Smooth transitions

**Props:**
```typescript
{
  activeTab: 'home' | 'profile',
  onTabChange: (tab: string) => void
}
```

**Usage:**
```jsx
<Navigation activeTab={activeTab} onTabChange={setActiveTab} />
```

---

### 3. **PostCard.jsx**
**Location:** `/app/components/PostCard.jsx`

**Purpose:** Individual post display with interactions

**Features:**
- Author avatar and verification badge
- Like/Comment/Share buttons
- Delete post (owner only)
- Relative timestamps ("2h ago")
- Media support (images/videos)
- Hover effects and animations

**Props:**
```typescript
{
  post: {
    id: string,
    content: string,
    author: {
      username: string,
      display_name: string,
      avatar_url: string,
      is_verified: boolean
    },
    created_at: string,
    media_urls?: string[],
    is_public: boolean
  },
  currentUserId: string,
  onDelete?: (postId: string) => void
}
```

**Usage:**
```jsx
<PostCard 
  post={post} 
  currentUserId={profile.id}
  onDelete={handleDelete}
/>
```

---

### 4. **CreatePostForm.jsx**
**Location:** `/app/components/CreatePostForm.jsx`

**Purpose:** Post creation form with user avatar

**Features:**
- Multi-line textarea
- Character counter
- Disabled media buttons (placeholder for future)
- Loading state during submission
- Gradient submit button
- Auto-focus and validation

**Props:**
```typescript
{
  profile: {
    username: string,
    avatar_url: string
  },
  onPostCreated?: (newPost: object) => void
}
```

**Usage:**
```jsx
<CreatePostForm 
  profile={profile}
  onPostCreated={handlePostCreated}
/>
```

---

### 5. **ProfileHeader.jsx**
**Location:** `/app/components/ProfileHeader.jsx`

**Purpose:** User profile header with cover image

**Features:**
- Gradient cover image
- Large profile avatar
- Verification badge
- Bio and profile details
- Location, website, join date
- Posts/Following/Followers stats
- Edit profile button (owner only)

**Props:**
```typescript
{
  profile: {
    username: string,
    display_name: string,
    avatar_url: string,
    cover_image_url?: string,
    bio?: string,
    location?: string,
    website_url?: string,
    created_at: string,
    is_verified: boolean,
    is_private: boolean
  },
  postsCount?: number,
  isOwnProfile?: boolean
}
```

**Usage:**
```jsx
<ProfileHeader 
  profile={profile}
  postsCount={20}
  isOwnProfile={true}
/>
```

---

### 6. **EmptyState.jsx**
**Location:** `/app/components/EmptyState.jsx`

**Purpose:** Empty state placeholder with icon

**Features:**
- Customizable for different contexts
- Icon, title, and description
- Gradient background
- Types: 'posts', 'profile', 'comments'

**Props:**
```typescript
{
  type?: 'posts' | 'profile' | 'comments'
}
```

**Usage:**
```jsx
<EmptyState type="posts" />
```

---

### 7. **LoadingSpinner.jsx**
**Location:** `/app/components/LoadingSpinner.jsx`

**Purpose:** Full-screen loading state

**Features:**
- Centered spinner
- Custom message
- Gradient background
- Smooth animation

**Props:**
```typescript
{
  message?: string
}
```

**Usage:**
```jsx
<LoadingSpinner message="Loading TWIST..." />
```

---

## 🎯 Main Application

### **app/page.js**
**Location:** `/app/app/page.js`

**Purpose:** Main application entry point

**Architecture:**
```
App
├── If not loaded → LoadingSpinner
├── If not signed in → LandingPage
├── If no profile → Create Profile Form
└── If authenticated → Main App
    ├── Navigation
    ├── Home Tab
    │   ├── CreatePostForm
    │   └── Posts Feed (PostCard[])
    └── Profile Tab
        ├── ProfileHeader
        └── User's Posts (PostCard[])
```

**State Management:**
- `isSignedIn` - Clerk auth state
- `profile` - User profile from Supabase
- `posts` - All posts array
- `activeTab` - Current tab ('home' | 'profile')
- `loading` - Loading state
- `showCreateProfile` - Profile creation flow

**Key Functions:**
- `fetchProfile()` - Get user profile
- `fetchPosts()` - Get posts feed
- `handleCreateProfile()` - Create profile
- `handlePostCreated()` - Add new post to state
- `handlePostDeleted()` - Remove post from state

---

## 🎨 Design System

### Colors
```css
Primary: Indigo-600 (#4F46E5)
Secondary: Purple-600 (#9333EA)
Accent: Pink-600 (#DB2777)
Background: Gradient from indigo-50 to purple-50
```

### Components
- **Cards:** Border-2, shadow-lg, hover:shadow-xl
- **Buttons:** Gradient backgrounds, smooth transitions
- **Avatars:** Ring borders, gradient fallbacks
- **Forms:** Focus states with border transitions

### Typography
- **Headings:** Bold, gradient text-fill
- **Body:** Base size, relaxed leading
- **Timestamps:** Muted foreground

### Spacing
- **Container:** max-w-4xl, px-4
- **Gaps:** space-y-4, space-y-6
- **Padding:** Consistent 4-8 units

---

## 🚀 Features

### ✅ Implemented
- [x] Beautiful landing page
- [x] User authentication (Clerk)
- [x] Profile creation
- [x] Create posts
- [x] View posts feed
- [x] Delete own posts
- [x] User profiles
- [x] Like posts (UI only)
- [x] Responsive design
- [x] Loading states
- [x] Empty states
- [x] Error handling

### 🔜 Coming Soon
- [ ] Comment on posts
- [ ] Follow/unfollow users
- [ ] Direct messaging
- [ ] Notifications
- [ ] Search functionality
- [ ] Media uploads
- [ ] Stories
- [ ] Edit posts
- [ ] Share posts

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 640px
  - Hamburger menu
  - Single column layout
  - Hidden text labels

- **Tablet:** 640px - 1024px
  - Two column grids
  - Visible labels
  - Compact navigation

- **Desktop:** > 1024px
  - Full navigation
  - Max-width containers
  - Multi-column layouts

---

## 🎭 Animations

### Hover Effects
- **Cards:** `hover:shadow-xl transition-all duration-300`
- **Buttons:** `hover:scale-105 transition-transform`
- **Borders:** `hover:border-indigo-200 transition-colors`

### Loading States
- **Spinner:** `animate-spin`
- **Skeleton:** `animate-pulse`
- **Fade In:** `transition-opacity`

---

## 🧩 Component Usage Examples

### Complete Post Flow
```jsx
import { PostCard } from '@/components/PostCard';
import { CreatePostForm } from '@/components/CreatePostForm';
import { EmptyState } from '@/components/EmptyState';

function Feed() {
  const [posts, setPosts] = useState([]);

  return (
    <>
      <CreatePostForm 
        profile={profile}
        onPostCreated={(post) => setPosts([post, ...posts])}
      />
      
      {posts.length === 0 ? (
        <EmptyState type="posts" />
      ) : (
        posts.map(post => (
          <PostCard 
            key={post.id}
            post={post}
            currentUserId={userId}
            onDelete={(id) => setPosts(posts.filter(p => p.id !== id))}
          />
        ))
      )}
    </>
  );
}
```

### Profile Display
```jsx
import { ProfileHeader } from '@/components/ProfileHeader';

function ProfilePage() {
  return (
    <ProfileHeader 
      profile={profile}
      postsCount={posts.filter(p => p.author_id === profile.id).length}
      isOwnProfile={true}
    />
  );
}
```

---

## 🛠️ Customization

### Adding New Components

1. Create component in `/app/components/`
2. Use consistent naming: PascalCase.jsx
3. Follow existing patterns:
   - Use shadcn/ui components
   - Tailwind for styling
   - Props interface
   - Loading states
   - Error handling

### Modifying Styles

1. **Global styles:** `/app/app/globals.css`
2. **Component styles:** Inline Tailwind classes
3. **Theme:** `/app/tailwind.config.js`

### Adding New Pages

1. Create route in `/app/app/[route]/page.js`
2. Add navigation in `Navigation.jsx`
3. Update main `app/page.js` tab logic

---

## 🐛 Debugging

### Common Issues

**Component not rendering:**
- Check import paths (`@/components/...`)
- Verify shadcn components installed
- Check console for errors

**Styles not applying:**
- Verify Tailwind classes are correct
- Check `globals.css` imports
- Restart dev server

**Props not working:**
- Verify prop names match
- Check data structure
- Use TypeScript for type safety

---

## 📚 Resources

- **shadcn/ui:** https://ui.shadcn.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Lucide Icons:** https://lucide.dev/
- **Clerk React:** https://clerk.com/docs/references/react
- **Next.js:** https://nextjs.org/docs

---

**Built with ❤️ using React, Tailwind CSS, and shadcn/ui**
