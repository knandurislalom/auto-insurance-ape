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
│ Actions Available                   │
│ ┌─────────────────────────────────┐ │
│ │ 📞 Contact Support               │ │
│ │ 📄 View Policy Details          │ │
│ │ 🔄 Refresh Status               │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Detailed view of claim status and history
- Actionable items for user
- Clear evidence display
- Contact and support options

---

## Screen 8A: Collision Damage Detection (Post-Submission)

```
┌─────────────────────────────────────┐
│                                  ✕  │
│                                     │
│           🔍                        │
│     Collision Detected!             │
│                                     │
│ Based on your claim details and     │
│ photos, we've identified this as    │
│ a collision-related claim.          │
│                                     │
│ Next Steps Required:                │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📋 Damage Assessment Needed     │ │
│ │                                 │ │
│ │ To process your claim, we need  │ │
│ │ a professional damage estimate. │ │
│ │                                 │ │
│ │ Choose your preferred option:   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏢 Insurance Adjuster Visit     │ │
│ │ We'll send an adjuster to you   │ │
│ │ • Free inspection              │ │
│ │ • 1-2 business days            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔧 Preferred Repair Shop        │ │
│ │ Get estimate from repair shop   │ │
│ │ • Network of trusted shops     │ │
│ │ • Same day estimates           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📱 Digital Assessment           │ │
│ │ Submit additional photos        │ │
│ │ • AI-assisted evaluation       │ │
│ │ • Immediate preliminary est.   │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Clear identification of collision claim type
- Three distinct estimation options
- Benefits and timelines for each option
- User choice to proceed with preferred method

---

## Screen 8B: Schedule Adjuster Visit

```
┌─────────────────────────────────────┐
│ ← Back    Schedule Inspection    ⋯  │
├─────────────────────────────────────┤
│                                     │
│ Schedule Adjuster Visit             │
│                                     │
│ An insurance adjuster will inspect  │
│ your vehicle and provide a          │
│ professional damage estimate.       │
│                                     │
│ Vehicle Location                    │
│ ┌─────────────────────────────────┐ │
│ │ ○ My home address               │ │
│ │   123 Oak Street, Seattle WA    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ○ Incident location             │ │
│ │   Main St & 1st Ave, Seattle   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ○ Different address             │ │
│ │   Enter address...              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Preferred Time                      │
│ ┌─────────────────────────────────┐ │
│ │ 📅 Tomorrow - March 16          │ │
│ │ ⏰ 9:00 AM - 12:00 PM          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📅 March 17 - Friday           │ │
│ │ ⏰ 1:00 PM - 5:00 PM           │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ See more times...               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Contact Information                 │
│ ┌─────────────────────────────────┐ │
│ │ Phone: (206) 555-0123          │ │
│ │ Email: sarah.j@email.com       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │      Schedule Appointment       │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Multiple location options for inspection
- Available time slots with clear scheduling
- Pre-populated contact information
- Easy scheduling confirmation

---

## Screen 8C: Find Repair Shop

```
┌─────────────────────────────────────┐
│ ← Back     Repair Shops Near You ⋯  │
├─────────────────────────────────────┤
│                                     │
│ Preferred Repair Shops              │
│                                     │
│ Choose from our network of          │
│ trusted, certified repair shops:    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏢 Downtown Auto Body           │ │
│ │ ⭐⭐⭐⭐⭐ 4.8 (127 reviews)      │ │
│ │ 📍 0.5 miles away               │ │
│ │ ⏰ Available today              │ │
│ │ 💰 Insurance Direct Pay        │ │
│ │                                 │ │
│ │ [ Get Estimate ] [ Directions ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏢 Precision Collision Center   │ │
│ │ ⭐⭐⭐⭐⭐ 4.6 (89 reviews)       │ │
│ │ 📍 1.2 miles away               │ │
│ │ ⏰ Available tomorrow           │ │
│ │ 💰 Insurance Direct Pay        │ │
│ │ 🏆 Certified BMW/Honda         │ │
│ │                                 │ │
│ │ [ Get Estimate ] [ Directions ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏢 Quick Fix Auto              │ │
│ │ ⭐⭐⭐⭐☆ 4.2 (156 reviews)      │ │
│ │ 📍 2.1 miles away               │ │
│ │ ⏰ Available Mon-Fri            │ │
│ │ 💰 Insurance Direct Pay        │ │
│ │                                 │ │
│ │ [ Get Estimate ] [ Directions ] │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │        Use Different Shop       │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Curated list of network repair shops
- Ratings, distance, and availability
- Direct pay and certification indicators
- Option to choose non-network shop

---

## Screen 8D: Digital Assessment Guide

```
┌─────────────────────────────────────┐
│ ← Back    Digital Assessment     ⋯  │
├─────────────────────────────────────┤
│                                     │
│ AI-Powered Damage Assessment        │
│                                     │
│ Our AI will analyze additional      │
│ photos to provide a preliminary     │
│ damage estimate.                    │
│                                     │
│ ●●○○○ Step 1 of 5                  │
│                                     │
│ 📋 Photo Requirements:              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✅ Overall vehicle view          │ │
│ │ ✅ Close-up of damage            │ │
│ │ ⏳ License plate (clear)         │ │
│ │ ⏳ VIN number (dashboard)        │ │
│ │ ⏳ Damage from multiple angles   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 Tips for Better Photos:          │
│ • Use good lighting (daylight)     │
│ • Keep camera steady               │
│ • Get close to damaged areas       │
│ • Include reference objects        │
│                                     │
│ Current Photos: 3/7 needed         │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [📷] [📷] [📷] [ + ] [ + ]      │ │
│ │ [ + ] [ + ]                     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │      📸 Take License Plate      │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Progress indicator for photo requirements
- Clear checklist of needed photos
- Photography tips for better assessment
- Visual progress of photo completion

---

## Screen 8E: Estimate Submission Confirmation

```
┌─────────────────────────────────────┐
│ ← Back    Estimate Submitted     ⋯  │
├─────────────────────────────────────┤
│                                     │
│           📋                        │
│    Estimate Received!               │
│                                     │
│ Your damage estimate has been       │
│ submitted to your claim.            │
│                                     │
│ Estimate Details                    │
│ ┌─────────────────────────────────┐ │
│ │ Estimate ID: EST-2024-456789    │ │
│ │ Shop: Downtown Auto Body        │ │
│ │ Date: March 16, 2024            │ │
│ │                                 │ │
│ │ Preliminary Amount:             │ │
│ │ $3,247.50                       │ │
│ │                                 │ │
│ │ • Parts: $1,890.00             │ │
│ │ • Labor: $1,200.00             │ │
│ │ • Paint: $157.50               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ What happens next?                  │
│                                     │
│ ●●●●○ Updated Status                │
│                                     │
│ ✅ Claim Submitted     Complete     │
│ ✅ Estimate Received   Complete     │
│ 🔄 Review & Approval   1-2 days     │
│ ⏳ Settlement          3-5 days     │
│ ⏳ Payment             5-7 days     │
│                                     │
│ ℹ️ Note: This is a preliminary      │
│ estimate. Final amount may vary     │
│ after detailed inspection.          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │       View Full Details         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │      Back to Dashboard          │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Clear confirmation of estimate submission
- Detailed breakdown of estimate costs
- Updated claim status timeline
- Disclaimer about preliminary nature
- Options to view more details or return to dashboard

---

## Screen 8F: Enhanced Claim Status with Estimation

```
┌─────────────────────────────────────┐
│ ← Back      Claim Details        ⋯  │
├─────────────────────────────────────┤
│                                     │
│ Claim #CLM-2024-789123             │
│ Filed: March 15, 2024               │
│                                     │
│ Status: Estimate Review 📋          │
│                                     │
│ ●●●●○ Progress                      │
│                                     │
│ Timeline                            │
│ ┌─────────────────────────────────┐ │
│ │ ✅ Mar 15  Claim submitted      │ │
│ │ ✅ Mar 16  Estimate received    │ │
│ │ 🔄 Mar 16  Under review         │ │
│ │ ⏳ Mar 18  Approval pending     │ │
│ │ ⏳ Mar 22  Settlement pending   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Damage Estimates                    │
│ ┌─────────────────────────────────┐ │
│ │ Downtown Auto Body              │ │
│ │ EST-2024-456789                 │ │
│ │ $3,247.50 (Preliminary)         │ │
│ │ Status: Under Review 🔄         │ │
│ │                                 │ │
│ │ [ View Details ]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Actions Available                   │
│ ┌─────────────────────────────────┐ │
│ │ 📋 Add Another Estimate         │ │
│ │ 📞 Contact Adjuster             │ │
│ │ 📄 View Estimate Details        │ │
│ │ 🔄 Check Status Updates         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Adjuster Contact                    │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Mike Thompson                │ │
│ │ 📞 (206) 555-0199              │ │
│ │ 📧 mthompson@insurance.com      │ │
│ │                                 │ │
│ │ [ Contact Adjuster ]            │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

**Key Elements:**
- Enhanced status showing estimation phase
- Estimate details with review status
- Multiple action options for user
- Direct contact information for adjuster
- Ability to add additional estimates

---

## Updated Flow Summary

The enhanced claim intake process now includes:

### Phase 1: Initial Claim Submission (Original Flow)
1. **Dashboard** → Vehicle selection
2. **Parties Involved** → Driver information
3. **Claim Information** → Policy, date, location, description
4. **Damage Photos** → Initial visual evidence
5. **Confirmation** → Submit initial claim

### Phase 2: Collision Damage Assessment (New Addition)
6. **Collision Detection** → AI identifies collision claims requiring estimates
7. **Assessment Options** → Choose estimation method:
   - Insurance adjuster visit
   - Preferred repair shop estimate
   - AI-powered digital assessment
8. **Estimation Process** → Complete chosen assessment method
9. **Estimate Submission** → Professional damage estimate added to claim
10. **Enhanced Tracking** → Updated status with estimation details

### Key Benefits of Enhanced Flow:
- **Automated Detection**: System identifies collision claims requiring estimates
- **User Choice**: Multiple options for damage assessment
- **Professional Accuracy**: Ensures proper damage evaluation by qualified parties
- **Streamlined Process**: Integrates estimation into existing claim workflow
- **Clear Communication**: Transparent status updates and next steps
- **Adjuster Integration**: Direct connection between estimates and claim adjusters

This enhanced flow ensures that collision claims receive the proper professional damage assessment required by insurance companies while maintaining a smooth user experience.