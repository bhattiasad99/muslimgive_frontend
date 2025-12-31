# Charities Module - API Integration Plan

## 📋 API vs Frontend Analysis

### **Backend API Endpoints Available**

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | `/charities` | Create charity | ✅ Available |
| GET | `/charities` | List charities (paginated) | ✅ Available |
| GET | `/charities/{id}` | Get single charity | ✅ Available |
| DELETE | `/charities/{id}` | Delete charity | ✅ Available |
| PATCH | `/charities/{charity_id}/assign` | Assign roles to users | ✅ Available |
| PATCH | `/charities/{charity_id}/eligibility` | Perform eligibility test | ✅ Available |

---

## 🔍 Detailed API-Frontend Mapping

### **1. POST /charities - Create Charity**

#### **API Request Schema:**
```json
{
  "name": "MuslimGive Foundation",
  "isIslamic": true,
  "doesCharityGiveZakat": true,
  "description": "Providing emergency relief...",
  "charityCommissionWebsiteUrl": "https://...",
  "startDate": "2024-01-01",
  "category": "education"
}
```

#### **Frontend Form** (`/create-charity/page.tsx`)
Current form fields:
- ✅ `name` → Maps to API `name`
- ✅ `isIslamic` → Maps to API `isIslamic`
- ✅ `paysZakat` → Maps to API `doesCharityGiveZakat`
- ✅ `description` → Maps to API `description`
- ✅ `website` → Maps to API `charityCommissionWebsiteUrl`
- ✅ `startDate` → Maps to API `startDate`
- ✅ `category` → Maps to API `category`

**Status:** ✅ **PERFECT MATCH** - All fields align!

**Current Implementation:**
```typescript
// Line 50: Currently redirects to preview page
const encoded = encodeURIComponent(JSON.stringify(payload))
router.push(`/charities/preview?data=${encoded}`)
```

**Integration Needed:**
- Replace preview flow with direct API call to `POST /charities`
- Handle success/error responses
- Redirect to charity detail page on success
- Show toast notifications

---

### **2. GET /charities - List Charities**

#### **API Query Parameters:**
```
page: number (default 1)
limit: number (default 25, max 100)
search: string (search by name or description)
sortBy: 'createdAt' | 'name' | 'updatedAt' (default 'createdAt')
order: 'ASC' | 'DESC' (default 'DESC')
status: array<string> (comma-separated)
isActive: boolean
startDate: string (YYYY-MM-DD)
endDate: string (YYYY-MM-DD)
createdByUserId: string
doesCharityGiveZakat: boolean
isIslamic: boolean
categories: array<string> (comma-separated)
```

#### **API Response Schema:**
```json
{
  "success": true,
  "message": "Charities fetched successfully",
  "data": {
    "charities": [...],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 25,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "links": {
      "next": null,
      "prev": null
    }
  }
}
```

#### **Frontend Implementation** (`CharitiesPageComponent/index.tsx`)

**Current Features:**
- ✅ Search by `charityTitle` and `charityOwnerName` (client-side Fuse.js)
- ❌ No pagination (loads all data)
- ❌ No filters (status, category, etc.)
- ❌ No sorting
- ❌ No date range filtering

**Tabular View** (`tabular/TabularView.tsx`)
- ✅ Client-side pagination (10/25/50/100 rows)
- ❌ Not connected to backend pagination

**Gaps Identified:**

1. **Missing Filters:**
   - Status filter (currently just visual grouping in Kanban)
   - Category filter
   - Islamic charity filter
   - Zakat-giving filter
   - Date range filter
   - Created by user filter
   - Active/inactive filter

2. **Pagination:**
   - Frontend has pagination UI but works on full dataset
   - Need to implement server-side pagination

3. **Sorting:**
   - No sorting controls in UI
   - Need to add sort options

**Integration Needed:**
- Replace `DUMMY_CHARITIES` with API call
- Implement server-side pagination
- Add filter controls to UI
- Add sorting controls
- Debounced search to API (currently 800ms debounce exists)
- Update URL params for filters/pagination

---

### **3. GET /charities/{id} - Get Single Charity**

#### **API Response:**
```json
{
  "success": true,
  "message": "Charity fetched successfully",
  "data": {
    "id": "uuid",
    "name": "MuslimGive Foundation",
    "status": "unassigned"
    // ... includes assignments, eligibility tests, reviews summary
  }
}
```

#### **Frontend Implementation** (`/charities/[id]/page.tsx`)

**Current:**
```typescript
const charity = DUMMY_CHARITIES.find(eachCharity => eachCharity.id === id);
```

**Integration Needed:**
- Replace with API call to `GET /charities/{id}`
- Map API response to `SingleCharityType`
- Handle loading states
- Handle 404 errors
- Update type definitions based on actual API response

**Note:** API response structure not fully documented. Need to verify:
- Does it include `members` array?
- Does it include `comments` count?
- Does it include `auditsCompleted` count?
- Does it include eligibility test data?

---

### **4. DELETE /charities/{id} - Delete Charity**

#### **API Response:**
```json
{
  "success": true,
  "message": "Charity deleted successfully",
  "data": {
    "id": "uuid",
    "deleted": true
  }
}
```

#### **Frontend Implementation:**
**Status:** ❌ **NOT IMPLEMENTED**

**Missing Features:**
- No delete button in UI
- No confirmation modal
- No delete functionality

**Integration Needed:**
- Add delete button to charity detail page or dropdown menu
- Implement confirmation modal
- Call `DELETE /charities/{id}`
- Redirect to charities list on success
- Show toast notification

---

### **5. PATCH /charities/{charity_id}/assign - Assign Roles**

#### **API Request Schema:**
```json
{
  "assignments": [
    {
      "userId": "uuid",
      "add": ["project-manager", "operations-manager"],
      "remove": ["zakat-auditor"],
      "set": ["operations-manager"]
    }
  ]
}
```

#### **Frontend Implementation** (`AssignProjectManager.tsx`)

**Current:**
- ✅ Modal exists for assigning project manager
- ✅ Autocomplete with dummy managers
- ❌ Only supports single role assignment (project-manager)
- ❌ No remove functionality
- ❌ No multi-role assignment
- ❌ Hardcoded 4 managers

**Gaps Identified:**

1. **Role Types:**
   - API supports: `project-manager`, `operations-manager`, `zakat-auditor`
   - Frontend only has UI for: `project-manager`
   - Frontend data model has: `project-manager`, `finance-auditor`, `zakat-auditor`, `admin`
   
   **⚠️ MISMATCH:** `operations-manager` vs `finance-auditor`

2. **Assignment Operations:**
   - API supports: `add`, `remove`, `set`
   - Frontend only implements: assign (implicit add)

3. **Bulk Assignments:**
   - API supports multiple users in one request
   - Frontend only assigns one user at a time

4. **User Selection:**
   - Frontend has hardcoded 4 managers
   - Need API endpoint to fetch available users

**Integration Needed:**
- Create API endpoint to fetch available team members (not in provided docs)
- Update modal to support multiple roles
- Add remove/unassign functionality
- Implement "Manage Team" feature (currently just a dropdown option)
- Map role names correctly
- Support bulk assignment

---

### **6. PATCH /charities/{charity_id}/eligibility - Eligibility Test**

#### **API Request Schema:**
```json
{
  "startDate": "2022-01-05",
  "doesCharityGiveZakat": true,
  "isIslamic": true,
  "category": "education"
}
```

#### **Frontend Implementation** (`EligibilityTest.tsx`)

**Current Form Fields:**
- ✅ `isIslamicCharity` → Maps to API `isIslamic`
- ✅ `doesItPayZakat` → Maps to API `doesCharityGiveZakat`
- ✅ `startDate` → Maps to API `startDate`
- ✅ `category` → Maps to API `category`

**Status:** ✅ **PERFECT MATCH** - All fields align!

**Current Implementation:**
```typescript
// Modal with form, but no submission
const handleUpdateFormData = (field, value) => { ... }
```

**API Behavior:**
- ⚠️ Rejects if eligibility test already conducted
- Updates charity status to "unassigned" on success

**Integration Needed:**
- Implement API call on form submit
- Handle "already conducted" error (400)
- Update charity status in UI after success
- Show appropriate error messages
- Refresh charity data after submission

---

## 🚫 Missing API Endpoints

### **Critical Missing Endpoints:**

1. **GET /users or /team-members**
   - **Needed for:** Populating assignment dropdown
   - **Current:** Hardcoded 4 managers
   - **Impact:** Cannot assign real users

2. **Audit Endpoints** (All 4 Core Areas)
   - `GET /charities/{id}/audits` - List all audits
   - `GET /charities/{id}/audits/{audit_id}` - Get specific audit
   - `POST /charities/{id}/audits/{type}` - Submit audit
   - `PATCH /charities/{id}/audits/{audit_id}` - Update/save draft
   - **Impact:** Entire audit system non-functional

3. **Email Endpoints**
   - `POST /charities/bulk-email` - Send bulk emails
   - `GET /charities/{id}/email-logs` - Get email history
   - **Impact:** Bulk email and email logs non-functional

4. **Comments/Notes**
   - No API for comments system
   - Frontend shows `comments: number` but no way to view/add
   - **Impact:** Comments feature non-functional

5. **Country Management**
   - Frontend supports USA, UK, Canada
   - No API field for country in charity model
   - **Impact:** Country selection may not persist

6. **Charity Update**
   - No `PATCH /charities/{id}` endpoint
   - **Impact:** Cannot edit charity details after creation

---

## 📊 Data Model Comparison

### **Frontend Model (SingleCharityType)**
```typescript
{
  id: string
  charityTitle: string              // ← API: "name"
  charityOwnerName: string          // ❌ NOT IN API
  charityDesc: string               // ← API: "description"
  members: Member[]                 // ❓ From assignments?
  comments: number                  // ❌ NOT IN API
  auditsCompleted: 0|1|2|3|4       // ❓ From reviews?
  status: StatusType                // ← API: "status"
  category: CategoryEnum            // ← API: "category"
  country?: CountryEnum             // ❌ NOT IN API
  totalDuration?: string            // ❓ Calculated from startDate?
  website?: string                  // ← API: "charityCommissionWebsiteUrl"
  isThisMuslimCharity?: boolean     // ← API: "isIslamic"
  doTheyPayZakat?: boolean          // ← API: "doesCharityGiveZakat"
}
```

### **API Model (Inferred from docs)**
```json
{
  "id": "uuid",
  "name": "string",
  "status": "unassigned",
  "description": "string",
  "charityCommissionWebsiteUrl": "string",
  "isIslamic": boolean,
  "doesCharityGiveZakat": boolean,
  "category": "education",
  "startDate": "2024-01-01",
  // assignments, eligibility tests, reviews (structure unknown)
}
```

### **Mapping Issues:**

1. **charityOwnerName** - Not in API
   - Need to determine: Is this the user who created it?
   - May need to fetch from user data

2. **members** - Structure unknown
   - API mentions "assignments" in response
   - Need to see actual response structure

3. **comments** - Not in API
   - Feature may not be implemented yet

4. **auditsCompleted** - Structure unknown
   - API mentions "reviews summary"
   - Need to see actual response structure

5. **country** - Not in API
   - May need to add to backend or derive from other data

6. **totalDuration** - Not in API
   - Can calculate client-side from `startDate`

---

## 🎯 Frontend Functionality Gaps

### **✅ Implemented & API-Ready:**
1. Create charity form (perfect match)
2. Eligibility test form (perfect match)
3. Basic charity listing
4. Single charity view
5. Assign project manager (needs user API)

### **⚠️ Partially Implemented (Needs Work):**
1. **Pagination** - UI exists, needs backend integration
2. **Search** - Works client-side, needs backend integration
3. **Role Assignment** - Only PM, needs multi-role support
4. **Status Management** - Visual only, needs backend sync

### **❌ Not Implemented:**
1. **Delete Charity** - No UI
2. **Edit Charity** - No UI or API
3. **Filters** - No UI for status, category, date range, etc.
4. **Sorting** - No UI
5. **Manage Team** - Dropdown exists, no modal/page
6. **Remove Assignments** - No UI
7. **Bulk Role Assignment** - No UI

### **❌ Missing Backend APIs:**
1. **Audit System** (all 4 core areas)
2. **Email System** (bulk email, logs)
3. **Comments System**
4. **User/Team Member Listing**
5. **Charity Update/Edit**
6. **Country Field**

---

## 🔧 Integration Strategy

### **Phase 1: Core CRUD (High Priority)**

#### **1.1 Create Charity**
- [ ] Update `create-charity/page.tsx` to call `POST /charities`
- [ ] Remove preview page flow (or make it optional)
- [ ] Map form fields to API schema
- [ ] Handle success: redirect to `/charities/{id}`
- [ ] Handle errors: show validation messages
- [ ] Add loading state during submission

**Files to Modify:**
- `src/app/(dashboard)/create-charity/page.tsx`
- Create: `src/app/actions/charities.ts` (server action)

#### **1.2 List Charities**
- [ ] Replace `DUMMY_CHARITIES` with API call
- [ ] Implement server-side pagination
- [ ] Add URL params for page/limit
- [ ] Update tabular view pagination
- [ ] Handle loading states
- [ ] Handle empty states

**Files to Modify:**
- `src/components/use-case/CharitiesPageComponent/index.tsx`
- `src/components/use-case/CharitiesPageComponent/tabular/TabularView.tsx`
- Create: `src/app/actions/charities.ts`

#### **1.3 Get Single Charity**
- [ ] Replace `DUMMY_CHARITIES.find()` with API call
- [ ] Update type definitions based on actual API response
- [ ] Map API response to `SingleCharityType`
- [ ] Handle loading states
- [ ] Handle 404 errors

**Files to Modify:**
- `src/app/(dashboard)/charities/[id]/page.tsx`
- Update: `src/app/actions/charities.ts`

#### **1.4 Delete Charity**
- [ ] Add delete button to charity detail page
- [ ] Create confirmation modal
- [ ] Implement API call to `DELETE /charities/{id}`
- [ ] Redirect to `/charities` on success
- [ ] Show toast notification

**Files to Modify:**
- `src/components/use-case/SingleCharityPageComponent/index.tsx`
- Update: `src/app/actions/charities.ts`

---

### **Phase 2: Search & Filters (Medium Priority)**

#### **2.1 Server-Side Search**
- [ ] Replace Fuse.js with API search param
- [ ] Keep 800ms debounce
- [ ] Update URL with search query
- [ ] Show search loading state

**Files to Modify:**
- `src/components/use-case/CharitiesPageComponent/index.tsx`

#### **2.2 Add Filter UI**
- [ ] Create filter panel component
- [ ] Add status filter (multi-select)
- [ ] Add category filter (multi-select)
- [ ] Add Islamic charity toggle
- [ ] Add Zakat-giving toggle
- [ ] Add date range picker
- [ ] Add active/inactive toggle
- [ ] Update URL params with filters
- [ ] Persist filters in URL

**Files to Create:**
- `src/components/use-case/CharitiesPageComponent/FiltersPanel.tsx`

#### **2.3 Add Sorting UI**
- [ ] Add sort dropdown (createdAt, name, updatedAt)
- [ ] Add order toggle (ASC/DESC)
- [ ] Update URL params
- [ ] Apply to API call

**Files to Modify:**
- `src/components/use-case/CharitiesPageComponent/index.tsx`

---

### **Phase 3: Team Management (Medium Priority)**

#### **3.1 Fetch Team Members**
- [ ] **BLOCKED:** Need `GET /users` or `/team-members` API
- [ ] Create server action to fetch users
- [ ] Update `AssignProjectManager` to use real data
- [ ] Add role filtering (only show users with appropriate roles)

**Files to Modify:**
- `src/components/use-case/SingleCharityPageComponent/models/AssignProjectManager.tsx`
- Update: `src/app/actions/charities.ts`

#### **3.2 Assign Roles**
- [ ] Update assignment modal to support multiple roles
- [ ] Implement `PATCH /charities/{charity_id}/assign`
- [ ] Handle add/remove/set operations
- [ ] Refresh charity data after assignment
- [ ] Show success toast

**Files to Modify:**
- `src/components/use-case/SingleCharityPageComponent/models/AssignProjectManager.tsx`
- Update: `src/app/actions/charities.ts`

#### **3.3 Manage Team Page**
- [ ] Create "Manage Team" modal/page
- [ ] Show all assigned members with roles
- [ ] Allow adding multiple roles to users
- [ ] Allow removing roles
- [ ] Implement bulk assignment

**Files to Create:**
- `src/components/use-case/SingleCharityPageComponent/models/ManageTeam.tsx`

#### **3.4 Role Mapping**
- [ ] Clarify role names with backend
- [ ] Update `BaseRoles` type
- [ ] Update `RolesEnum`
- [ ] Ensure consistency

**Frontend Roles:**
- `project-manager` ✅
- `finance-auditor` ⚠️ (API has `operations-manager`)
- `zakat-auditor` ✅
- `admin` ❓ (not in API docs)

---

### **Phase 4: Eligibility Test (High Priority)**

- [ ] Implement API call in `EligibilityTest.tsx`
- [ ] Handle "already conducted" error (400)
- [ ] Update charity status after success
- [ ] Refresh charity data
- [ ] Close modal on success
- [ ] Show appropriate error messages

**Files to Modify:**
- `src/components/use-case/SingleCharityPageComponent/models/EligibilityTest.tsx`
- Update: `src/app/actions/charities.ts`

---

### **Phase 5: Data Model Alignment (High Priority)**

#### **5.1 Clarify API Response Structure**
- [ ] Get actual API response for `GET /charities/{id}`
- [ ] Document structure of:
  - `assignments` array
  - `eligibility tests` array
  - `reviews summary` object
- [ ] Update TypeScript types

#### **5.2 Handle Missing Fields**
- [ ] **charityOwnerName**: Determine source (creator user?)
- [ ] **comments**: Add to backend or remove from frontend
- [ ] **country**: Add to backend or derive from data
- [ ] **auditsCompleted**: Map from reviews summary
- [ ] **totalDuration**: Calculate client-side

#### **5.3 Update Type Definitions**
- [ ] Create API response types
- [ ] Create mapping functions (API → Frontend)
- [ ] Update `SingleCharityType` or create separate API type

**Files to Create:**
- `src/types/api/charities.ts`
- `src/lib/mappers/charities.ts`

---

### **Phase 6: Future Features (Low Priority - Blocked)**

These require backend APIs that don't exist yet:

#### **6.1 Audit System**
- **BLOCKED:** No audit APIs
- [ ] Wait for audit endpoints
- [ ] Integrate audit submission
- [ ] Integrate audit history
- [ ] Integrate audit preview

#### **6.2 Email System**
- **BLOCKED:** No email APIs
- [ ] Wait for bulk email endpoint
- [ ] Wait for email logs endpoint
- [ ] Integrate bulk email modal
- [ ] Create email logs page

#### **6.3 Comments System**
- **BLOCKED:** No comments API
- [ ] Wait for comments endpoint
- [ ] Create comments UI
- [ ] Integrate with API

#### **6.4 Edit Charity**
- **BLOCKED:** No `PATCH /charities/{id}` endpoint
- [ ] Wait for update endpoint
- [ ] Create edit form
- [ ] Integrate with API

---

## 📝 Server Actions Structure

Create `src/app/actions/charities.ts`:

```typescript
'use server'

import { _get, _post, _patch, _delete } from '../lib/methods'
import { ResponseType } from '../lib/definitions'

// List charities with pagination and filters
export const listCharities = async (params: {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'name' | 'updatedAt'
  order?: 'ASC' | 'DESC'
  status?: string[]
  isActive?: boolean
  startDate?: string
  endDate?: string
  createdByUserId?: string
  doesCharityGiveZakat?: boolean
  isIslamic?: boolean
  categories?: string[]
}): Promise<ResponseType> => {
  const queryParams = new URLSearchParams()
  // Build query string...
  return await _get(`/charities?${queryParams}`)
}

// Get single charity
export const getCharity = async (id: string): Promise<ResponseType> => {
  return await _get(`/charities/${id}`)
}

// Create charity
export const createCharity = async (data: {
  name: string
  isIslamic: boolean
  doesCharityGiveZakat: boolean
  description: string
  charityCommissionWebsiteUrl: string
  startDate: string
  category: string
}): Promise<ResponseType> => {
  return await _post('/charities', data)
}

// Delete charity
export const deleteCharity = async (id: string): Promise<ResponseType> => {
  return await _delete(`/charities/${id}`)
}

// Assign roles
export const assignCharityRoles = async (
  charityId: string,
  assignments: Array<{
    userId: string
    add?: string[]
    remove?: string[]
    set?: string[]
  }>
): Promise<ResponseType> => {
  return await _patch(`/charities/${charityId}/assign`, { assignments })
}

// Perform eligibility test
export const performEligibilityTest = async (
  charityId: string,
  data: {
    startDate: string
    doesCharityGiveZakat: boolean
    isIslamic: boolean
    category: string
  }
): Promise<ResponseType> => {
  return await _patch(`/charities/${charityId}/eligibility`, data)
}
```

**Note:** Need to add `_delete` method to `src/app/lib/methods.ts`

---

## ⚠️ Critical Issues & Questions

### **1. Role Name Mismatch**
- Frontend: `finance-auditor`
- Backend: `operations-manager`
- **Action Required:** Clarify with backend team

### **2. Missing User/Team Member API**
- Cannot populate assignment dropdowns
- **Action Required:** Request `GET /users` or `/team-members` endpoint

### **3. Incomplete API Response Documentation**
- Don't know structure of `assignments`, `eligibility tests`, `reviews summary`
- **Action Required:** Get sample API responses

### **4. Missing Country Field**
- Frontend has country selection (USA, UK, Canada)
- Not in API schema
- **Action Required:** Add to backend or remove from frontend

### **5. Charity Owner Name**
- Frontend shows `charityOwnerName`
- Not in API
- **Action Required:** Determine if this is the creator's name

### **6. Comments System**
- Frontend shows comment count
- No API support
- **Action Required:** Add comments API or remove feature

### **7. No Update Endpoint**
- Cannot edit charity after creation
- **Action Required:** Add `PATCH /charities/{id}` endpoint

### **8. Audit APIs Missing**
- Entire audit system (4 core areas) has no backend
- **Action Required:** Implement audit APIs

### **9. Email APIs Missing**
- Bulk email and email logs have no backend
- **Action Required:** Implement email APIs

---

## 📊 Implementation Priority Matrix

| Feature | Priority | Complexity | Blocked | Effort |
|---------|----------|------------|---------|--------|
| Create Charity | 🔴 High | Low | No | 2h |
| List Charities | 🔴 High | Medium | No | 4h |
| Get Single Charity | 🔴 High | Low | No | 2h |
| Eligibility Test | 🔴 High | Low | No | 2h |
| Delete Charity | 🟡 Medium | Low | No | 2h |
| Server-Side Search | 🟡 Medium | Low | No | 2h |
| Pagination | 🟡 Medium | Medium | No | 3h |
| Assign Roles | 🟡 Medium | Medium | Yes (User API) | 4h |
| Filters UI | 🟢 Low | High | No | 8h |
| Sorting UI | 🟢 Low | Low | No | 2h |
| Manage Team | 🟢 Low | Medium | Yes (User API) | 6h |
| Data Model Alignment | 🔴 High | Medium | No | 4h |
| Audit System | ⚫ Blocked | High | Yes (Audit APIs) | - |
| Email System | ⚫ Blocked | Medium | Yes (Email APIs) | - |
| Edit Charity | ⚫ Blocked | Medium | Yes (Update API) | - |

---

## 🎯 Recommended Implementation Order

### **Sprint 1: Core Functionality (16 hours)**
1. Data Model Alignment (4h)
2. Create Charity (2h)
3. List Charities (4h)
4. Get Single Charity (2h)
5. Eligibility Test (2h)
6. Delete Charity (2h)

### **Sprint 2: Search & Pagination (7 hours)**
1. Server-Side Search (2h)
2. Pagination (3h)
3. Sorting UI (2h)

### **Sprint 3: Team Management (10 hours)**
*Requires User API*
1. Fetch Team Members (2h)
2. Assign Roles (4h)
3. Manage Team Page (6h)

### **Sprint 4: Advanced Filters (8 hours)**
1. Filters Panel UI (6h)
2. Filter Integration (2h)

### **Future Sprints: Blocked Features**
- Audit System (requires audit APIs)
- Email System (requires email APIs)
- Edit Charity (requires update API)
- Comments (requires comments API)

---

## 📋 Summary

### **What Can Be Implemented Now:**
✅ Create charity (perfect match)
✅ List charities (needs pagination/filters)
✅ Get single charity (needs data mapping)
✅ Delete charity (needs UI)
✅ Eligibility test (perfect match)
⚠️ Assign roles (needs user API + role clarification)

### **What's Missing from Backend:**
❌ User/Team member listing API
❌ All audit APIs (4 core areas)
❌ Email APIs (bulk email, logs)
❌ Comments API
❌ Charity update API
❌ Country field in charity model

### **What's Missing from Frontend:**
❌ Delete charity UI
❌ Edit charity UI
❌ Filters panel
❌ Sorting controls
❌ Manage team page
❌ Remove role assignments
❌ Bulk role assignment

### **Critical Blockers:**
1. No user/team member API → Cannot populate assignment dropdowns
2. Incomplete API response docs → Cannot map data correctly
3. Role name mismatch → Need clarification
4. Missing country field → Need backend support

### **Estimated Total Effort:**
- **Implementable Now:** ~41 hours
- **Blocked Features:** TBD (depends on backend APIs)

---

## 🚀 Next Steps

1. **Clarify with Backend Team:**
   - Get actual API response samples
   - Resolve role name mismatch
   - Request user/team member API
   - Discuss missing fields (country, owner, comments)

2. **Start Implementation:**
   - Begin with Sprint 1 (Core Functionality)
   - Create server actions file
   - Update type definitions
   - Implement data mappers

3. **Track Blocked Features:**
   - Document required backend APIs
   - Create tickets for missing endpoints
   - Plan future sprints when APIs available
