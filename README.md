# TDTL CRM - Comprehensive Project Overview

This repository contains the **TDTL CRM** application, a robust Customer Relationship Management system designed to seamlessly manage Leads, Customers, Contacts, internal tasks, and team productivity. It uses a modern JavaScript frontend and a Python backend.

---

## 🏗 Tech Stack

- **Frontend Environment**: React.js 19, built and bundled with Vite. 
- **Frontend Styling**: TailwindCSS for utility-first styling and Lucide-React for modern icons.
- **Frontend Routing**: React Router v7.
- **Backend Framework**: Django & Django Rest Framework (DRF).
- **Database**: SQLite (default configuration, easily translatable to PostgreSQL/MySQL in production).
- **API Communication**: REST API consumed via Axios on the frontend.

---

## 🗄️ Core Data Models & Entities

The application's core logic is located in the backend's `sales` application. The major entities are:

1. **Lead**: 
   - Tracks potential clients. Records Contact Name, Company, Industry, Email, Contact Number, Meeting Dates, Status, Outcome, and Closures. Leads are assigned to an Account Executive (AE).
2. **Customer**:
   - Upgraded from Leads, representing active relationships. Stores extensive details like GST Numbers, Websites, Addresses, Status, and ownership mappings.
3. **Contact**:
   - Represents individual persons associated with a `Customer`. Tracks Name, Job Title, Mobile, Email, and Lead Source.
4. **Call & Meeting**:
   - Used for scheduling and tracking interactions with either a `Lead` or a `Customer`. Logs the status (Scheduled, In Progress, Closed) and the outcome.
5. **Todo**:
   - Task management system for internal tracking. Tasks can have Priorities, Due Dates, Reminders, and can be delegated between users.
6. **Message**:
   - Tracks Inbound and Outbound communications via platforms like WhatsApp and Email.
7. **EOD Report (End of Day Report)**:
   - For internal performance tracking. Tracks evening actuals (Calls done, Emails sent, Meetings attended) versus daily targets.

---

## 💻 Frontend Architecture

The frontend is a Single Page Application (SPA) located in the `/frontend` directory.

- **Component Library**: Includes a generic, reusable `DataTable.jsx` for all tabular displays (which features pagination, search, sorting, and indexing), `Sidebar.jsx`, and `Navbar.jsx`.
- **Pages**:
  - `Dashboard`: The main landing view.
  - `Leads`, `Customer`, `Contacts`: Hubs for exploring CRM models.
  - `Calls`, `Meetings`, `Todos`: Hubs for task and schedule management.
  - `Inbox`, `Calendar`: Unified view of interactions.
  - `AdminApprovals`, `AdminEODReports`: Management views.
- **State Management & Auth**: Managed by a custom `AuthContext` providing token-based auth. Unauthenticated users are redirected by `ProtectedRoutes`.
- **API Layer**: Centralized in `apiClient.js` using Axios, configured with an interceptor to automatically attach authorization tokens.

---

## 🌐 Deployment Configuration

The application is configured to run smoothly in a live environment, specifically set up to host the frontend out of a subpath.

### Configuration Details:
- **Backend API URL**: The frontend is natively configured to push all data to the live deployment server at: `https://tdtlworld.com/crmtdtl-backend/api/`
- **Frontend Deployment Path**: 
  - The application is configured to be hosted under the `/crmtdtl` sub-directory. 
  - `vite.config.js` sets the `base` to `/crmtdtl/`.
  - `React Router`'s `BrowserRouter` is scoped with `basename="/crmtdtl"`.

### Frontend Build Process
To generate the production-ready frontend:
```bash
cd frontend
npm install
npm run build
```
This generates a `dist` folder. Simply upload the contents of the `dist` folder to your server's `/crmtdtl` path.

### Local Development Start
If you need to test locally:
1. **Frontend**: `npm start` (This will automatically pop open the browser window).
2. **Backend**: Activate your virtual environment and run `python manage.py runserver`.

---

## ✨ Recent Enhancements

- **Serial Numbering**: Added an auto-incrementing `Sr. No.` column across paginated tables via the generic `DataTable` layout.
- **Form Integrity**: Locked down specific Lead identifiers (`Industry`, `Contact Name`, `Company Name`) on the Edit screens to ensure data consistency once a Lead is created.
- **Quick-Start Dev**: Wired `npm start` to automatically open the frontend in a development browser.
- **Dependency Tracking**: Provided discrete `requirements.txt` generation across both Python and Node.js environments.