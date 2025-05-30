# Functionality Specification

This document provides detailed specifications for all features and user workflows in the Star Technology Translations Hub.

## 1. Authentication & User Management System

### Discord Integration

- **OAuth2 Integration**: Users authenticate via Discord OAuth2 with guild permissions
- **Guild Membership Verification**: Automatic verification of Discord server membership and duration
- **Role-based Access Control**: Three distinct user levels based on membership and configuration:
  - **Guests**: Unauthenticated users with read-only access to translations
  - **Contributors**: Guild members with 1+ month membership who can edit and verify translations
  - **Admins**: Users configured in environment variables with full management access

### Automatic Role Assignment Process

- **Guest Access**: Default role for non-authenticated users

  - Access: View page only (public translation browser)
  - No authentication required

- **Contributor Verification**: Automatic role assignment based on guild membership

  - Requirements: Discord authentication + verified 1+ month guild membership
  - Access: View, Edit, and Verify pages
  - Automatic role assignment upon successful authentication

- **Admin Configuration**: Environment-based admin designation
  - Configuration: Discord User IDs listed in `VITE_ADMIN_USER_IDS`
  - Access: All pages including user Management
  - Immediate admin role assignment regardless of guild membership duration

### User Management Features

- **Real-time Role Verification**: Continuous verification of guild membership status
- **Admin Controls**: Ability to revoke contributor roles and manage user access
- **Session Persistence**: Role information maintained across browser sessions
- **Access Control**: Automatic page redirects based on user permissions

## 2. Translation Data Structure

### Translation Organization

- **Language Support**: Multi-language system with expandable language options
- **Category System**: Hierarchical organization (Items, Blocks, Machines, Quests, Custom Categories)
- **Translation Keys**: Unique identifiers for each translatable string
- **Status Tracking**: Each translation entry maintains:
  - Completion status (Complete/Incomplete)
  - Verification status (Verified/Unverified/Pending)
  - Contributors list
  - Last modified timestamp
  - Version history

### Data Model

```javascript
Translation {
  key: string
  category: string
  baseText: string (English)
  languages: {
    [languageCode]: {
      text: string
      status: 'complete' | 'incomplete'
      verified: boolean
      contributors: string[]
      lastModified: timestamp
      verificationHistory: VerificationEntry[]
    }
  }
}
```

## 3. Translation Viewing Interface

### Main Translation Browser

- **Tabular Display**: Clean table layout with sortable columns:
  - Translation Key
  - English Text
  - Selected Language Translation
  - Completion Status
  - Verification Status
- **Dynamic Filtering**:
  - Real-time search across translation keys and content
  - Category selection dropdown
  - Language switching without page reload
  - Status filters (complete/incomplete, verified/unverified)
- **Pagination**: Efficient loading for large translation sets
- **Export Options**: Individual translation download capabilities

### Advanced Search Features

- **Multi-criteria Search**: Search by key, content, contributor, or status
- **Regular Expression Support**: Advanced pattern matching
- **Saved Filters**: Users can save frequently used filter combinations

## 4. Translation Editing System

### Editing Interface

- **Side-by-side Layout**: Reference language and target language displayed simultaneously
- **Smart Input Fields**:
  - Auto-save functionality every 30 seconds
  - Character count and length validation
  - Placeholder text from existing translations
- **Real-time Preview**: Live rendering of Minecraft text formatting
- **Progress Tracking**: Visual indicators for completion status

### Minecraft Formatting Support

- **Formatting Toolbar**: Visual buttons for common formatting codes:
  - `§l` - Bold text
  - `§o` - Italic text
  - `§n` - Underlined text
  - `§m` - Strikethrough text
  - Color codes (`§0-§f`)
  - `§r` - Reset formatting
- **Live Preview**: Real-time rendering showing exact in-game appearance
- **Format Validation**: Prevents invalid formatting combinations

### Submission Workflow

- **Draft System**: Automatic local storage of work in progress
- **Submission Review**: Comprehensive preview showing all changes before submission
- **Batch Operations**: Submit multiple translations simultaneously
- **Conflict Resolution**: Handle simultaneous edits by multiple users

## 5. Verification System

### Translation Verification Interface

- **Verification Queue**: Displays unverified translations sorted by priority
- **Individual Review**: Granular approval/rejection of specific translation entries
- **Suggestion System**:
  - Annotate specific issues
  - Suggest alternative translations
  - Provide context-specific feedback
- **Bulk Operations**: Verify multiple related translations efficiently

### Quality Control Features

- **Version Comparison**: Visual diff between translation versions
- **Consistency Checking**: Flag potential inconsistencies across related translations
- **Context Validation**: Ensure translations fit within character limits and context

## 6. Administrative Features

### User Management

- **Verification Dashboard**: Process user verification requests
- **Permission Management**: Assign/revoke contributor status
- **Activity Monitoring**: Track user contributions and system usage
- **Audit Logs**: Comprehensive logging of all administrative actions

### Translation Management

- **Key Management**: Add, modify, or remove translation keys
- **Category Administration**: Create and organize translation categories
- **Version Control**:
  - Mark translations as verified (immutable versions)
  - Merge approved edits into verified translations
  - Rollback capabilities for problematic changes

### Export System

- **Format Support**: Multiple export formats for Minecraft modpacks
  - JSON format for Forge/Fabric mods
  - Lang files for Minecraft resource packs
  - Custom formats as needed
- **Selective Export**: Export specific languages, categories, or verification states
- **Automated Packaging**: Generate complete translation packages

## 7. Home Dashboard

### Translation Overview

- **Statistics Dashboard**:
  - Total translation count per language
  - Completion percentages with visual progress bars
  - Recent activity timeline
  - Top contributors leaderboard
- **Quick Access**: Recent translations, bookmarked entries, assigned tasks
- **Notifications**: System announcements, verification status updates

### Progress Visualization

- **Language Matrices**: Grid showing completion status across all languages and categories
- **Trend Charts**: Historical progress tracking
- **Milestone Tracking**: Progress toward completion goals

## 8. Local Storage & Offline Capabilities

### Draft Management

- **Automatic Persistence**: Save translation progress locally every 30 seconds
- **Cross-session Continuity**: Restore work when users return
- **Conflict Resolution**: Handle conflicts between local drafts and server updates
- **Backup System**: Prevent data loss during network interruptions
