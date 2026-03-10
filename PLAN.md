# FreelancerOS — Project Plan & Architecture Document

## 1. Executive Summary

FreelancerOS is a **demand-driven freelance marketplace** built as a React Native mobile app.
Unlike Fiverr (supply-driven) or Upwork (proposal-heavy), FreelancerOS follows the
**InDrive model**: clients post tasks, freelancers compete with offers, and work begins
instantly via chat.

**Key differentiator:** Speed. A client posts a task and receives offers in under 3 minutes.

---

## 2. Technology Stack (Updated from PRD)

The PRD suggested Next.js + Firebase. Since we're building **React Native mobile-first**,
here's the revised stack:

| Layer              | Technology                          | Rationale                                    |
|--------------------|-------------------------------------|----------------------------------------------|
| **Mobile App**     | React Native (Expo)                 | Cross-platform iOS/Android from single codebase |
| **Navigation**     | Expo Router (file-based routing)    | Clean, intuitive navigation structure        |
| **Backend**        | Firebase (Firestore + Cloud Functions) | Real-time data, serverless, scales easily  |
| **Auth**           | Firebase Auth                       | Email/password + Google + Apple sign-in      |
| **Database**       | Cloud Firestore                     | Real-time sync, perfect for chat & live offers |
| **Storage**        | Firebase Storage                    | Profile photos, portfolio uploads            |
| **Notifications**  | Expo Notifications + FCM            | Push notifications for job alerts            |
| **Chat**           | Firestore real-time listeners       | WhatsApp-style messaging with no extra infra |
| **State Mgmt**     | Zustand                             | Lightweight, minimal boilerplate             |
| **UI Framework**   | React Native Paper / Custom         | Material Design components, customizable     |

---

## 3. Improvements Over Original PRD

### 3.1 Architecture Improvements

1. **Single-role accounts (V1)** — Users pick either Client or Freelancer at registration.
   Dual-role accounts planned for a future release.

2. **Category subscription system** — Freelancers don't just pick categories; they set
   preferences with budget ranges and notification frequency to avoid alert fatigue.

3. **Smart offer sorting** — Client doesn't just see offers by price. We sort by:
   - Price match to budget
   - Freelancer rating (when available)
   - Response speed
   - Profile completeness

### 3.2 UX Improvements

1. **Guided task posting** — Instead of a blank form, we use a step-by-step wizard with
   category-specific prompts (e.g., "What style?" for design tasks).

2. **Quick actions on job cards** — Swipe gestures: swipe right to accept, swipe left to
   skip, tap to counter-offer or ask a question.

3. **Typing indicators + read receipts** in chat — Makes it feel as responsive as WhatsApp.

4. **Status timeline** — Visual progress bar for project status instead of just text labels.

### 3.3 Business Logic Improvements

1. **Auto-expire tasks** — Tasks without offers after 48 hours get archived. Keeps the
   marketplace fresh.

2. **Offer withdrawal** — Freelancers can withdraw offers before client accepts.

3. **Mutual completion** — Both parties confirm completion to prevent disputes.

---

## 4. Phase 1 — Core Marketplace MVP (Detailed Build Plan)

### 4.1 App Structure

```
FreelancerOS/
├── app/                          # Expo Router screens
│   ├── (auth)/                   # Auth screens (login, register, onboarding)
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx             # Home / Job Feed
│   │   ├── post-task.tsx         # Post a Task (clients)
│   │   ├── projects.tsx          # My Projects
│   │   ├── messages.tsx          # Chat list
│   │   └── profile.tsx           # Profile
│   ├── task/[id].tsx             # Task detail screen
│   ├── chat/[id].tsx             # Chat screen
│   └── offers/[taskId].tsx       # Offers list for a task
├── components/                   # Reusable UI components
│   ├── TaskCard.tsx
│   ├── OfferCard.tsx
│   ├── ChatBubble.tsx
│   ├── CategoryPicker.tsx
│   ├── BudgetInput.tsx
│   └── StatusBadge.tsx
├── services/                     # Firebase service layer
│   ├── auth.ts
│   ├── tasks.ts
│   ├── offers.ts
│   ├── chat.ts
│   └── notifications.ts
├── store/                        # Zustand state management
│   ├── authStore.ts
│   ├── taskStore.ts
│   └── chatStore.ts
├── types/                        # TypeScript types
│   └── index.ts
├── constants/                    # App constants
│   ├── categories.ts
│   └── theme.ts
├── utils/                        # Utility functions
│   └── formatters.ts
└── firebase/                     # Firebase configuration
    └── config.ts
```

### 4.2 Data Models (Firestore)

```
users/
  {userId}/
    - name: string
    - email: string
    - role: "client" | "freelancer"
    - avatar: string (URL)
    - skills: string[]
    - categories: string[]        # subscribed categories
    - bio: string
    - createdAt: timestamp
    - pushToken: string

tasks/
  {taskId}/
    - clientId: string
    - title: string
    - description: string
    - category: string
    - budget: number
    - deadline: timestamp
    - status: "open" | "assigned" | "in_progress" | "completed" | "cancelled"
    - assignedTo: string | null
    - createdAt: timestamp
    - offerCount: number

offers/
  {offerId}/
    - taskId: string
    - freelancerId: string
    - price: number
    - deliveryDays: number
    - message: string
    - status: "pending" | "accepted" | "rejected" | "withdrawn"
    - createdAt: timestamp

chats/
  {chatId}/
    - participants: string[]
    - taskId: string
    - lastMessage: string
    - lastMessageAt: timestamp
    - messages/ (subcollection)
      {messageId}/
        - senderId: string
        - text: string
        - createdAt: timestamp
        - read: boolean
```

### 4.3 Screens Breakdown

| Screen          | Role       | Features                                            |
|-----------------|------------|-----------------------------------------------------|
| Login           | All        | Email/password login                                |
| Register        | All        | Sign up + role selection                            |
| Onboarding      | All        | Category selection, profile basics                  |
| Home Feed       | Freelancer | Live job cards, filter by category                  |
| Post Task       | Client     | Step-by-step task creation wizard                   |
| Task Detail     | All        | Full task info, make/view offers                    |
| Offers List     | Client     | See all offers, accept one                          |
| My Projects     | All        | Active, completed, cancelled projects               |
| Messages        | All        | Chat list with latest messages                      |
| Chat            | All        | Real-time messaging                                 |
| Profile         | All        | View/edit profile, skills, settings                 |

### 4.4 Build Order (Phase 1)

```
Step 1: Project Setup & Config
  - Initialize Expo project with TypeScript
  - Configure Firebase
  - Set up Expo Router navigation
  - Install dependencies
  - Set up theme/constants

Step 2: Authentication
  - Login screen
  - Registration screen
  - Onboarding flow (role + categories)
  - Auth state management (Zustand)
  - Protected routes

Step 3: Task System
  - Post Task wizard (client)
  - Job Feed with real-time updates (freelancer)
  - Task detail screen
  - Category filtering
  - Task status management

Step 4: Offer System
  - Make offer (accept/counter) from task detail
  - Offers list for client
  - Accept/reject offers
  - Offer notifications

Step 5: Chat System
  - Chat list screen
  - Real-time messaging
  - Chat creation on offer acceptance
  - Unread message indicators

Step 6: Project Management
  - My Projects screen
  - Status updates (in_progress → completed)
  - Mutual completion flow

Step 7: Notifications
  - Push notification setup
  - New task alerts for freelancers
  - Offer received alerts for clients
  - Message notifications
```

---

## 5. Categories (V1)

1. Web Development
2. Mobile Development
3. UI/UX Design
4. Graphic Design
5. Content Writing
6. Copywriting
7. Video Editing
8. Marketing
9. AI & Automation
10. Data Entry
11. Virtual Assistant
12. Other

---

## 6. Phase 2–5 Overview (Future)

| Phase | Focus               | Key Features                                        |
|-------|---------------------|-----------------------------------------------------|
| 2     | Trust Layer         | Ratings, escrow payments, portfolios, filters       |
| 3     | Freelancer OS       | AI proposals, client portal, invoices, contracts    |
| 4     | AI Layer            | Brief builder, smart matching, price suggestions    |
| 5     | Network Effects     | Availability toggle, instant jobs, favorites        |

---

## 7. Revenue Model

- **Transaction fee:** 10% on completed projects
- **Premium plan:** $10/month for priority alerts + featured profile
- Revenue features will be implemented in Phase 2 alongside escrow payments

---

## 8. Key Metrics to Track

| Metric                    | Target    |
|---------------------------|-----------|
| Time to first offer       | < 3 min   |
| Average offers per task   | 5–10      |
| Job completion rate       | > 70%     |
| Repeat client rate        | > 30%     |

---

## 9. Risk Mitigation

| Risk                         | Mitigation                                       |
|------------------------------|--------------------------------------------------|
| Cold start (no users)        | Seed with test data, invite freelancer communities |
| Spam tasks/offers            | Rate limiting, report system in Phase 2          |
| Payment disputes             | Escrow system in Phase 2                         |
| Notification fatigue         | Category subscriptions + frequency controls      |

---

## 10. What We Build NOW (Phase 1 Deliverables)

1. ✅ Expo React Native app with TypeScript
2. ✅ Firebase Auth (email/password)
3. ✅ User onboarding (role + category selection)
4. ✅ Task posting wizard
5. ✅ Real-time job feed
6. ✅ Offer system (accept / counter-offer)
7. ✅ Offer management for clients
8. ✅ Real-time chat (WhatsApp-style)
9. ✅ Project status tracking
10. ✅ Push notifications for key events
11. ✅ 5-tab navigation (Home, Post Task, Projects, Messages, Profile)

---

*Document created: March 10, 2026*
*Platform: FreelancerOS v0.1*
*Stack: React Native (Expo) + Firebase*
