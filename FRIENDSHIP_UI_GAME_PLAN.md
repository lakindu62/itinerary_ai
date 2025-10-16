# Friendship UI Components - Implementation Game Plan

## Overview

This document outlines the implementation plan for friendship UI components (Todos 17-20). All components will follow the existing design patterns, using Shadcn UI components and SpotlightWrapper effects.

---

## Design Patterns Analysis

### Current Project Patterns

#### 1. **Component Organization**

- Feature-based structure: `frontend/src/features/social/components/`
- Subfolders for related components: `posts/`, `comments/`
- Standalone components at root level: `Navbar.tsx`, `Sidebar.tsx`, etc.

#### 2. **Styling Approach**

- **Shadcn UI Components**: Card, Button, Badge, Avatar, Separator, Skeleton, Input, etc.
- **SpotlightWrapper**: Interactive hover effect with customizable spotlight color
  - Used on: PostCard, Sidebar
  - Props: `enableVerticalFade`, `className`, `spotlightColor`
  - Standard usage: `<SpotlightWrapper enableVerticalFade={false} className="mb-4 rounded-xl">`

#### 3. **Component Structure (from PostCard example)**

```tsx
<SpotlightWrapper enableVerticalFade={false} className="mb-4 rounded-xl">
  <Card>
    <CardContent className="p-4">{/* Component content */}</CardContent>
  </Card>
</SpotlightWrapper>
```

#### 4. **State Management**

- RTK Query hooks for data fetching
- Custom hooks for complex interactions (see `usePostInteractions`, `usePostEdit`)
- Clerk authentication with `useAuth()` hook

#### 5. **Layout Patterns**

- Grid-based responsive design: `grid grid-cols-1 lg:grid-cols-12`
- Sticky positioning: `sticky top-20`
- Consistent spacing: `gap-6`, `space-y-4`, etc.

#### 6. **Loading States**

- Skeleton components for loading states
- Conditional rendering: `if (isLoading) return <Skeleton />`

#### 7. **Button Variants** (from button.tsx)

- `default`: Primary action buttons
- `outline`: Secondary actions
- `ghost`: Subtle actions
- `destructive`: Delete/remove actions
- Sizes: `sm`, `default`, `lg`, `icon`

#### 8. **Badge Variants** (from badge.tsx)

- `default`: Primary status
- `secondary`: Secondary info
- `outline`: Less prominent status
- `destructive`: Error/warning states

---

## Component Architecture

### Folder Structure

```
frontend/src/features/social/components/
├── friends/                          # NEW FOLDER
│   ├── FriendCard.tsx               # Individual friend display
│   ├── FriendsList.tsx              # Friends list with search (Todo 17)
│   ├── FriendsListSkeleton.tsx      # Loading state
│   ├── FriendRequestCard.tsx        # Individual request display
│   ├── FriendRequestsList.tsx       # Requests list (Todo 18)
│   ├── FriendRequestsListSkeleton.tsx
│   ├── FriendRequestButton.tsx      # Reusable button (Todo 19)
│   └── index.ts                     # Barrel export
├── posts/
├── comments/
├── Navbar.tsx
├── Sidebar.tsx
└── ...
```

### Page Structure

```
frontend/src/app/
├── social/
│   ├── page.tsx                     # Main social page (existing)
│   └── friends/
│       └── page.tsx                 # Friends page with tabs (Todo 20)
```

---

## Todo 17: Friends List Component

### Component Hierarchy

```
FriendsList (Main Component)
├── Card Header (Search & Count)
│   ├── Input (Search field)
│   └── Badge (Friend count)
├── ScrollArea (Scrollable list)
│   ├── FriendsListSkeleton (Loading state)
│   └── FriendCard[] (Friend items)
│       ├── Avatar
│       ├── User Info (Name, Bio)
│       └── Button (View Profile / Remove)
└── Empty State (No friends message)
```

### File: `FriendCard.tsx`

**Purpose**: Display individual friend with avatar, name, bio, and actions

**Props**:

```typescript
interface FriendCardProps {
  friend: FriendshipWithUserInfo;
  onRemove?: (friendshipId: string) => void;
  showRemoveButton?: boolean;
}
```

**Key Features**:

- SpotlightWrapper with Card
- Avatar with fallback
- User name and bio (truncated)
- Remove friend button (destructive variant, size sm)
- Responsive layout

**Styling**:

- SpotlightWrapper: `enableVerticalFade={false}`, `className="mb-2 rounded-lg"`
- Card content: `p-3`
- Flex layout: `flex items-center gap-3`

---

### File: `FriendsList.tsx`

**Purpose**: Display friends with search, count, and scrollable list

**Props**:

```typescript
interface FriendsListProps {
  userId?: string; // Optional: for viewing other users' friends
  maxHeight?: string; // Default: "calc(100vh - 200px)"
  showSearch?: boolean; // Default: true
  showCount?: boolean; // Default: true
  showRemoveButton?: boolean; // Default: true
}
```

**Data Flow**:

1. Use `useGetFriendsQuery(userId)` hook
2. Use `useRemoveFriendshipMutation()` for remove action
3. Use `useGetFriendsCountQuery(userId)` for count badge
4. Local state for search filter

**Key Features**:

- Search input at top
- Friend count badge
- Scrollable area with custom max-height
- Empty state when no friends
- Loading skeleton
- Remove confirmation dialog

**Layout**:

```tsx
<SpotlightWrapper enableVerticalFade={false} className="rounded-xl">
  <Card>
    <CardContent className="p-4">
      {/* Header: Search + Count */}
      <div className="flex items-center justify-between mb-4">
        <Input placeholder="Search friends..." />
        <Badge variant="secondary">{count} Friends</Badge>
      </div>

      {/* Scrollable List */}
      <ScrollArea className="h-[calc(100vh-200px)]">
        {isLoading && <FriendsListSkeleton />}
        {friends.map(friend => <FriendCard key={...} />)}
        {friends.length === 0 && <EmptyState />}
      </ScrollArea>
    </CardContent>
  </Card>
</SpotlightWrapper>
```

---

### File: `FriendsListSkeleton.tsx`

**Purpose**: Loading state skeleton

**Structure**:

- 5 skeleton cards with avatar + text
- Match FriendCard dimensions

---

## Todo 18: Friend Request List Component

### Component Hierarchy

```
FriendRequestsList (Main Component)
├── Card Header (Title & Count)
│   └── Badge (Pending count)
├── ScrollArea (Scrollable list)
│   ├── FriendRequestsListSkeleton (Loading)
│   └── FriendRequestCard[] (Request items)
│       ├── Avatar
│       ├── User Info
│       └── Action Buttons (Accept, Reject)
└── Empty State
```

### File: `FriendRequestCard.tsx`

**Purpose**: Display individual friend request with accept/reject actions

**Props**:

```typescript
interface FriendRequestCardProps {
  request: FriendshipWithUserInfo;
  onAccept: (friendshipId: string) => void;
  onReject: (friendshipId: string) => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}
```

**Key Features**:

- SpotlightWrapper with Card
- Avatar with fallback
- User name and bio
- Accept button (variant: default, size: sm)
- Reject button (variant: outline, size: sm)
- Loading states on buttons

**Layout**:

```tsx
<SpotlightWrapper enableVerticalFade={false} className="mb-2 rounded-lg">
  <Card>
    <CardContent className="p-3">
      <div className="flex items-center gap-3">
        <Avatar />
        <div className="flex-1">
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground truncate">{bio}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={onAccept} disabled={isAccepting}>
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onReject}
            disabled={isRejecting}
          >
            Reject
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</SpotlightWrapper>
```

---

### File: `FriendRequestsList.tsx`

**Purpose**: Display pending received requests with accept/reject actions

**Props**:

```typescript
interface FriendRequestsListProps {
  maxHeight?: string;
  showCount?: boolean;
}
```

**Data Flow**:

1. Use `useGetPendingReceivedRequestsQuery()` hook
2. Use `useAcceptFriendRequestMutation()` hook
3. Use `useRejectFriendRequestMutation()` hook
4. Use `useGetPendingRequestsCountQuery()` for badge
5. Local state for tracking which request is being processed

**Key Features**:

- Pending count badge
- Scrollable area
- Accept/reject actions with loading states
- Empty state
- Automatic refresh after action (via RTK Query cache invalidation)

---

### File: `FriendRequestsListSkeleton.tsx`

**Purpose**: Loading state skeleton

---

## Todo 19: Friend Request Button Component

### File: `FriendRequestButton.tsx`

**Purpose**: Reusable button that adapts based on friendship status

**Props**:

```typescript
interface FriendRequestButtonProps {
  userId: string; // Target user ID
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  showIcon?: boolean;
}
```

**Data Flow**:

1. Use `useGetFriendshipStatusQuery(userId)` to get current status
2. Use `useSendFriendRequestMutation()` for sending request
3. Use `useRemoveFriendshipMutation()` for removing friend/canceling request
4. Use `useAcceptFriendRequestMutation()` for accepting request

**States & Behavior**:

| Friendship Status    | Button Text      | Button Action  | Button Variant | Icon      |
| -------------------- | ---------------- | -------------- | -------------- | --------- |
| No friendship        | "Add Friend"     | Send request   | default        | UserPlus  |
| Pending (sent by me) | "Request Sent"   | Cancel request | outline        | Clock     |
| Pending (sent to me) | "Accept Request" | Accept request | default        | UserCheck |
| Accepted             | "Friends"        | Remove friend  | secondary      | UserCheck |

**Special Features**:

- Loading states during mutations
- Disabled state while processing
- Icon support (optional)
- Confirmation dialog for remove friend
- Optimistic UI updates via RTK Query

**Layout**:

```tsx
<Button
  variant={getVariant(status)}
  size={size}
  onClick={handleAction}
  disabled={isLoading}
  className={className}
>
  {showIcon && <Icon />}
  {getButtonText(status)}
</Button>
```

**Helper Functions**:

```typescript
const getVariant = (status: FriendshipStatus | null) => {
  if (!status) return "default";
  if (status.status === "ACCEPTED") return "secondary";
  if (status.isSentByMe) return "outline";
  return "default";
};

const getButtonText = (status: FriendshipStatus | null) => {
  if (!status) return "Add Friend";
  if (status.status === "ACCEPTED") return "Friends";
  if (status.isSentByMe) return "Request Sent";
  return "Accept Request";
};

const handleAction = async () => {
  if (!status) {
    await sendFriendRequest({ receiverId: userId });
  } else if (status.status === "ACCEPTED") {
    // Show confirmation dialog, then remove
    await removeFriendship({ friendshipId: status.friendshipId });
  } else if (status.isSentByMe) {
    // Cancel sent request
    await removeFriendship({ friendshipId: status.friendshipId });
  } else {
    // Accept received request
    await acceptFriendRequest({
      friendshipId: status.friendshipId,
      action: "accept",
    });
  }
};
```

---

## Todo 20: Friends Page with Tabs

### File: `frontend/src/app/social/friends/page.tsx`

**Purpose**: Dedicated friends page with tabbed interface

**Layout**:

```tsx
<div className="container max-w-7xl mx-auto py-6">
  <SpotlightWrapper enableVerticalFade={false} className="rounded-xl">
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="friends">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">
              Friends
              <Badge variant="secondary" className="ml-2">
                {friendsCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="received">
              Requests Received
              <Badge variant="secondary" className="ml-2">
                {receivedCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="sent">
              Requests Sent
              <Badge variant="secondary" className="ml-2">
                {sentCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            <FriendsList showSearch={true} showCount={false} />
          </TabsContent>

          <TabsContent value="received">
            <FriendRequestsList />
          </TabsContent>

          <TabsContent value="sent">
            <SentRequestsList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </SpotlightWrapper>
</div>
```

**Additional Component Needed**: `SentRequestsList.tsx`

- Similar to FriendRequestsList
- Uses `useGetPendingSentRequestsQuery()`
- Shows "Cancel Request" button instead of Accept/Reject
- Uses `useRemoveFriendshipMutation()` for canceling

**Data Flow**:

1. Use `useGetFriendsCountQuery()` for friends tab badge
2. Use `useGetPendingRequestsCountQuery()` for both request tabs
3. Each tab renders its respective list component

---

## Integration with Existing UI

### Update: `frontend/src/app/social/page.tsx`

Replace placeholder in right sidebar:

**Before**:

```tsx
<div className="hidden lg:block lg:col-span-4 sticky top-20">
  Friend List goes here
</div>
```

**After**:

```tsx
<div className="hidden lg:block lg:col-span-4 sticky top-20">
  <FriendsList
    maxHeight="calc(100vh - 120px)"
    showSearch={true}
    showCount={true}
    showRemoveButton={false}
  />

  <div className="mt-6">
    <FriendRequestsList maxHeight="400px" showCount={true} />
  </div>
</div>
```

### Update: `frontend/src/features/social/components/Sidebar.tsx`

Replace hardcoded friend count:

**Before** (line 71-74):

```tsx
<div>
  <p className="font-medium">0</p>
  <p className="text-xs text-muted-foreground">Friends</p>
</div>
```

**After**:

```tsx
<div>
  <p className="font-medium">{friendsCount || 0}</p>
  <p className="text-xs text-muted-foreground">Friends</p>
</div>
```

Add at component top:

```tsx
const { data: friendsCountData } = useGetFriendsCountQuery();
const friendsCount = friendsCountData?.count;
```

### Navigation Updates

Add friends page link to Navbar:

```tsx
<Link href="/social/friends">
  <Button variant="ghost" size="sm">
    Friends
    {pendingCount > 0 && (
      <Badge variant="destructive" className="ml-2">
        {pendingCount}
      </Badge>
    )}
  </Button>
</Link>
```

---

## Implementation Order

### Phase 1: Core Components (Todo 17)

1. ✅ Create `friends/` folder structure
2. ✅ Implement `FriendCard.tsx` (simple, no dependencies)
3. ✅ Implement `FriendsListSkeleton.tsx`
4. ✅ Implement `FriendsList.tsx` (uses FriendCard + hooks)
5. ✅ Test FriendsList standalone
6. ✅ Create barrel export `friends/index.ts`

### Phase 2: Request Components (Todo 18)

1. ✅ Implement `FriendRequestCard.tsx`
2. ✅ Implement `FriendRequestsListSkeleton.tsx`
3. ✅ Implement `FriendRequestsList.tsx`
4. ✅ Test FriendRequestsList standalone
5. ✅ Update barrel export

### Phase 3: Reusable Button (Todo 19)

1. ✅ Implement `FriendRequestButton.tsx`
2. ✅ Add confirmation dialog for remove friend
3. ✅ Test all status states
4. ✅ Update barrel export

### Phase 4: Friends Page (Todo 20)

1. ✅ Create `SentRequestsList.tsx` component
2. ✅ Implement `app/social/friends/page.tsx`
3. ✅ Test tab navigation and data loading
4. ✅ Add responsive styles

### Phase 5: Integration

1. ✅ Update `app/social/page.tsx` sidebar
2. ✅ Update `Sidebar.tsx` friend count
3. ✅ Add navigation links to Navbar
4. ✅ End-to-end testing

---

## Styling Guidelines

### Color Scheme

- Primary: Teal/Cyan (from SpotlightWrapper default: `rgba(12, 185, 193, 0.25)`)
- Backgrounds: Use Card component (respects dark/light mode)
- Text: Use semantic classes (`text-muted-foreground`, `text-foreground`)

### Spacing

- Card padding: `p-4` for main content, `p-3` for compact items
- Component gaps: `gap-3` for tight layouts, `gap-6` for sections
- Margins: `mb-4` between cards, `mb-6` between sections

### Typography

- Headers: `font-semibold` for names
- Body: `text-sm` for secondary info
- Truncation: `truncate` for long text in cards

### Responsive Breakpoints

- Mobile first: Default single column
- Large screens: `lg:grid-cols-...` for multi-column layouts
- Hide on mobile: `hidden lg:block` for sidebars

### Accessibility

- All buttons have clear labels
- Avatar fallbacks for missing images
- Loading states with Skeleton
- Focus states from Shadcn components

---

## Testing Checklist

### Unit Testing (Per Component)

- [ ] FriendCard renders correctly
- [ ] FriendsList handles empty state
- [ ] FriendRequestCard accept/reject actions work
- [ ] FriendRequestButton shows correct state for each friendship status
- [ ] Loading skeletons display properly

### Integration Testing

- [ ] Friends page tabs switch correctly
- [ ] RTK Query cache invalidation works (accept request → updates friends list)
- [ ] Search filter works in FriendsList
- [ ] Remove friend confirmation dialog appears
- [ ] Sidebar friend count updates after adding/removing friends

### User Flow Testing

1. **Send Friend Request**

   - Click "Add Friend" button
   - Button changes to "Request Sent"
   - Request appears in target user's "Requests Received" tab
   - Request appears in sender's "Requests Sent" tab

2. **Accept Friend Request**

   - Request appears in "Requests Received"
   - Click "Accept"
   - Request disappears from both received/sent tabs
   - Both users appear in each other's "Friends" tab
   - Friend count increments

3. **Reject Friend Request**

   - Request appears in "Requests Received"
   - Click "Reject"
   - Request disappears
   - Sender can send new request (backend allows re-sending after rejection)

4. **Remove Friend**

   - Friend appears in "Friends" tab
   - Click "Remove" button
   - Confirmation dialog appears
   - After confirmation, friend is removed
   - Friend count decrements
   - Can send new friend request

5. **Cancel Sent Request**
   - Request appears in "Requests Sent"
   - Click "Cancel Request"
   - Request disappears
   - Receiver's "Requests Received" updates

---

## API Hooks Usage Reference

### Mutations

```typescript
// Send friend request
const [sendFriendRequest, { isLoading: isSending }] =
  useSendFriendRequestMutation();
await sendFriendRequest({ receiverId: userId }).unwrap();

// Accept friend request
const [acceptRequest, { isLoading: isAccepting }] =
  useAcceptFriendRequestMutation();
await acceptRequest({ friendshipId, action: "accept" }).unwrap();

// Reject friend request
const [rejectRequest, { isLoading: isRejecting }] =
  useRejectFriendRequestMutation();
await rejectRequest({ friendshipId, action: "reject" }).unwrap();

// Remove friendship (friend or pending request)
const [removeFriendship, { isLoading: isRemoving }] =
  useRemoveFriendshipMutation();
await removeFriendship({ friendshipId }).unwrap();
```

### Queries

```typescript
// Get friends list
const { data: friends = [], isLoading } = useGetFriendsQuery(userId);

// Get pending received requests
const { data: receivedRequests = [], isLoading } =
  useGetPendingReceivedRequestsQuery();

// Get pending sent requests
const { data: sentRequests = [], isLoading } = useGetPendingSentRequestsQuery();

// Get friendship status with specific user
const { data: status, isLoading } = useGetFriendshipStatusQuery(userId);

// Get friends count
const { data: friendsCountData } = useGetFriendsCountQuery(userId);
const count = friendsCountData?.count || 0;

// Get pending requests count
const { data: requestsCountData } = useGetPendingRequestsCountQuery();
const count = requestsCountData?.count || 0;
```

---

## Files to Create Summary

### New Files (Total: 14)

1. `frontend/src/features/social/components/friends/FriendCard.tsx`
2. `frontend/src/features/social/components/friends/FriendsList.tsx`
3. `frontend/src/features/social/components/friends/FriendsListSkeleton.tsx`
4. `frontend/src/features/social/components/friends/FriendRequestCard.tsx`
5. `frontend/src/features/social/components/friends/FriendRequestsList.tsx`
6. `frontend/src/features/social/components/friends/FriendRequestsListSkeleton.tsx`
7. `frontend/src/features/social/components/friends/FriendRequestButton.tsx`
8. `frontend/src/features/social/components/friends/SentRequestsList.tsx`
9. `frontend/src/features/social/components/friends/SentRequestsListSkeleton.tsx`
10. `frontend/src/features/social/components/friends/index.ts`
11. `frontend/src/app/social/friends/page.tsx`

### Files to Modify (Total: 3)

1. `frontend/src/app/social/page.tsx` (Replace right sidebar placeholder)
2. `frontend/src/features/social/components/Sidebar.tsx` (Update friend count)
3. `frontend/src/features/social/components/Navbar.tsx` (Add friends link with pending badge)

---

## Next Steps

1. **Review this game plan** with team/stakeholder
2. **Start Phase 1** - Create FriendCard and FriendsList
3. **Test incrementally** - Don't wait until all components are done
4. **Update Navbar** early to enable navigation during development
5. **Gather feedback** after Phase 1-2 before proceeding to Button and Page
6. **Final integration** after all components work standalone

---

## Notes

- All components use existing RTK Query hooks (already created in Todo 16)
- SpotlightWrapper provides consistent interactive effects
- Shadcn UI ensures accessibility and theme compatibility
- Grid layout matches existing social page structure
- Loading skeletons improve perceived performance
- Confirmation dialogs prevent accidental friend removal
- Empty states guide users when lists are empty

**Estimated Development Time**: 8-12 hours for all 4 todos

**Dependencies**:

- ✅ Backend API (tested with Postman)
- ✅ Frontend API hooks (RTK Query slice complete)
- ✅ Shadcn UI components (already installed)
- ✅ SpotlightWrapper (already implemented)

**Ready to Start**: YES ✅
