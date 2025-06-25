# Agent Dashboard Wireframes
**Auto Insurance Claim Processing Platform**

## Overview

This document contains detailed wireframes for the Agent Dashboard, designed to optimize claim processor workflows through intelligent prioritization, risk assessment, and performance analytics. The wireframes follow Material Design principles and ensure accessibility compliance.

## Design Principles

### Visual Hierarchy
- **Critical Information First**: High-priority claims and alerts prominently displayed
- **Progressive Disclosure**: Detailed information accessible through drill-down navigation
- **Color-Coded Urgency**: Consistent color scheme for priority and risk levels
- **Scannable Layout**: Information organized for quick visual processing

### Interaction Patterns
- **Keyboard Navigation**: Full keyboard accessibility for power users
- **Bulk Actions**: Efficient multi-select operations for batch processing
- **Context Menus**: Right-click actions for common tasks
- **Smart Defaults**: Intelligent pre-filtering based on user behavior

---

## 1. Main Dashboard - Claims Triage View

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 🏢 Insurance Co.        Agent Dashboard                     👤 John Doe  🔔 (3)  ⚙️ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ 📊 Dashboard  📋 Claims Queue  📈 Analytics  👥 Team  📁 Documents  🔍 Search      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ PRIORITY QUEUE ─────────────────────┐  ┌─ TODAY'S METRICS ─────────────────────┐ │
│ │ 🔴 HIGH PRIORITY (5)                │  │ Claims Processed: 12/20               │ │
│ │ 🟡 MEDIUM PRIORITY (8)              │  │ Avg Processing Time: 23 min           │ │
│ │ 🟢 LOW PRIORITY (15)                │  │ High Risk Flagged: 3                  │ │
│ │ ⚠️  FLAGGED FOR REVIEW (3)           │  │ Efficiency Score: 87%                 │ │
│ └─────────────────────────────────────┘  └───────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ SMART CLAIMS QUEUE ─────────────────────────────────────────────────────────────┐ │
│ │ Filter: [All Claims ▼] [Today ▼] [My Claims ▼]    Search: [_____________] 🔍    │ │
│ │                                                                                 │ │
│ │ Priority │ Claim ID │ Claimant        │ Type      │ Amount  │ Age │ Risk │ Actions│ │
│ │ ──────────────────────────────────────────────────────────────────────────────  │ │
│ │ 🔴 CRIT  │ CLM020   │ Gregory Johnson │ Collision │ $21,300 │ 19d │ ⚠️ 85% │ [View]│ │
│ │ 🔴 HIGH  │ CLM005   │ Amanda Thompson │ Multi-Car │ $18,700 │ 2d  │ 🔍 45% │ [View]│ │
│ │ 🔴 HIGH  │ CLM013   │ Ashley Davis    │ Head-On   │ $19,500 │ 12d │ ⚠️ 72% │ [View]│ │
│ │ 🟡 MED   │ CLM003   │ Jennifer Martinez│ T-Bone   │ $12,500 │ 4d  │ 🔍 38% │ [View]│ │
│ │ 🟡 MED   │ CLM017   │ Nicole Jackson  │ Chain     │ $11,200 │ 16d │ ✅ 15% │ [View]│ │
│ │ 🟢 LOW   │ CLM006   │ David Park      │ Hail      │ $5,600  │ 5d  │ ✅ 12% │ [View]│ │
│ │ 🟢 LOW   │ CLM007   │ Lisa Rodriguez  │ Deer      │ $7,300  │ 8d  │ ✅ 8%  │ [View]│ │
│ │                                                             ... more claims ...  │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ QUICK ACTIONS ──────────────────────┐  ┌─ ALERTS & NOTIFICATIONS ─────────────┐ │
│ │ [📋 Batch Review]  [📤 Escalate]     │  │ ⚠️  3 claims need urgent attention    │ │
│ │ [✅ Approve Selected] [❌ Deny]       │  │ 🔔 New claim CLM021 assigned to you   │ │
│ │ [📞 Contact Claimant] [📧 Send Email]│  │ 🚨 Potential fraud detected: CLM020   │ │
│ └─────────────────────────────────────┘  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Components

**Header Navigation**
- Company branding and main navigation tabs
- User profile with notification badge
- Global search and settings access

**Priority Summary Cards**
- Visual count of claims by priority level
- Color-coded indicators for quick assessment
- Click-through to filtered views

**Smart Claims Queue**
- Advanced filtering and search capabilities
- Sortable columns with priority-based default sorting
- Risk indicators and visual flags
- Bulk selection capabilities

**Contextual Panels**
- Quick action buttons for common tasks
- Real-time alerts and notifications
- Today's performance metrics

---

## 2. Claim Detail View - Risk Assessment

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Queue    Claim CLM020 - Gregory Johnson                    🔄 Refresh     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ CLAIM OVERVIEW ─────────────────────┐  ┌─ RISK ASSESSMENT ─────────────────────┐ │
│ │ Claim ID: CLM020                    │  │ Overall Risk Score: 85%               │ │
│ │ Date: 2025-06-05                    │  │ ┌─────────────────────────────────────┐ │ │
│ │ Location: Columbus, OH              │  │ │ Fraud Indicators:           ⚠️ HIGH │ │ │
│ │ Type: Drunk Driver Collision       │  │ │ ▓▓▓▓▓▓▓▓▓░ 85%                      │ │ │
│ │ Estimated Damage: $21,300          │  │ │                                     │ │ │
│ │ Injuries: Yes                       │  │ │ Complexity Score:          🟡 MED   │ │ │
│ │ Status: Under Review                │  │ │ ▓▓▓▓▓▓░░░░ 60%                     │ │ │
│ │ Assigned: John Doe                  │  │ │                                     │ │ │
│ │ Priority: 🔴 CRITICAL               │  │ │ Time Sensitivity:          🔴 HIGH  │ │ │
│ └─────────────────────────────────────┘  │ │ ▓▓▓▓▓▓▓▓░░ 80%                     │ │ │
│                                          │ └─────────────────────────────────────┘ │ │
│ ┌─ RED FLAGS & ALERTS ────────────────┐  └───────────────────────────────────────┘ │
│ │ 🚨 FRAUD ALERT: Multiple red flags  │                                            │ │
│ │ ⚠️  Late night incident timing       │  ┌─ DOCUMENTS ──────────────────────────┐ │
│ │ ⚠️  High claim value for damage type │  │ 📄 night_accident.jpg        ✅ Valid │ │
│ │ ⚠️  Inconsistent witness statements  │  │ 📋 breathalyzer_report.pdf   ✅ Valid │ │
│ │ ⚠️  Prior claims history             │  │ 🚓 police_arrest.pdf         ✅ Valid │ │
│ │ ⚠️  Claimant in high-risk area       │  │ 🏥 emergency_room.pdf        ✅ Valid │ │
│ │                                     │  │ ─────────────────────────────────────  │ │
│ │ [📊 View Full Analysis]             │  │ AI Analysis: Documents authentic       │ │
│ └─────────────────────────────────────┘  │ No alterations detected               │ │
│                                          │ Cross-reference: ✅ Consistent        │ │
│ ┌─ RECOMMENDED ACTIONS ───────────────┐  └───────────────────────────────────────┘ │
│ │ 1. 🔍 Order investigation            │                                            │ │
│ │ 2. 📞 Contact witness for statement  │  ┌─ CASE NOTES ─────────────────────────┐ │
│ │ 3. 🏥 Verify medical records        │  │ [Add note...                        ] │ │
│ │ 4. ⚖️  Legal review recommended      │  │                                       │ │
│ │ 5. 🚨 Escalate to fraud department   │  │ 2025-06-24 10:30 - Initial review    │ │
│ │                                     │  │ 2025-06-24 11:15 - Fraud flags noted │ │
│ │ [▶️ Execute Action Plan]             │  │ 2025-06-24 14:22 - Escalated to SIU  │ │
│ └─────────────────────────────────────┘  └───────────────────────────────────────┘ │
│                                                                                     │
│ [💾 Save Changes] [📤 Escalate] [❌ Deny Claim] [✅ Approve] [📧 Contact Claimant]  │
└─────────────────────────────────────────────────────────────────────────────────────┘


### Key Components

**Navigation & Context**
- Breadcrumb navigation back to claims queue
- Real-time refresh capability
- Claim identification and processor assignment

**Risk Assessment Dashboard**
- Overall risk score with visual indicator
- Breakdown by risk categories with progress bars
- Color-coded severity levels

**Red Flags Panel**
- Prioritized list of risk indicators
- Expandable detail view for full analysis
- Clear visual hierarchy for critical vs warning items

**Document Management**
- Document list with validation status
- AI-powered authenticity verification
- Cross-reference validation results

**Action Planning**
- AI-recommended next steps
- Executable action plan with tracking
- Case notes with timestamp history

---

## 3. Analytics Dashboard - Performance Metrics

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 📈 Analytics Dashboard                                    📅 Last 30 Days  ⬇️      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ KEY PERFORMANCE INDICATORS ─────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ ┌─ Claims Processed ──┐ ┌─ Avg Resolution ──┐ ┌─ Fraud Detection ─┐ ┌─ Accuracy ──┐ │ │
│ │ │       247          │ │      2.3 days     │ │       94%         │ │     96%     │ │ │
│ │ │   ↗️ +12% vs LM     │ │   ↘️ -0.8 vs LM    │ │   ↗️ +8% vs LM     │ │  ↗️ +2% vs LM│ │ │
│ │ └───────────────────┘ └──────────────────┘ └─────────────────┘ └─────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ PROCESSING TREND ───────────────────────┐  ┌─ RISK DISTRIBUTION ─────────────────┐ │
│ │ Claims/Day                              │  │                                     │ │
│ │    ^                                    │  │ High Risk (15%)     ████░░░░░░      │ │
│ │ 15 |     ●                              │  │ Med Risk (35%)      ████████░░      │ │
│ │ 12 |   ●   ●   ●                        │  │ Low Risk (50%)      ██████████      │ │
│ │  9 | ●   ●   ●                          │  │                                     │ │
│ │  6 |     ●                              │  │ Fraud Detected: 12 claims           │ │
│ │  3 |                                    │  │ False Positives: 2 claims           │ │
│ │  0 +----+----+----+----+----+----+---> │  │ Accuracy Rate: 94.2%                │ │
│ │    Mon  Tue  Wed  Thu  Fri  Sat  Sun   │  └─────────────────────────────────────┘ │
│ └─────────────────────────────────────────┘                                        │
│                                                                                     │
│ ┌─ TEAM PERFORMANCE COMPARISON ────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Agent         │ Claims │ Avg Time │ Accuracy │ Efficiency │ Fraud Detected    │ │ │
│ │ ──────────────────────────────────────────────────────────────────────────────  │ │
│ │ John Doe      │   247  │  2.3d    │   96%    │    ████▓   │     12           │ │ │
│ │ Sarah Smith   │   221  │  2.8d    │   94%    │    ███▓▓   │      8           │ │ │
│ │ Mike Johnson  │   189  │  3.1d    │   92%    │    ███░░   │      6           │ │ │
│ │ Lisa Brown    │   234  │  2.5d    │   95%    │    ████░   │     10           │ │ │
│ │ Team Avg      │   223  │  2.7d    │   94%    │    ███▓░   │      9           │ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ WORKLOAD DISTRIBUTION ──────────────────┐  ┌─ PRIORITY INSIGHTS ────────────────┐ │
│ │                                         │  │                                    │ │
│ │ Current Queue: 28 claims                │  │ High Priority: 5 claims            │ │
│ │                                         │  │ Avg Age: 8.2 days                 │ │
│ │ ███████████████░░░░░ 75% Capacity       │  │                                    │ │
│ │                                         │  │ SLA Compliance: 94%                │ │
│ │ Predicted EOD: 22 claims remaining      │  │ Overdue Claims: 2                  │ │
│ │ Recommendation: Normal pace             │  │                                    │ │
│ └─────────────────────────────────────────┘  └────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Components

**KPI Summary Cards**
- Primary metrics with trend indicators
- Comparison to previous periods
- Visual progress indicators

**Interactive Charts**
- Processing trend visualization
- Risk distribution analysis
- Hover interactions for detailed data

**Team Performance Matrix**
- Comparative analysis across team members
- Visual efficiency indicators
- Sortable columns for different metrics

**Operational Insights**
- Workload capacity indicators
- Predictive analytics for planning
- Priority-based recommendations

---

## 4. Filtered Queue View - High Priority Claims

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Filtered View: High Priority Claims                    🔄 Auto-refresh: ON       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ FILTERS & SEARCH ───────────────────────────────────────────────────────────────┐ │
│ │ Priority: [🔴 High ▼] Type: [All ▼] Date: [Last 30 days ▼] Risk: [>70% ▼]      │ │
│ │ Search: [fraud detection          ] 🔍  [🧹 Clear] [💾 Save Filter]            │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ HIGH PRIORITY QUEUE (5 claims) ─────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ ☑️ │Pri│ ID    │ Claimant      │ Type      │ Amount  │ Age │ Risk │ Flags │ Action │ │
│ │ ───┼───┼───────┼───────────────┼───────────┼─────────┼─────┼──────┼───────┼──────── │ │
│ │ ☑️ │🔴 │CLM020 │Gregory Johnson│Collision  │ $21,300 │ 19d │ 85%  │🚨💀⚠️ │[📋View]│ │
│ │ ☐ │🔴 │CLM005 │Amanda Thompson│Multi-Car  │ $18,700 │  2d │ 45%  │⚠️📋   │[📋View]│ │
│ │ ☐ │🔴 │CLM013 │Ashley Davis   │Head-On    │ $19,500 │ 12d │ 72%  │⚠️🏥   │[📋View]│ │
│ │ ☐ │🔴 │CLM011 │Rachel Brown   │Rollover   │ $22,800 │ 11d │ 38%  │🏥     │[📋View]│ │
│ │ ☐ │🔴 │CLM014 │Chris White    │Fire       │ $16,800 │ 13d │ 55%  │🔥⚠️   │[📋View]│ │
│ │                                                                                 │ │
│ │ 🚨 = Fraud Alert  💀 = High Risk  ⚠️ = Review Needed  🏥 = Injury  🔥 = Property│ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ BULK ACTIONS ───────────────────────────┐  ┌─ PRIORITY INSIGHTS ────────────────┐ │
│ │ Selected: 1 claim                       │  │ Total High Priority: 5              │ │
│ │                                         │  │ Avg Processing Time: 4.2 days       │ │
│ │ [📤 Escalate Selected]                  │  │ SLA Risk: 2 claims                  │ │
│ │ [👁️ Review Selected]                    │  │ Fraud Suspected: 3 claims           │ │
│ │ [📞 Contact Claimants]                  │  │                                     │ │
│ │ [🔄 Reassign to:]  [Team Lead ▼]       │  │ Recommendation:                     │ │
│ │ [📊 Generate Report]                    │  │ • Process CLM020 first (overdue)    │ │
│ └─────────────────────────────────────────┘  │ • Escalate fraud cases immediately  │ │
│                                              └────────────────────────────────────┘ │
│ ┌─ SMART RECOMMENDATIONS ──────────────────────────────────────────────────────────┐ │
│ │ 🤖 AI Suggests:                                                                  │ │
│ │ 1. Review CLM020 first - multiple fraud indicators, claim aging               │ │
│ │ 2. Batch process injury claims (CLM013, CLM011) - similar documentation      │ │
│ │ 3. CLM005 needs immediate attention - fresh claim with complexity markers     │ │
│ │ 4. Schedule review meeting for CLM014 - unusual circumstances detected       │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Components

**Advanced Filtering System**
- Multiple filter criteria with dropdowns
- Search functionality with intelligent matching
- Save and load filter presets

**Enhanced Data Grid**
- Checkbox selection for bulk operations
- Icon-based flag system for quick identification
- Sortable columns with visual indicators

**Bulk Action Panel**
- Context-sensitive action buttons
- Selection count and management
- Batch processing capabilities

**AI-Powered Insights**
- Smart recommendations based on current selection
- Priority-based processing suggestions
- Workload optimization advice

---

## 5. Fraud Detection Alert Modal

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           🚨 FRAUD ALERT - CLM020                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ ┌─ FRAUD DETECTION SUMMARY ────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Confidence Level: 85% HIGH RISK                                                │ │
│ │ Detection Model: Ensemble v2.1                                                 │ │
│ │ Triggered: 2025-06-24 09:15 AM                                                 │ │
│ │                                                                                 │ │
│ │ ┌─ RISK INDICATORS ─────────────────────────────────────────────────────────┐   │ │
│ │ │                                                                           │   │ │
│ │ │ 🔴 Critical Issues:                                                       │   │ │
│ │ │ • Suspicious timing pattern (late night + high value)      Weight: 25%   │   │ │
│ │ │ • Multiple prior claims in 18 months                       Weight: 20%   │   │ │
│ │ │ • Inconsistent damage vs impact description                Weight: 15%   │   │ │
│ │ │                                                                           │   │ │
│ │ │ 🟡 Warning Signs:                                                         │   │ │
│ │ │ • Claimant in statistical high-risk zone                   Weight: 10%   │   │ │
│ │ │ • Unusual witness contact information                      Weight: 10%   │   │ │
│ │ │ • Rapid claim submission (< 2 hours post-incident)         Weight: 8%    │   │ │
│ │ │                                                                           │   │ │
│ │ │ 🟢 Positive Indicators:                                                   │   │ │
│ │ │ • Police report filed immediately                          Weight: -5%   │   │ │
│ │ │ • Hospital records available                               Weight: -3%   │   │ │
│ │ └───────────────────────────────────────────────────────────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ RECOMMENDED ACTIONS ────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Immediate Actions Required:                                                     │ │
│ │ ☐ 1. Flag claim for Special Investigation Unit (SIU)                          │ │
│ │ ☐ 2. Order detailed accident reconstruction                                   │ │
│ │ ☐ 3. Verify witness statements independently                                  │ │
│ │ ☐ 4. Cross-reference with fraud database                                     │ │
│ │ ☐ 5. Legal review for potential criminal referral                            │ │
│ │                                                                                 │ │
│ │ Secondary Actions:                                                              │ │
│ │ ☐ 6. Medical record authentication                                            │ │
│ │ ☐ 7. Background check on claimant                                            │ │
│ │ ☐ 8. Scene analysis and photo verification                                   │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─ ESCALATION WORKFLOW ────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │ Auto-escalate to: [SIU Team ▼]  Notify: [Team Lead ▼] [Legal ▼]              │ │
│ │                                                                                 │ │
│ │ Priority: [🔴 Urgent ▼]  Due Date: [2025-06-26 ▼]                             │ │
│ │                                                                                 │ │
│ │ Notes: [High confidence fraud detection. Multiple risk factors               ] │ │
│ │        [align with known fraud patterns. Immediate investigation            ] │ │
│ │        [recommended before any settlement discussions.                      ] │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ │                   [🚨 Escalate Now] [👁️ Mark for Review] [❌ Dismiss Alert]       │ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Components

**Alert Summary**
- Confidence level with clear risk indicator
- Model version and timestamp for audit trail
- Centralized fraud detection information

**Risk Breakdown**
- Categorized risk indicators with weights
- Color-coded severity levels
- Positive and negative factors clearly distinguished

**Action Planning**
- Prioritized checklist of recommended actions
- Immediate vs secondary action categorization
- Checkbox tracking for completion

**Escalation Workflow**
- Automated routing to appropriate teams
- Configurable priority and due dates
- Rich text notes for context

---

## 6. Mobile View - Condensed Dashboard

```
┌─────────────────────────────┐
│ 🏢 InsuranceCo  👤 📱 ⚙️     │
├─────────────────────────────┤
│                             │
│ ┌─ TODAY'S QUEUE ─────────┐ │
│ │ 🔴 High: 5              │ │
│ │ 🟡 Med: 8               │ │  
│ │ 🟢 Low: 15              │ │
│ │ ⚠️ Flagged: 3            │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ URGENT CLAIMS ─────────┐ │
│ │ CLM020 - Gregory J.     │ │
│ │ 🚨 Fraud Alert          │ │
│ │ $21.3K • 19d • 85%     │ │
│ │ [👁️View] [📤Escalate]   │ │
│ │ ─────────────────────── │ │
│ │ CLM005 - Amanda T.      │ │
│ │ ⚠️ Review Needed        │ │
│ │ $18.7K • 2d • 45%      │ │
│ │ [👁️View] [📞Call]       │ │
│ │ ─────────────────────── │ │
│ │ CLM013 - Ashley D.      │ │
│ │ 🏥 Injury Claim         │ │
│ │ $19.5K • 12d • 72%     │ │
│ │ [👁️View] [📋Review]     │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ QUICK ACTIONS ─────────┐ │
│ │ [📋 All Claims]         │ │
│ │ [📊 My Analytics]       │ │
│ │ [🔍 Search Claims]      │ │
│ │ [📱 Scan Document]      │ │
│ │ [📞 Contact Center]     │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─ ALERTS ───────────────┐ │
│ │ 🔔 3 new notifications  │ │
│ │ 🚨 1 fraud alert        │ │
│ │ ⏰ 2 claims due today   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Key Components

**Compact Navigation**
- Streamlined header with essential controls
- Touch-optimized button sizing

**Priority Summary**
- Condensed queue overview
- Essential metrics at-a-glance

**Urgent Claims List**
- Scrollable list of high-priority items
- Abbreviated claim information
- Touch-friendly action buttons

**Quick Access Panel**
- Common actions for mobile workflows
- Integration with device capabilities (camera for document scanning)

**Alert Dashboard**
- Notification summary with badges
- Priority-based alert categorization

## Design System Guidelines

### Color Palette
- **Critical/High Priority**: #D32F2F (Red)
- **Medium Priority**: #F57C00 (Orange)
- **Low Priority**: #388E3C (Green)
- **Fraud Alert**: #B71C1C (Dark Red)
- **Success**: #2E7D32 (Dark Green)
- **Warning**: #F9A825 (Amber)
- **Info**: #1976D2 (Blue)

### Typography
- **Headers**: Roboto Medium, 24px/20px/16px
- **Body Text**: Roboto Regular, 14px
- **Labels**: Roboto Medium, 12px
- **Captions**: Roboto Regular, 11px

### Spacing
- **Grid Unit**: 8px base unit
- **Component Padding**: 16px standard, 24px large
- **Element Margins**: 8px small, 16px medium, 24px large

### Icons
- Material Design Icons 24px standard
- Consistent usage across components
- Color-coded based on context and severity

### Responsive Breakpoints
- **Mobile**: 0-599px
- **Tablet**: 600-959px
- **Desktop**: 960px+
- **Large Desktop**: 1200px+

### Accessibility Features
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus indicators on all interactive elements
- Alt text for all images and icons