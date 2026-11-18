# SaaSify Pro — Subscription Management & Admin Panel

A comprehensive, production-ready **SaaS Subscription Management & Admin Platform** built with **Next.js 14+ (App Router)**, **TypeScript**, and **Tailwind CSS**.

Featuring real-time state synchronization, dynamic revenue analytics (MRR), subscriber lifecycle controls, plan configuration manager, payment approval workflows (supporting Uzcard, Humo, Click, Payme, Stripe, Wire), and an integrated frontend user upgrade flow.

---

## 🚀 Key Highlights & Architecture

### 1. Unified React State & LocalStorage Persistence (`src/context/SubscriptionContext.tsx`)
- **Real-Time State Synchronization**: All changes made in `/admin` (e.g. approving a subscription request, extending days, changing plans) immediately reflect in real time across the user application without page reloads.
- **Rich Initial Mock Dataset**:
  - **14 Realistic Users**: Mixed statuses (`active`, `expiring_soon`, `expired`, `suspended`), realistic personas (Alisher Navoiy, Malika Karimova, etc.).
  - **4 Subscription Tiers**: Free Starter, Pro Monthly, Pro Annual (Save 35%), and Founder Lifetime.
  - **5 Pending Approval Requests**: Real-world payment slips (Click, Payme, Uzcard, Humo, Wire transfer) with transaction reference IDs.
  - **16+ Ledger Transactions**: Historical invoices with USD and UZS amounts, payment gateway tags, and status tracking.
  - **Audit & Activity Feed**: Chronological log of administrative actions.

---

## 📂 Admin Panel Routes (`/admin`)

| Route | Page | Purpose & Features |
|---|---|---|
| `/admin` | **Overview & Analytics** | 4 Dynamic KPI metric cards (MRR in USD & UZS, Active Subscribers, Pending Requests, Expiring in 7 Days), 6-month Revenue Growth bar chart, Plan Distribution breakdown, and live Activity Feed. |
| `/admin/subscriptions` | **Subscriptions & Users** | Advanced data table with search, status filters (`Active`, `Expiring Soon`, `Expired`, `Suspended`), Auto-Renew switches, Extension modal (+7, +30, +365 days), Plan change modal, and detailed User Inspector drawer. |
| `/admin/requests` | **Payment Review & Approvals** | Dedicated manual payment review queue for local transfers (Click, Payme, Uzcard, Humo). Features interactive receipt slip inspection, **One-Click "Approve & Activate"**, and **"Reject with Reason"**. |
| `/admin/plans` | **Plans & Pricing Manager** | Manage subscription tiers: pricing in USD & UZS, duration days, feature checklist editor, "Most Popular" badge toggle, and **Create New Plan** modal. |
| `/admin/transactions` | **Transactions & Billing** | Complete audit ledger with filter by status (`Completed`, `Pending`, `Refunded`, `Failed`), **1-Click Export to CSV**, and **Issue Refund** with optional access revocation. |

---

## 🔄 How to Test the End-to-End Workflow

1. **User Side (`/`)**:
   - In the Navbar, click **"Upgrade to Pro"** (or use the simulated persona dropdown to switch between Free and Pro users).
   - Select **Pro Annual** or **Pro Monthly**.
   - Pick a payment provider (e.g. **Payme**, **Click**, or **Uzcard**).
   - Review merchant account details (`8600 3124 9918 4512`) and click **"Submit Payment for Approval"**.

2. **Admin Side (`/admin/requests`)**:
   - Navigate to `/admin/requests` (or click the alert notification in the top bar).
   - View the newly submitted request in the **Pending** queue.
   - Click **"Receipt"** to inspect the verified transaction slip and reference number.
   - Click **"Approve & Activate"**.

3. **Instant Sync Verification**:
   - Return to the Main App (`/`) — notice the user's status immediately switches to **Active Pro** with expiration date and unlocked courses!
   - In `/admin`, notice the **MRR** has dynamically increased and a new invoice is added to `/admin/transactions`.
