import { Page, Locator, expect } from '@playwright/test';

// SocialPage encapsulates all locators and actions for the social feed page (/social).
// Sections covered:
//   - Navigation (Navbar)
//   - CreatePost (compose new post)
//   - PostCard  (per-post actions: like, comment, edit, delete, archive)
//   - Comments  (comment form and comment list)
//   - Friends   (friends list, friend request list)

export class SocialPage {
    readonly page: Page;

    // -- Navigation --
    // The top navbar rendered by the Navbar component
    readonly navbar: Locator;

    // -- CreatePost section --
    // Textarea where the user types post content
    readonly postTextarea: Locator;
    // Button that toggles the media file upload section
    readonly mediaButton: Locator;
    // Switch that marks the post as archived (visible only to the author)
    readonly archiveToggle: Locator;
    // Label linked to the archive switch, used as an alternative click target
    readonly archiveLabel: Locator;
    // Hint text that appears below the archive toggle when it is switched on
    readonly archiveHintText: Locator;
    // Submit button that creates the post
    readonly postButton: Locator;
    // File input revealed when the media section is open
    readonly mediaFileInput: Locator;

    // -- Post feed section --
    // Container that holds all rendered post cards
    readonly postFeed: Locator;
    // Like button on the first visible post card
    readonly firstPostLikeButton: Locator;
    // Comment toggle button on the first visible post card
    readonly firstPostCommentToggle: Locator;
    // Edit (pencil) button on the first post owned by the current user
    readonly firstPostEditButton: Locator;
    // Delete (trash) button on the first post owned by the current user
    readonly firstPostDeleteButton: Locator;
    // Archive/unarchive button in the post header for the first owned post
    readonly firstPostArchiveButton: Locator;

    // -- Comment section (appears after toggling comments on a post) --
    // Textarea inside the comment form
    readonly commentTextarea: Locator;
    // Submit button inside the comment form
    readonly commentSubmitButton: Locator;

    // -- Friends section --
    // Friends list panel rendered in the right column
    readonly friendsList: Locator;
    // Friend requests list panel rendered in the right column
    readonly friendRequestsList: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.navbar = page.locator('nav').first();

        // CreatePost — textarea scoped by its dynamic placeholder text
        this.postTextarea    = page.getByPlaceholder(/on your mind/i);
        this.mediaButton     = page.getByRole('button', { name: /media/i });
        this.archiveToggle   = page.getByRole('switch', { name: /archive/i });
        this.archiveLabel    = page.getByLabel('Archive');
        this.archiveHintText = page.getByText('Only you can see this post');
        this.postButton      = page.getByRole('button', { name: /^post$/i });
        this.mediaFileInput  = page.locator('input[type="file"]');

        // Post feed — scoped to the first card in the list
        // Like and comment buttons use aria-label added to PostActions.tsx
        // Edit and delete buttons use aria-label added to PostHeader.tsx
        this.postFeed               = page.locator('[class*="space-y-4"]').first();
        this.firstPostLikeButton    = page.getByRole('button', { name: 'Like post' }).first();
        this.firstPostCommentToggle = page.getByRole('button', { name: 'Toggle comments' }).first();
        this.firstPostEditButton    = page.getByRole('button', { name: 'Edit post' }).first();
        this.firstPostDeleteButton  = page.getByRole('button', { name: 'Delete post' }).first();
        // Archive button retains its title attribute from PostHeader.tsx
        this.firstPostArchiveButton = page.getByRole('button', { name: /archive post|unarchive post/i }).first();

        // Comment form — visible after toggling comments on a post
        this.commentTextarea     = page.getByPlaceholder('Write a comment...');
        // Comment submit button scoped inside the form to avoid collision with Toggle comments button
        this.commentSubmitButton = page.getByRole('button', { name: /^comment$/i });

        // Friends panels — located by their heading text in the right column
        // FriendsList renders a search input but no explicit heading; located by Search friends placeholder
        this.friendsList        = page.getByPlaceholder('Search friends...');
        // FriendRequestsList renders an h3 with exact text "Friend Requests"
        this.friendRequestsList = page.getByRole('heading', { name: 'Friend Requests' });
    }

    // Navigate to the social page
    async goto() {
        await this.page.goto('/social');
    }

    // Assert that the core layout elements of the social page are visible
    async expectVisible() {
        await expect(this.postTextarea).toBeVisible();
        await expect(this.mediaButton).toBeVisible();
        await expect(this.postButton).toBeVisible();
    }

    // Type content into the compose textarea
    async typePost(content: string) {
        await this.postTextarea.fill(content);
    }

    // Click the Media button to reveal the file upload section
    async openMediaUpload() {
        await this.mediaButton.click();
    }

    // Click the archive toggle switch to turn archiving on or off
    async toggleArchive() {
        await this.archiveToggle.click();
    }

    // Click the Post button to submit the composed post
    async submitPost() {
        await this.postButton.click();
    }

    // Click the comment toggle on the first post to show/hide the comment section
    async openCommentsOnFirstPost() {
        await this.firstPostCommentToggle.click();
    }

    // Type text into the comment form and submit it
    async submitComment(text: string) {
        await this.commentTextarea.fill(text);
        await this.commentSubmitButton.click();
    }

    // Click the like button on the first post
    async likeFirstPost() {
        await this.firstPostLikeButton.click();
    }
}
