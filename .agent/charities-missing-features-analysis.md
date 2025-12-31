# Charities Module - Feature Comparison with Other Modules

## 🔍 Analysis Summary

I've searched the entire codebase for similar patterns to the missing charities features. Here's what I found:

---

## ✅ Features Found in Other Modules

### **1. Delete Functionality**
**Status:** ❌ **NOT FOUND ANYWHERE**
- Searched for "delete" across all `.tsx` and `.ts` files
- **Result:** No delete functionality implemented in any module
- **Conclusion:** Delete pattern needs to be created from scratch for charities

---

### **2. Edit/Update Functionality**
**Status:** ✅ **FOUND - Multiple Implementations**

#### **A. Profile Module** (`ProfilePageComponent`)
**Files:**
- `EditPersonalInfoModal.tsx` (150 lines)
- `EditAddressModal.tsx` (149 lines)

**Pattern Used:**
```typescript
// Modal-based editing with confirmation
type IProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: PersonalInfo
  onSave: (data: PersonalInfo) => void
}

// Features:
- ✅ Controlled form fields
- ✅ Change detection (hasChanges)
- ✅ Confirmation modal before save
- ✅ Cancel with reset to initial values
- ✅ Disabled save button when no changes
```

**Usage in Users Module:**
```typescript
// UsersExpandableTable/UserData.tsx
onEditPersonalInfo?: () => void
onEditAddress?: () => void
showEditButtons?: boolean

// Conditionally shows edit buttons
{onEditPersonalInfo && showEditButtons ? (
  <Button onClick={onEditPersonalInfo}>
    <EditIcon /> Edit
  </Button>
) : null}
```

#### **B. Access Control Module** (`AccessControl`)
**Files:**
- `EditRoleModal.tsx` (105 lines)
- `ManageRoles.tsx` (122 lines)

**Pattern Used:**
```typescript
// Table with inline edit buttons
<Button variant="ghost" size="icon" onClick={() => handleOpenEdit(role)}>
  <Edit className="h-4 w-4" />
</Button>

// Edit handler
const handleOpenEdit = (role: Role) => {
  setEditingRole(role)
  setIsEditOpen(true)
}

// Save handler
const handleEditSave = (data: { id: string; name: string; description: string }) => {
  setRoles(prev => prev.map(r => 
    r.id === data.id ? { ...r, name: data.name, description: data.description } : r
  ))
}
```

**✅ REUSABLE FOR CHARITIES:**
- Modal-based edit pattern
- Edit icon component exists (`EditIcon.tsx`)
- Confirmation flow
- Change detection

---

### **3. Filters Panel**
**Status:** ✅ **FOUND - Full Implementation**

#### **Users Module** (`UsersPageComponent/index.tsx`)
**Implementation:** Lines 191-257 (67 lines)

**Pattern Used:**
```typescript
// Popover-based filter panel
<Popover open={openFilterPopover} onOpenChange={setOpenFilterPopover}>
  <PopoverTrigger asChild>
    <Button size="icon" variant="secondary">
      <FilterIcon />
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-fit p-2">
    <div className="flex flex-col gap-3 p-2 w-[320px]">
      {/* Filter sections */}
    </div>
  </PopoverContent>
</Popover>

// Filter state
const [filterOpts, setFilterOpts] = useState<Record<FilterKey, boolean>>({
  'Financial Auditor': true,
  'Zakat Auditor': true,
  'Project Manager': true,
  'MG Admin': true,
  'Operations Manager': true,
  Active: true,
  Inactive: true,
  'Reset Password': false,
})

// Toggle handler
const toggleFilter = (key: FilterKey) =>
  setFilterOpts((prev) => ({ ...prev, [key]: !prev[key] }))

// Filter application
const filteredRows = useMemo(() => {
  const activeRoleFilters = ROLE_KEYS.filter((k) => filterOpts[k])
  const allRolesOn = activeRoleFilters.length === ROLE_KEYS.length
  
  return searchedRows.filter((u) => {
    const rolesOk = allRolesOn ? true : 
      u.roles.some((r) => activeRoleFilters.includes(r))
    return rolesOk && statusOk && resetOk
  })
}, [searchedRows, filterOpts])
```

**Features:**
- ✅ Multi-section filters (Roles, Status, Requests)
- ✅ Switch-based toggles
- ✅ "All on" optimization
- ✅ Popover UI component
- ✅ FilterIcon component exists
- ✅ Integrated with search

**✅ DIRECTLY REUSABLE FOR CHARITIES:**
This exact pattern can be adapted for:
- Status filters (6 statuses)
- Category filters (7 categories)
- Boolean filters (isIslamic, doesCharityGiveZakat)
- Date range filters (can be added)

---

### **4. Sorting Controls**
**Status:** ❌ **NOT FOUND**

**Search Results:**
- Only found `enableSorting: false` in BulkEmailModal
- No sorting UI controls found anywhere
- **Conclusion:** Sorting UI needs to be created from scratch

**Note:** TableComponent likely supports sorting (TanStack Table), but no UI controls implemented

---

### **5. Manage Team Page**
**Status:** ⚠️ **PARTIAL - Similar Pattern Exists**

#### **Access Control Module** (`ManageRoles.tsx`)
**Pattern:** Table-based management with actions

```typescript
// Table with action buttons
<Table>
  <TableBody>
    {roles.map(r => (
      <TableRow key={r.id}>
        <TableCell>{r.name}</TableCell>
        <TableCell>
          <Button onClick={() => handleOpenEdit(r)}>
            <Edit />
          </Button>
          <Button onClick={() => handleOpenManagePerm(r)}>
            <Settings />
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Modals for actions
<EditRoleModal open={isEditOpen} onOpenChange={setIsEditOpen} role={editingRole} onSave={handleEditSave} />
<ManagePermissionsModal open={isManagePermOpen} onOpenChange={setIsManagePermOpen} permissions={defaultPermissions} onSave={(p)=>{...}} />
```

**✅ ADAPTABLE FOR CHARITIES:**
Could create similar "Manage Team" page:
- Table showing all assigned members
- Columns: Name, Role(s), Actions
- Actions: Edit roles, Remove member
- Modal for editing roles
- Modal for adding new members

---

### **6. Remove Role Assignments**
**Status:** ❌ **NOT FOUND**

**Search Results:**
- Searched for "remove" in use-case components
- Only found in audit components (not related)
- **Conclusion:** No remove/unassign pattern exists

**Note:** The API supports `remove` in assignment payload, but no UI exists

---

### **7. Bulk Role Assignment**
**Status:** ❌ **NOT FOUND**

**Closest Match:** Bulk Email Modal (CharitiesPageComponent)
- Has multi-select with checkboxes
- Has "select all" functionality
- But only for email, not role assignment

**Conclusion:** Would need to create new modal combining:
- Multi-select pattern from BulkEmailModal
- Role assignment logic from AssignProjectManager

---

## 📊 Feature Availability Matrix

| Feature | Exists in Codebase | Module | Reusable | Effort to Adapt |
|---------|-------------------|--------|----------|-----------------|
| **Delete UI** | ❌ No | - | - | High (new pattern) |
| **Edit UI** | ✅ Yes | Profile, Access Control | ✅ Yes | Low (copy pattern) |
| **Filters Panel** | ✅ Yes | Users | ✅ Yes | Low (direct reuse) |
| **Sorting Controls** | ❌ No | - | - | Medium (new UI) |
| **Manage Team Page** | ⚠️ Partial | Access Control | ⚠️ Adaptable | Medium (adapt pattern) |
| **Remove Assignments** | ❌ No | - | - | Medium (new feature) |
| **Bulk Assignment** | ⚠️ Partial | Charities (email) | ⚠️ Adaptable | Medium (combine patterns) |

---

## 🎯 Detailed Implementation Recommendations

### **1. Edit Charity UI** ✅ **Can Reuse**

**Source Pattern:** `ProfilePageComponent/EditPersonalInfoModal.tsx`

**Adaptation Steps:**
1. Copy `EditPersonalInfoModal.tsx` structure
2. Create `EditCharityModal.tsx`
3. Replace fields with charity fields:
   ```typescript
   - name (text)
   - description (textarea)
   - category (select)
   - isIslamic (checkbox)
   - doesCharityGiveZakat (checkbox)
   - charityCommissionWebsiteUrl (text)
   - startDate (date picker)
   ```
4. Add to charity detail page dropdown menu
5. Implement API call (when PATCH endpoint available)

**Estimated Effort:** 3-4 hours

---

### **2. Filters Panel for Charities** ✅ **Can Reuse**

**Source Pattern:** `UsersPageComponent/index.tsx` (lines 191-257)

**Adaptation Steps:**
1. Copy filter popover structure
2. Define charity filter keys:
   ```typescript
   const STATUS_KEYS = [
     'Pending Eligibility Review',
     'Unassigned',
     'Open To Review',
     'Pending Admin Review',
     'Approved',
     'Ineligible'
   ]
   
   const CATEGORY_KEYS = [
     'International Relief',
     'Local Relief',
     'Education',
     'Masjid & Community Projects',
     'Health & Medical Aid',
     'Environment & Sustainability',
     'Advocacy & Human Rights'
   ]
   
   const BOOLEAN_FILTERS = {
     'Islamic Charity': true,
     'Gives Zakat': true,
   }
   ```
3. Add date range filter section (new)
4. Integrate with existing search
5. Update API call with filter params

**Estimated Effort:** 4-6 hours

---

### **3. Manage Team Page** ⚠️ **Adapt Pattern**

**Source Pattern:** `AccessControl/ManageRoles.tsx`

**New Component:** `ManageTeamModal.tsx` or dedicated page

**Structure:**
```typescript
// Table showing assigned members
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Member Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Roles</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {members.map(member => (
      <TableRow key={member.id}>
        <TableCell>{member.name}</TableCell>
        <TableCell>{member.email}</TableCell>
        <TableCell>
          {member.roles.map(role => (
            <Badge key={role}>{role}</Badge>
          ))}
        </TableCell>
        <TableCell>
          <Button onClick={() => handleEditRoles(member)}>
            <Edit /> Edit Roles
          </Button>
          <Button onClick={() => handleRemove(member)}>
            <Trash /> Remove
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Modals
<EditMemberRolesModal ... />
<AddMemberModal ... />
<ConfirmRemoveModal ... />
```

**Features to Implement:**
- ✅ View all assigned members
- ✅ Add new member (reuse AssignProjectManager pattern)
- ✅ Edit member roles (multi-select)
- ✅ Remove member (with confirmation)
- ✅ Show role badges

**Estimated Effort:** 8-10 hours

---

### **4. Delete Charity UI** ❌ **Create New**

**No existing pattern - needs to be created**

**Recommended Implementation:**

**Option A: Dropdown Menu Item** (Recommended)
```typescript
// In SingleCharityPageComponent dropdown
{
  value: 'delete-charity',
  label: (
    <div className='flex gap-1 items-center text-red-600'>
      <TrashIcon />
      <span>Delete Charity</span>
    </div>
  )
}

// Handler
const handleDeleteCharity = () => {
  setShowDeleteConfirm(true)
}

// Confirmation Modal
<ConfirmActionModal
  open={showDeleteConfirm}
  onOpenChange={setShowDeleteConfirm}
  onConfirm={async () => {
    await deleteCharity(charityId)
    router.push('/charities')
  }}
  title="Delete Charity"
  description="Are you sure you want to delete this charity? This action cannot be undone."
  confirmText="Delete Charity"
  variant="destructive"
/>
```

**Option B: Dedicated Delete Button**
- Add to charity detail page
- Red/destructive styling
- Same confirmation flow

**Components Needed:**
- `ConfirmActionModal` (already exists in Profile module)
- `TrashIcon` or use lucide-react `Trash2`

**Estimated Effort:** 2-3 hours

---

### **5. Sorting Controls** ❌ **Create New**

**No existing pattern**

**Recommended Implementation:**

```typescript
// Add sort controls to CharitiesPageComponent
<div className="flex gap-2 items-center">
  <Select value={sortBy} onValueChange={setSortBy}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Sort by..." />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="createdAt">Created Date</SelectItem>
      <SelectItem value="name">Name</SelectItem>
      <SelectItem value="updatedAt">Updated Date</SelectItem>
    </SelectContent>
  </Select>
  
  <Button
    size="icon"
    variant="outline"
    onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')}
  >
    {order === 'ASC' ? <ArrowUp /> : <ArrowDown />}
  </Button>
</div>
```

**Estimated Effort:** 2-3 hours

---

### **6. Remove Role Assignment** ❌ **Create New**

**Part of Manage Team feature**

**Implementation:**
```typescript
// In ManageTeamModal
const handleRemoveMember = async (memberId: string) => {
  // API call with remove operation
  await assignCharityRoles(charityId, [{
    userId: memberId,
    remove: ['project-manager', 'finance-auditor', 'zakat-auditor'] // all roles
  }])
  
  // Refresh charity data
  refreshCharity()
}

// Confirmation before remove
<ConfirmActionModal
  title="Remove Team Member"
  description={`Remove ${member.name} from this charity?`}
  confirmText="Remove Member"
  variant="destructive"
  onConfirm={() => handleRemoveMember(member.id)}
/>
```

**Estimated Effort:** Included in Manage Team (above)

---

### **7. Bulk Role Assignment** ⚠️ **Combine Patterns**

**Source Patterns:**
- `BulkEmailModal.tsx` - Multi-select UI
- `AssignProjectManager.tsx` - Role assignment logic

**New Component:** `BulkAssignRolesModal.tsx`

**Structure:**
```typescript
// Multi-select table (from BulkEmailModal)
<TableComponent>
  <Column id="select">
    <Checkbox /> // Select all
  </Column>
  <Column>Member Name</Column>
  <Column>Current Roles</Column>
</TableComponent>

// Role selection (below table)
<div className="mt-4">
  <Label>Assign Roles to Selected Members</Label>
  <MultiSelect
    options={availableRoles}
    value={selectedRoles}
    onChange={setSelectedRoles}
  />
  
  <div className="flex gap-2 mt-2">
    <Button onClick={handleBulkAdd}>
      Add Roles to {selectedMembers.length} Members
    </Button>
    <Button variant="destructive" onClick={handleBulkRemove}>
      Remove Roles from {selectedMembers.length} Members
    </Button>
  </div>
</div>
```

**Estimated Effort:** 6-8 hours

---

## 🔧 Reusable Components Identified

### **Already Exist:**
1. ✅ `EditIcon` - For edit buttons
2. ✅ `FilterIcon` - For filter button
3. ✅ `ConfirmActionModal` - For confirmations
4. ✅ `ModelComponentWithExternalControl` - For modals
5. ✅ `Popover` - For filter panel
6. ✅ `Switch` - For filter toggles
7. ✅ `Select` - For dropdowns
8. ✅ `TableComponent` - For data tables
9. ✅ `Checkbox` - For multi-select

### **Need to Create:**
1. ❌ `TrashIcon` or use lucide-react `Trash2`
2. ❌ `MultiSelect` component (for bulk role assignment)
3. ❌ Sort controls component

---

## 📈 Implementation Priority (Based on Reusability)

### **Phase 1: High Reusability (Low Effort)**
1. **Filters Panel** - Direct copy from Users module (4-6h)
2. **Edit Charity Modal** - Copy from Profile module (3-4h)
3. **Delete Charity** - Use existing ConfirmActionModal (2-3h)

**Total: 9-13 hours**

### **Phase 2: Medium Reusability (Medium Effort)**
4. **Sorting Controls** - New UI component (2-3h)
5. **Manage Team Page** - Adapt from Access Control (8-10h)

**Total: 10-13 hours**

### **Phase 3: Low Reusability (Higher Effort)**
6. **Bulk Role Assignment** - Combine patterns (6-8h)

**Total: 6-8 hours**

---

## 🎯 Summary

### **✅ Can Reuse Directly:**
- Edit UI pattern (Profile module)
- Filters panel (Users module)
- Confirmation modals (Profile module)

### **⚠️ Can Adapt:**
- Manage Team page (from Access Control)
- Bulk assignment (from Bulk Email + Assignment)

### **❌ Must Create New:**
- Delete functionality (no pattern exists)
- Sorting controls (no pattern exists)
- Remove assignment UI (no pattern exists)

### **Total Estimated Effort:**
- **Minimum:** 25 hours (all features)
- **Maximum:** 34 hours (all features)

### **Recommended Approach:**
1. Start with **Phase 1** (high reusability) - 9-13 hours
2. These features have proven patterns and can be implemented quickly
3. Move to Phase 2 & 3 after core API integration is complete
