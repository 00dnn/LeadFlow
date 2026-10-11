# LeadFlow — Sales Lead & Appointment Management System

> **Course:** Software Design Principles and Patterns  
> **Project Type:** University Group Term Project / SaaS Architectural Case Study  
> **Tech Stack:** Pure Vanilla HTML5, CSS3, and modern JavaScript (ES6+ Modules)  
> **Persistence:** Browser `localStorage` (Zero external dependencies or frameworks)  
> **Repository:** [https://github.com/00dnn/LeadFlow](https://github.com/00dnn/LeadFlow)

---

## 1. Project Overview

**LeadFlow** is a modern, responsive web application engineered for high-velocity sales organizations. It implements a closed-loop collaboration workflow connecting two core sales roles:

1. **Appointment Setters:** Inbound and outbound representatives who qualify prospects, create consultation appointments, and assign them to dedicated closers.
2. **Closers (Account Executives):** Specialists who conduct discovery sessions, advance deal pipeline stages, record outcome notes, and close deals.

Every interaction, status transition, and outcome note is immutably appended to a chronological **Lead Audit History**. When a closer updates an assigned lead, the setter instantly observes the updated status and notes upon switching accounts or refreshing the dashboard.

```
┌─────────────────────────┐          Assigns Lead          ┌─────────────────────────┐
│   Appointment Setter    │ ─────────────────────────────> │         Closer          │
│ (Sarah Jenkins, Marcus) │                                │  (Alex Rivera, Elena)   │
└─────────────────────────┘                                └─────────────────────────┘
             ▲                                                          │
             │              Updates Status & Outcome Notes              │
             └──────────────────────────────────────────────────────────┘
```

---

## 2. Complete Project Folder Structure

The project follows a clean, modular directory structure aligned with the **Model-View-Controller (MVC)** and **Layered Architecture** patterns:

```
LeadFlow/
├── index.html                           # Semantic HTML5 entry document & accessible UI shell
├── server.ps1                           # Lightweight PowerShell static server (zero npm setup)
├── LFlow_Structural_Diagram.puml        # PlantUML structural design class diagram
├── README.md                            # Complete architectural & technical documentation
├── css/
│   └── styles.css                       # Modern SaaS design system with CSS custom properties
├── js/
│   ├── app.js                           # Composition root & Dependency Injection bootstrapper
│   ├── core/
│   │   ├── Constants.js                 # LeadStatus, UserRoles, ServiceOptions, StorageKeys
│   │   └── EventEmitter.js              # Observer / Publish-Subscribe pattern implementation
│   ├── models/
│   │   ├── User.js                      # User domain entity with role helper methods
│   │   ├── Lead.js                      # Lead domain entity with encapsulated audit logic
│   │   └── HistoryEntry.js              # Immutable audit trail record entity
│   ├── repositories/
│   │   ├── ILeadRepository.js           # Abstract repository interface contract (DIP)
│   │   └── LocalStorageLeadRepository.js# Browser localStorage concrete realization
│   ├── services/
│   │   ├── UserService.js               # Demo accounts & simulated authentication service
│   │   └── LeadService.js               # Business logic, validation, permissions, statistics
│   ├── controllers/
│   │   ├── AppController.js             # Master controller, user switcher, app lifecycle
│   │   ├── DashboardController.js       # KPI metrics cards, responsive table, search & filters
│   │   └── ModalController.js           # Create Lead modal, Lead Details & Closer update form
│   ├── utils/
│   │   ├── Sanitizer.js                 # XSS prevention, entity encoding, safe formatting
│   │   ├── DateFormatter.js             # Human-friendly dates, 12h times, and relative timestamps
│   │   └── Toast.js                     # Floating feedback alerts (success, error, warning)
│   └── data/
│       └── seedData.js                  # Realistic demo leads across all stages with full histories
```

---

## 3. Demo Accounts & Role Permissions

LeadFlow provides four preconfigured demo accounts to simulate realistic multi-user operations:

| User Name | Role | ID | Email | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Sarah Jenkins** | Appointment Setter | `setter-1` | `sarah.jenkins@leadflow.io` | Create appointments; View leads submitted by Sarah; View closer outcome history. |
| **Marcus Vance** | Appointment Setter | `setter-2` | `marcus.vance@leadflow.io` | Create appointments; View leads submitted by Marcus; View closer outcome history. |
| **Alex Rivera** | Closer | `closer-1` | `alex.rivera@leadflow.io` | View leads assigned to Alex; Update deal statuses; Record outcome notes. |
| **Elena Rostova** | Closer | `closer-2` | `elena.rostova@leadflow.io` | View leads assigned to Elena; Update deal statuses; Record outcome notes. |

*Note on Client-Side Security:* Account switching via the header dropdown is a simulation mechanism engineered for university demonstration and grading purposes without requiring an external OAuth or backend authentication provider.

---

## 4. Software Architecture & Design Patterns

### 4.1 Layered Architecture
LeadFlow segregates concerns across distinct architectural layers:

```
┌────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                   │
│           (index.html, styles.css, DOM Views)          │
└────────────────────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                    CONTROLLER LAYER                    │
│   (AppController, DashboardController, ModalController)│
└────────────────────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                      │
│            (LeadService, UserService)                  │
└────────────────────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                     │
│    (ILeadRepository  <--  LocalStorageLeadRepository)  │
└────────────────────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                  DOMAIN / MODEL LAYER                  │
│             (Lead, User, HistoryEntry)                 │
└────────────────────────────────────────────────────────┘
```

### 4.2 Software Design Patterns

1. **Repository Pattern (`ILeadRepository`, `LocalStorageLeadRepository`)**  
   Decouples business logic from persistence technologies. The service layer interacts exclusively with domain entities (`Lead`) without any direct coupling to `window.localStorage` APIs. If the application later migrates to an IndexedDB or REST API backend, only a new repository subclass needs to be provided.
2. **Observer / Publish-Subscribe Pattern (`EventEmitter`)**  
   Enables loose coupling between components. When `LeadService` creates or updates a lead, it emits `lead:created` or `lead:updated`. Subscribed controllers (`DashboardController`, `ModalController`) respond reactively by refreshing the metrics cards and tables without tight circular references.
3. **Factory Method Pattern (`fromJSON` in `Lead`, `User`, `HistoryEntry`)**  
   Encapsulates the instantiation and validation logic required to reconstitute domain model instances from deserialized JSON objects.
4. **Model-View-Controller (MVC) Pattern**  
   - **Model:** `Lead`, `User`, `HistoryEntry` encapsulate application data and domain validation.
   - **View:** Declarative HTML5 structures and CSS presentation rules.
   - **Controller:** `AppController`, `DashboardController`, and `ModalController` handle DOM events, bind user interactions, and coordinate updates.
5. **Dependency Injection (Composition Root in `app.js`)**  
   Dependencies are injected through constructors rather than instantiated globally inside modules.

---

## 5. Application of SOLID Principles

| Principle | Architectural Implementation in LeadFlow |
| :--- | :--- |
| **Single Responsibility (SRP)** | Each class has exactly one reason to change: `LocalStorageLeadRepository` manages storage serialization, `LeadService` applies business rules and assignment permissions, `Sanitizer` handles XSS mitigation, and `DashboardController` manages table rendering. |
| **Open/Closed Principle (OCP)** | Adding a new storage strategy (e.g. `IndexedDbLeadRepository`) requires implementing `ILeadRepository` without modifying existing `LeadService` code. Lead statuses and services are defined via extensible constant tables. |
| **Liskov Substitution (LSP)** | `LocalStorageLeadRepository` implements all methods defined in `ILeadRepository`. Any consumer expecting `ILeadRepository` functions interchangeably without breaking runtime guarantees. |
| **Interface Segregation (ISP)** | Client interfaces are compact and focused. Contracts define only the essential operations required for lead persistence and event management. |
| **Dependency Inversion (DIP)** | High-level business logic (`LeadService`) does **not** depend on low-level storage details (`localStorage`). Instead, `LeadService` depends on the abstraction (`ILeadRepository`), which is injected during initialization. |

---

## 6. Validation and Security Guardrails

- **Defensive XSS Sanitization (`Sanitizer.escapeHTML`):**  
  All customer input (names, emails, notes, phone numbers) is rigorously escaped before being inserted into the DOM, preventing Cross-Site Scripting vulnerabilities.
- **Form Input Validation:**  
  Customer name requires a minimum of 2 characters; phone numbers require at least 7 digits; emails are validated against RFC syntax when provided; appointment dates, times, and closer assignments are strictly enforced.
- **Role-Based Permission Enforcement:**  
  - Only Appointment Setters can schedule appointments.
  - Only the **assigned Closer** can update the status and record outcomes for a specific lead.
  - Setters and other closers see informative, read-only notices explaining permission boundaries.
- **Persistence Fault Tolerance:**  
  Storage operations are wrapped in `try/catch` blocks that handle quota errors (`QuotaExceededError`) and corrupted entries gracefully.

---

## 7. How to Run the Application in VS Code

Because LeadFlow is built using standard **ES6 Modules**, modern browsers require an HTTP server (to prevent browser `CORS / file://` security restrictions on JavaScript module imports). **No Node.js build process, webpack, or npm install is required.**

### Option A: VS Code Live Server Extension (Recommended)
1. Open VS Code.
2. Select **File > Open Folder...** and choose the `LeadFlow` project folder.
3. Install the **Live Server** extension by Ritwick Dey (if not already installed).
4. Right-click [`index.html`](file:///c:/LeadFlow/index.html) in the VS Code file explorer.
5. Select **"Open with Live Server"**.
6. The application will launch automatically at `http://127.0.0.1:5500/` or `http://localhost:5500/`.

### Option B: PowerShell Static Server (Built-in, Zero Installs)
LeadFlow includes a native PowerShell HTTP server script ([`server.ps1`](file:///c:/LeadFlow/server.ps1)) that requires no external dependencies:
1. Open PowerShell in the `LeadFlow` directory:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\server.ps1 -port 8080
   ```
2. Open your browser and navigate to:  
   **`http://localhost:8080/`**

### Option C: Python HTTP Server (If Python is installed)
```bash
python -m http.server 8080
```
Open **`http://localhost:8080/`** in your browser.

### Option D: Node `npx serve` (If Node is installed)
```bash
npx serve .
```

---

## 8. Functional Testing Checklist

Use this checklist during demonstrations, peer reviews, or grading:

- [ ] **1. Initial Load & Seed Data:**
  - Open the application.
  - Verify Sarah Jenkins (Appointment Setter) is selected by default.
  - Verify the 4 KPI cards display: Total Submitted, Pending Outreach, Follow-ups Required, and Deals Won.
  - Verify the table renders 4 pre-seeded leads submitted by Sarah.
- [ ] **2. Search & Filtering:**
  - Type `Chen` into the search box. Verify that only Danielle Chen appears.
  - Click **Clear**; verify the full list restores.
  - Select `Pending` in the status dropdown; verify only Pending appointments are displayed.
  - Return the dropdown to `All Statuses`.
- [ ] **3. Appointment Creation (Setter Role):**
  - Click the **"+ New Appointment"** button.
  - Enter:
    - Customer Name: `Acme Innovations`
    - Phone Number: `(555) 888-9999`
    - Email: `info@acme.io`
    - Service Interest: `AI Workflow Automation`
    - Appointment Date & Time
    - Assigned Closer: `Alex Rivera`
    - Qualification Notes: `Urgent requirement for document parsing.`
  - Click **Create Appointment**.
  - Verify a green success toast appears, the modal closes, the new lead appears at the top of the table, and the "Total Submitted" KPI increments.
- [ ] **4. Lead Details & Timeline Inspection:**
  - Click **"View Details"** on `Acme Innovations`.
  - Confirm the customer details grid renders accurately.
  - Confirm the read-only notice indicates Sarah submitted the lead and Alex Rivera is assigned.
  - Verify the **Audit History & Timeline** displays the creation event with Sarah's name, role, timestamp, and notes.
  - Close the modal.
- [ ] **5. Role Switching & Closer Dashboard:**
  - In the top header dropdown, switch user to **"Alex Rivera — Closer"**.
  - Notice the header badge updates to green ("Closer").
  - Notice the workspace banner switches to **"Closer Workspace: Alex Rivera"**.
  - Notice the KPI metrics re-calculate for Alex's assigned leads.
  - Notice the "+ New Appointment" button is hidden (closers do not set appointments).
  - Verify `Acme Innovations` is present in Alex's list.
- [ ] **6. Status Advancement & Outcome Recording:**
  - Click **"Update & History"** on `Acme Innovations`.
  - Verify the **"Update Lead Outcome"** interactive form is active.
  - Change New Status to **"Interested"**.
  - Enter Outcome Notes: `Completed 30-min discovery call. Customer approved demonstration next Tuesday.`
  - Click **"Save Status Update"**.
  - Verify a green toast confirms the update.
  - Verify the timeline updates immediately with Alex Rivera's entry, showing the transition `Pending → Interested` and the outcome note.
  - Close the modal.
- [ ] **7. Cross-Role Synchronization (Closed Feedback Loop):**
  - Switch back to **"Sarah Jenkins — Appointment Setter"**.
  - Observe `Acme Innovations` in Sarah's table: its status badge now reflects **Interested**.
  - Click **"View Details"** on `Acme Innovations`: open the timeline and confirm Alex Rivera's update and notes are clearly visible to Sarah!
- [ ] **8. Data Persistence (Refresh Test):**
  - Refresh the browser (`F5` or `Ctrl+R`).
  - Confirm all newly created appointments and updated audit histories persist intact from `localStorage`.
- [ ] **9. Reset Demo Data:**
  - Click the **"Reset Demo"** button in the header.
  - Confirm the browser dialog.
  - Verify the dataset resets cleanly to the 8 standard demo records.
- [ ] **10. Responsive Design:**
  - Open Chrome/Edge Developer Tools (`F12`) and toggle Mobile Device View (`Ctrl+Shift+M`).
  - Verify the desktop table adapts into a clean, mobile-friendly card layout with full touch usability.

---

## 9. Structural UML Class Diagram

The complete PlantUML specification is stored in [`LFlow_Structural_Diagram.puml`](file:///c:/LeadFlow/LFlow_Structural_Diagram.puml).

```
+---------------------------------------------------------------------------------------+
|                                    LeadFlow Classes                                   |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  <<Enumeration>> LeadStatus: PENDING, CONTACTED, INTERESTED, FOLLOW_UP, etc.          |
|                                                                                       |
|  User: id, name, role, email, avatar                                                  |
|                                                                                       |
|  HistoryEntry: id, timestamp, userId, userName, userRole, fromStatus, toStatus, note  |
|                                                                                       |
|  Lead: id, customerName, phoneNumber, email, serviceInterest, appointmentDate,        |
|        appointmentTime, setterId, closerId, status, notes, history                    |
|        + addNote(note, user)                                                          |
|        + updateStatus(newStatus, note, user)                                          |
|                                                                                       |
|  <<Interface>> ILeadRepository: save, update, getAll, getById, getByCloser, getBySetter|
|                                                                                       |
|  LocalStorageLeadRepository realizes ILeadRepository                                  |
|                                                                                       |
|  LeadService: depends on ILeadRepository and UserService                             |
|                                                                                       |
|  Controllers: AppController, DashboardController, ModalController                     |
|                                                                                       |
+---------------------------------------------------------------------------------------+
```

---

## 10. Authors & Course Information

- **Course:** Software Design Principles and Patterns
- **Repository:** [https://github.com/00dnn/LeadFlow](https://github.com/00dnn/LeadFlow)
- **License:** Educational Open Source / MIT
