# Wireframes & User Interface Design
## Mobile Auto Insurance Claim Intake App

### Design Principles
- **Mobile-First:** Optimized for mobile devices with responsive scaling
- **Progressive Disclosure:** Reveal information progressively to avoid overwhelming users
- **Clear Navigation:** Always show current step and provide easy back/forward navigation
- **Visual Hierarchy:** Use typography, color, and spacing to guide user attention
- **Accessibility:** High contrast, large touch targets, screen reader compatible

---

## Screen 1: Dashboard (Home)

```
┌─────────────────────────────────────┐
│ ☰  Insurance Dashboard         👤  │
├─────────────────────────────────────┤
│                                     │
│ Good morning, Sarah! 👋             │
│                                     │
│ Your Vehicles                       │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  🚗 [Car Image]                │ │
│ │  2020 Honda Accord             │ │
│ │  License: ABC-123              │ │
│ │                                │ │
│ │  [ + Add a Claim ]             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  🚙 [SUV Image]                │ │
│ │  2018 Toyota RAV4              │ │
│ │  License: XYZ-789              │ │
│ │                                │ │
│ │  [ + Add a Claim ]             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Quick Actions                       │
│ • View existing claims              │
│ • Policy documents                  │
│ • Contact support                   │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Personalized greeting with user name
- Vehicle cards with photos and key info
- Prominent "Add a Claim" CTA on each vehicle
- Quick action links for common tasks
- Clean, card-based layout

---

## Screen 2: Step 1 - Parties Involved

```
┌─────────────────────────────────────┐
│ ← Back          Step 1 of 4      ⋯  │
├─────────────────────────────────────┤
│                                     │
│ Parties Involved                    │
│                                     │
│ ●●○○ Progress                       │
│                                     │
│ Who was involved in this incident?  │
│                                     │
│ Driver 1 (You)                      │
│ ┌─────────────────────────────────┐ │
│ │ Sarah Johnson                   │ │
│ │ License: DL123456789           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ + Add Another Driver            │ │
│ └─────────────────────────────────┘ │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │         Next Step               │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Clear step indicator (1 of 4)
- Progress bar showing completion
- Pre-populated user information
- Expandable section for additional drivers
- Primary action button at bottom

---

## Screen 3: Add Another Driver (Modal/Overlay)

```
┌─────────────────────────────────────┐
│                                  ✕  │
│ Add Another Driver                  │
│                                     │
│ Driver Name                         │
│ ┌─────────────────────────────────┐ │
│ │ Enter full name                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ License Number                      │
│ ┌─────────────────────────────────┐ │
│ │ Enter license number            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Relationship to You                 │
│ ┌─────────────────────────────────┐ │
│ │ Select relationship ▼           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Insurance Information               │
│ ○ Same insurance as me              │
│ ○ Different insurance               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │          Add Driver             │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Modal overlay for focused input
- Clear form fields with labels
- Radio buttons for insurance selection
- Validation before allowing addition

---

## Screen 4: Step 2 - Claim Information

```
┌─────────────────────────────────────┐
│ ← Back          Step 2 of 4      ⋯  │
├─────────────────────────────────────┤
│                                     │
│ Claim Information                   │
│                                     │
│ ●●●○ Progress                       │
│                                     │
│ Policy Number                       │
│ ┌─────────────────────────────────┐ │
│ │ POL-2024-123456                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ When did this happen?               │
│ ┌─────────────────────────────────┐ │
│ │ 📅 Select date                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Where did this happen?              │
│ ┌─────────────────────────────────┐ │
│ │ 📍 Enter address or use GPS     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Brief Description                   │
│ ┌─────────────────────────────────┐ │
│ │ Describe what happened...       │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ 0/500 characters                    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │         Next Step               │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Pre-populated policy number
- Date picker with calendar interface
- Address input with GPS option
- Text area with character counter
- Form validation before proceeding

---

## Screen 5: Step 3 - Attach Damage Photos

```
┌─────────────────────────────────────┐
│ ← Back          Step 3 of 4      ⋯  │
├─────────────────────────────────────┤
│                                     │
│ Attach Damage Photos                │
│                                     │
│ ●●●● Progress                       │
│                                     │
│ Tap on damaged areas to add photos  │
│                                     │
│     ┌─────────────────────────┐     │
│     │         🚗              │     │
│     │    ┌─────────────┐      │     │
│     │ ●  │             │  ●   │     │
│     │    │    FRONT    │      │     │
│     │    │             │      │     │
│     │    └─────────────┘      │     │
│  ●  │ ┌─────────────────────┐ │  ●  │
│     │ │       SIDE          │ │     │
│     │ └─────────────────────┘ │     │
│     │    ┌─────────────┐      │     │
│     │    │    REAR     │      │     │
│     │ ●  │             │  ●   │     │
│     │    └─────────────┘      │     │
│     └─────────────────────────┘     │
│                                     │
│ Photos Added: 3                     │
│ ┌─────────────────────────────────┐ │
│ │ [📷] [📷] [📷]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │      📷 Add Another Photo       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │         Next Step               │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Interactive car diagram with hotspots
- Visual indication of damaged areas
- Photo count and thumbnail preview
- Option to add additional photos
- Clear progression to next step

---

## Screen 6: Photo Capture Interface

```
┌─────────────────────────────────────┐
│                                  ✕  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │        CAMERA VIEWFINDER        │ │
│ │                                 │ │
│ │                                 │ │
│ │                                 │ │
│ │                                 │ │
│ │         🎯                      │ │
│ │                                 │ │
│ │                                 │ │
│ │                                 │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 Tip: Get close to damage for     │
│    clear photos                     │
│                                     │
│ 🖼️  📸  🔄                         │
│Gallery Capture Flip                │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Full-screen camera interface
- Helpful tips for better photos
- Options for gallery, capture, and camera flip
- Clear target indicator for framing

---

## Screen 7: Step 4 - Confirm and Submit

```
┌─────────────────────────────────────┐
│ ← Back          Step 4 of 4      ⋯  │
├─────────────────────────────────────┤
│                                     │
│ Confirm Your Claim                  │
│                                     │
│ ●●●● Progress                       │
│                                     │
│ Policy Information                  │
│ ┌─────────────────────────────────┐ │
│ │ Policy: POL-2024-123456         │ │
│ │ Driver: Sarah Johnson           │ │
│ │ Vehicle: 2020 Honda Accord      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Incident Details                    │
│ ┌─────────────────────────────────┐ │
│ │ Date: March 15, 2024            │ │
│ │ Location: 123 Main St, Seattle  │ │
│ │ Description: Rear-ended at...   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Evidence                            │
│ ┌─────────────────────────────────┐ │
│ │ 📷 3 photos attached            │ │
│ │ [thumbnail] [thumbnail] [thumb] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ✓ All required information provided │
│ ✓ Damage photos attached            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        🚀 Submit Claim          │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Complete summary of all entered data
- Visual checklist of requirements
- Photo thumbnails for verification
- Prominent submit button
- Edit options for each section

---

## Screen 8: Success & Status Tracker

```
┌─────────────────────────────────────┐
│                                  ✕  │
│                                     │
│           ✅                        │
│     Claim Submitted!                │
│                                     │
│ Your claim has been successfully    │
│ submitted and assigned:             │
│                                     │
│ Claim #: CLM-2024-789123           │
│                                     │
│ What happens next?                  │
│                                     │
│ ●●●○○ Status Tracker               │
│                                     │
│ ✅ Submitted        Today           │
│ 🔄 Under Review     1-2 days        │
│ 📋 Assessment       3-5 days        │
│ 💰 Settlement       5-10 days       │
│ ✅ Complete         ~2 weeks        │
│                                     │
│ We'll send updates to:              │
│ sarah.johnson@email.com             │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │       View Claim Details        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │      Start Another Claim        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        Back to Dashboard        │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Clear success confirmation
- Unique claim number
- Visual status tracker with timeline
- Email confirmation notice
- Next action options

---

## Screen 9: Claim Status Detail View

```
┌─────────────────────────────────────┐
│ ← Back      Claim Details        ⋯  │
├─────────────────────────────────────┤
│                                     │
│ Claim #CLM-2024-789123             │
│ Filed: March 15, 2024               │
│                                     │
│ Status: Under Review 🔄             │
│                                     │
│ ●●●○○ Progress                      │
│                                     │
│ Timeline                            │
│ ┌─────────────────────────────────┐ │
│ │ ✅ Mar 15  Claim submitted      │ │
│ │ 🔄 Mar 16  Review started       │ │
│ │ ⏳ Mar 18  Assessment pending   │ │
│ │ ⏳ Mar 22  Settlement pending   │ │
│ │ ⏳ Mar 29  Complete pending     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Claim Details                       │
│ ┌─────────────────────────────────┐ │
│ │ Vehicle: 2020 Honda Accord      │ │
│ │ Policy: POL-2024-123456         │ │
│ │ Incident: March 15, 2024        │ │
│ │ Location: 123 Main St, Seattle