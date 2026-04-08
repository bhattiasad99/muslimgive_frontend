# Charities Module - Comprehensive Analysis

## Overview
The charities module is a comprehensive charity management and auditing system built with Next.js. Currently, it operates entirely on **dummy/mock data** with no backend API integration. The module is designed to manage charity applications, conduct multi-area assessments, assign team members, and track the entire lifecycle of charity verification.

---

## 📁 Module Structure

### **Core Pages**
1. **`/charities`** - Main charities listing page (Kanban & Tabular views)
2. **`/create-charity`** - Charity creation form
3. **`/charities/preview`** - Preview charity before publishing
4. **`/charities/[id]`** - Single charity detail page
5. **`/charities/[id]/assessments`** - Assessment history/status page
6. **`/charities/[id]/assessments/[assessment]`** - Individual assessment page (with preview mode)
7. **`/charities/[id]/email-logs`** - Email logs (directory exists)

### **Component Hierarchy**
```
src/
├── DUMMY_CHARITIES.tsx (415 lines) - Mock charity data
├── DUMMY_AUDIT_VALS.tsx (138 lines) - Mock assessment data
├── app/(dashboard)/charities/
│   ├── page.tsx - Renders CharitiesPageComponent
│   ├── [id]/
│   │   ├── page.tsx - Renders SingleCharityPageComponent
│   │   ├── assessments/
│   │   │   ├── page.tsx - Assessment history accordion view
│   │   │   └── [assessment]/page.tsx - Individual assessment page
│   │   └── email-logs/
│   ├── create-charity/page.tsx - Charity creation form
│   └── preview/page.tsx - Preview before publishing
└── components/use-case/
    ├── CharitiesPageComponent/
    │   ├── index.tsx - Main charities page logic
    │   ├── BulkEmailModal.tsx - Bulk email functionality
    │   ├── kanban/
    │   │   ├── KanbanView.tsx - Kanban board implementation
    │   │   ├── KanbanColumn.tsx
    │   │   ├── KanbanEffect.tsx
    │   │   └── SingleCharityCard.tsx - Individual charity card
    │   └── tabular/
    │       └── TabularView.tsx - Table view with pagination
    └── SingleCharityPageComponent/
        ├── index.tsx - Single charity page logic
        ├── SingleCharityDetails.tsx - Charity info display
        └── models/
            ├── AssignProjectManager.tsx - PM assignment modal
            └── EligibilityTest.tsx - Eligibility review modal
```

---

## 🎯 Key Features

### 1. **Charity Lifecycle Management**

#### **Status Flow**
Charities progress through 6 statuses:
1. **Pending Eligibility Review** (`pending-eligibility`) - Red (#F25F5C)
2. **Unassigned** (`unassigned`) - Pink (#F25CD4)
3. **Open To Review** (`open-to-review`) - Sky Blue (#5CD9F2)
4. **Pending Admin Review** (`pending-admin-review`) - Blue (#266DD3)
5. **Approved** (`approved`) - Green (#5CF269)
6. **Ineligible** (`ineligible`) - Dark Gray (#112133)

#### **Charity Data Model** (`SingleCharityType`)
```typescript
{
  id: string
  charityTitle: string
  charityOwnerName: string
  charityDesc: string
  members: Member[]  // Team members assigned
  comments: number
  auditsCompleted: 0 | 1 | 2 | 3 | 4
  status: StatusType
  category: CategoryEnum
  country?: CountryEnum  // 'usa' | 'uk' | 'ca'
  totalDuration?: string
  website?: string
  isThisMuslimCharity?: boolean
  doTheyPayZakat?: boolean
}
```

### 2. **Team Member Roles**
- **Project Manager** (`project-manager`)
- **Finance Assessor** (`finance-assessor`)
- **Zakat Assessor** (`zakat-assessor`)
- **Admin** (`admin`)

### 3. **Charity Categories**
```typescript
enum CategoryEnum {
  'international-relief' = 'International Relief'
  'local-relief' = 'Local Relief'
  'education' = 'Education'
  'masjid-community-projects' = 'Masjid & Community Projects'
  'health-medical-aid' = 'Health & Medical Aid'
  'environment-sustainability' = 'Environment & Sustainability'
  'advocacy-human-rights' = 'Advocacy & Human Rights'
}
```

### 4. **Supported Countries**
- **USA** (`usa`) - United States
- **UK** (`uk`) - United Kingdom
- **Canada** (`ca`) - Canada

---

## 🔍 Assessment System

### **Assessment Types** (4 Core Areas)
1. **Core Area 1** - Charity Status (`core-area-1`)
   - Charity number, registration status
   - Gift Aid eligibility
   - Registration date and evidence
   
2. **Core Area 2** - Financial Accountability (`core-area-2`)
   - Financial statements, tax returns
   - IRS/CRA returns
   - Audited statements availability
   - Impact reports

3. **Core Area 3** - Zakat Assessment (`core-area-3`)
   - 28 detailed zakat-related criteria
   - Zakat policy, distribution, management
   - Shariah advisory board
   - Fund flow and eligibility

4. **Core Area 4** - Governance & Leadership (`core-area-4`)
   - Board member information
   - Leadership team transparency
   - Governance structure

### **Assessment Grading System**
- **Grades**: A, B, C, D, F
- **Score**: Numerical score out of total score
- **Status**: `submitted`, `draft`, `pending`, `in-progress`

### **Assessment Data Storage**
Currently stored in `DUMMY_AUDIT_VALS.tsx` with complete sample data for all 4 core areas.

---

## 📋 Pending Actions/Tasks

Each charity has a task list (`DUMMY_TASKS`):
1. **Assign Project Manager** - Modal-based assignment
2. **Perform Eligibility Test** - Modal-based review
3. **Core Area 1 Assessment** - Navigates to assessment page
4. **Core Area 2 Assessment** - Navigates to assessment page
5. **Core Area 3 Assessment** - Navigates to assessment page
6. **Core Area 4 Assessment** - Navigates to assessment page

---

## 🎨 UI/UX Features

### **View Modes**
1. **Kanban View** - Drag-and-drop board organized by status
2. **Tabular View** - Sortable table with pagination (10/25/50/100 rows)

### **Search & Filter**
- Fuzzy search using **Fuse.js**
- Searches: `charityTitle`, `charityOwnerName`
- 800ms debounce for performance

### **Bulk Operations**
- **Bulk Email Modal** - Select multiple charities and send emails
- Checkbox selection with "select all" functionality
- Shows selected count and audience summary

### **Modals**
1. **Assign Project Manager** - Autocomplete with 4 dummy managers
2. **Eligibility Test** - Form with checkboxes, date picker, category selector
3. **Bulk Email** - Table with multi-select

---

## 🔄 Current Data Flow (Dummy Data)

### **Data Sources**
```typescript
// Main charity data
import { DUMMY_CHARITIES } from '@/DUMMY_CHARITIES'

// Assessment values
import { DUMMY_AUDIT_VALUES } from '@/DUMMY_AUDIT_VALS'

// Task definitions
import { DUMMY_TASKS } from '@/DUMMY_CHARITIES'
```

### **Example: Charities Page Flow**
1. User visits `/charities`
2. `CharitiesPageComponent` loads `DUMMY_CHARITIES`
3. Fuzzy search filters charities client-side
4. Renders Kanban or Tabular view
5. User clicks charity → navigates to `/charities/[id]`
6. `SingleCharityPageComponent` finds charity by ID from `DUMMY_CHARITIES`

### **Example: Assessment Flow**
1. User clicks assessment task on charity detail page
2. Navigates to `/charities/[id]/assessments/[assessment]?country=usa`
3. Page loads charity from `DUMMY_CHARITIES`
4. Loads assessment definition from `AUDIT_DEFINITIONS`
5. Renders assessment form or preview based on `preview-mode` param

---

## 🚀 API Integration Readiness

### **Current State**
- ✅ Complete UI/UX implementation
- ✅ All data models defined with TypeScript
- ✅ Form validation in place
- ✅ Routing structure established
- ❌ **NO API calls** - everything uses dummy data
- ❌ **NO backend integration**

### **API Infrastructure Present**
Located in `src/app/lib/methods.ts`:
```typescript
// Generic HTTP methods available
_get(request: string, requireAuth = true): Promise<ResponseType>
_post(request: string, body: any, requireAuth = true): Promise<ResponseType>
_patch<K>(request: string, body: K, requireAuth = true): Promise<ResponseType>
```

**Features:**
- Bearer token authentication
- Cookie-based auth (`accessToken`)
- Standardized response type
- Error handling with `unauthenticated` flag

### **Server Configuration**
```typescript
// src/app/lib/definitions.ts
export const serverUrl = process.env.SERVER!
```

---

## 🔌 Integration Points for API

### **1. Charities CRUD**
**Endpoints Needed:**
- `GET /charities` - List all charities (with pagination, search, filters)
- `GET /charities/:id` - Get single charity
- `POST /charities` - Create new charity
- `PATCH /charities/:id` - Update charity
- `DELETE /charities/:id` - Delete charity

**Current Implementation:**
- Create: Form at `/create-charity` → Preview → "Publish" button (TODO comment)
- Read: All from `DUMMY_CHARITIES`
- Update: No implementation yet
- Delete: No implementation yet

### **2. Team Member Management**
**Endpoints Needed:**
- `GET /team-members` - List available team members (for assignment)
- `POST /charities/:id/members` - Assign member to charity
- `DELETE /charities/:id/members/:memberId` - Remove member

**Current Implementation:**
- Assignment via `AssignProjectManager` modal (hardcoded 4 managers)
- No actual API call on assignment

### **3. Assessment System**
**Endpoints Needed:**
- `GET /charities/:id/assessments` - Get all assessments for charity
- `GET /charities/:id/assessments/:auditId` - Get specific assessment
- `POST /charities/:id/assessments/:auditType` - Create/submit assessment
- `PATCH /charities/:id/assessments/:auditId` - Update assessment (save draft)
- `GET /assessments/definitions` - Get assessment form definitions

**Current Implementation:**
- All assessment data from `DUMMY_AUDIT_VALUES`
- Assessment forms exist but don't submit to backend
- Preview mode shows hardcoded assessor info

### **4. Email System**
**Endpoints Needed:**
- `POST /charities/bulk-email` - Send bulk email to selected charities
- `GET /charities/:id/email-logs` - Get email history

**Current Implementation:**
- Bulk email modal exists with selection UI
- No actual email sending
- Email logs page exists but empty

### **5. Eligibility Review**
**Endpoints Needed:**
- `POST /charities/:id/eligibility` - Submit eligibility review

**Current Implementation:**
- Modal form with validation
- No API submission

---

## 📊 Data Models Summary

### **Key Types to Map to API**
```typescript
// Charity
type SingleCharityType = { ... }

// Member
type Member = {
  name: string
  id: string
  profilePicture: string | null
  role: BaseRoles
}

// Assessment Common
type AuditValueCommonExtension = {
  score: number
  totalScore: number
  grade: GradeType
  status: AuditStatus
  auditedBy?: AuditedByType
}

// Assessment Specific (4 types)
type CoreArea1Values = { ... }
type CoreArea2Values = { ... }
type CoreArea3Values = { ... }
type CoreArea4Values = { ... }
```

---

## 🎯 Recommended API Integration Strategy

### **Phase 1: Read Operations**
1. Replace `DUMMY_CHARITIES` with `GET /charities` API call
2. Implement charity detail fetching
3. Load team members from API
4. Fetch assessment data from backend

### **Phase 2: Write Operations**
1. Implement charity creation (`POST /charities`)
2. Enable team member assignment
3. Implement assessment submission
4. Add eligibility review submission

### **Phase 3: Advanced Features**
1. Bulk email functionality
2. Email logs
3. Real-time updates (WebSocket/polling)
4. File upload for assessment evidence

### **Phase 4: Optimization**
1. Implement pagination on backend
2. Add server-side search/filtering
3. Caching strategy
4. Optimistic UI updates

---

## 🔍 Notable Implementation Details

### **1. Search Implementation**
Uses **Fuse.js** for fuzzy search:
```typescript
const fuse = new Fuse(DUMMY_CHARITIES, {
  threshold: 0.4,
  keys: ['charityTitle', 'charityOwnerName']
})
```

### **2. Routing Patterns**
- Dynamic routes: `[id]`, `[assessment]`
- Query params: `?country=usa`, `?preview-mode=true`
- Data passed via URL encoding for preview

### **3. State Management**
- Local component state (useState)
- URL state for navigation
- No global state management (Redux/Zustand)

### **4. Form Handling**
- Controlled components
- Client-side validation
- Preview before submit pattern

### **5. UI Components**
- Shadcn/ui components
- Custom icon components
- Reusable modal system (`ModelComponentWithExternalControl`)

---

## 📝 TODOs Found in Code

1. **Charity Publishing** (`/charities/preview/page.tsx:99`)
   ```typescript
   // TODO: wire publish to backend
   console.log('Publish charity', parsed)
   ```

2. **Email Logs** - Directory exists but no implementation

3. **Manage Team** - Dropdown option exists but no modal/page

---

## 🎨 Design Patterns Used

1. **Component Composition** - Reusable components with props
2. **Render Props** - Table columns, modal content
3. **Controlled Components** - All forms
4. **Container/Presenter** - Page components wrap use-case components
5. **Type Safety** - Extensive TypeScript usage
6. **Enum-based Configuration** - Status, categories, countries

---

## 🔐 Authentication Integration

The module is ready for auth:
- All API methods support `requireAuth` parameter
- Bearer token from cookies
- Unauthenticated state handling in responses

---

## 📈 Scalability Considerations

### **Current Limitations (Dummy Data)**
- All data loaded client-side
- No pagination on data source
- Search happens client-side
- No real-time updates

### **Ready for Scale**
- Pagination UI implemented (tabular view)
- Search debouncing
- Lazy loading via Next.js routing
- Modular component structure

---

## 🎯 Summary

The charities module is a **feature-complete frontend implementation** with:
- ✅ Full UI/UX for charity management
- ✅ Complete assessment system (4 core areas)
- ✅ Team member assignment
- ✅ Search, filter, and view modes
- ✅ Bulk operations
- ✅ Type-safe data models
- ✅ Routing and navigation
- ✅ Form validation
- ❌ **NO backend integration** - all dummy data
- ❌ **NO API calls** - ready for integration

**Next Step:** Replace dummy data imports with API calls using the existing `_get`, `_post`, `_patch` methods in `src/app/lib/methods.ts`.
