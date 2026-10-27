# LeadFlow — Lead & Appointment Management System


---

## 1. Project Overview & Scope

**LeadFlow** is an enterprise-modeled, role-oriented lead and appointment management platform designed for sales operations. The system models the collaborative pipeline between front-line **Appointment Setters** (who qualify inbound/outbound prospects and schedule discovery consultations) and **Closers** (account executives who conduct consultations, advance opportunity stages, and document deal outcomes).

```
┌─────────────────────────────────┐                             ┌─────────────────────────────────┐
│       Appointment Setter        │      1. Qualify & Assign    │             Closer              │
│     (e.g., Sarah Jenkins)       │ ──────────────────────────> │      (e.g., Alex Rivera)        │
│ • Intakes prospect data         │                             │ • Conducts consultation         │
│ • Schedules appointments        │ <────────────────────────── │ • Advances deal status          │
│ • Inspects live deal history    │     2. Immutable Outcomes   │ • Records consultation notes    │
└─────────────────────────────────┘                             └─────────────────────────────────┘
```

### Project Milestones
Developed within the scope of **Software Design Principles and Patterns**, this project follows a multi-phase engineering lifecycle:

- **Part 1 (Current Phase):** System Architecture, Object-Oriented Analysis & Design (OOAD), formal **Structural Class Diagram**, and **Behavioral Sequence Diagrams** incorporating SOLID design principles, GoF patterns, and GRASP guidelines.
- **Part 2 (Future Phase):** Full-stack client implementation translating these architectural models into code (planned in vanilla ES6+ JavaScript, semantic HTML5, and CSS3).

---

## 2. System Architecture

The system is designed around a decoupled, 5-layer architecture ensuring high cohesion, low coupling, and strict compliance with the **Dependency Inversion Principle (DIP)**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                            │
│           (Web UI Views, DOM Interface, Semantic Templates)             │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ User Actions & UI Events
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            CONTROLLER LAYER                             │
│   ├── AppController            (Application Lifecycle, Shell, Auth)    │
│   ├── DashboardController      (KPI Metrics, Reactive Table, Filtering) │
│   └── ModalController          (Appointment Intake, Outcome Modals)    │
└──────────────┬───────────────────────────────────────────┬──────────────┘
               │ Invokes Operations                        │ Listens via Events
               ▼                                           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER                              │
│   ├── LeadService      (Business Rules, Validation, Permissions, Stats) │
│   ├── UserService      (User Directory, Active Session State)           │
│   └── EventEmitter     (Observer / Publish-Subscribe Event Bus)         │
└──────────────┬──────────────────────────────────────────────────────────┘
               │ Reads / Persists Domain Entities
               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            REPOSITORY LAYER                             │
│   ├── ILeadRepository            (Abstract Interface Contract - DIP)    │
│   └── LocalStorageLeadRepository (Concrete Browser Storage Realization) │
└──────────────┬──────────────────────────────────────────────────────────┘
               │ Reconstitutes / Serializes
               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DOMAIN / MODEL LAYER                           │
│   ├── Lead             (Core Aggregate Root: Status, Assignment)       │
│   ├── HistoryEntry     (Immutable Audit Record Entity)                  │
│   ├── User             (Actor Identity & Role Capabilities)             │
│   └── LeadStatus       (Enumeration of Valid Pipeline Stages)           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. UML Modeling Specifications

The core modeling deliverables are maintained as formal PlantUML models and high-resolution vector diagrams in the [`ProjectDesign/`](./ProjectDesign/) directory.

The behavioral modeling is provided in two complementary formats:
1. **Scenario-Specific Sequence Diagrams:** Focused on individual workflows (appointment creation, closer consultation, and audit inspection) with clear participant boundaries.
2. **Master Comprehensive Sequence Diagram:** An end-to-end overview illustrating the entire pipeline lifecycle in a single unified diagram.

| Deliverable | PlantUML Source File | Rendered Vector Output | Scope & Workflow Description |
| :--- | :--- | :--- | :--- |
| **Structural Class Diagram** | [`LFlow_Structural_Diagram.puml`](./ProjectDesign/Class%20Diagram/LFlow_Structural_Diagram.puml) | [`LFlow_Structural_Diagram.svg`](./ProjectDesign/Class%20Diagram/LFlow_Structural_Diagram.svg) | Complete static architecture: entities, repositories, services, and controllers |
| **Scenario 1: Appointment Scheduling** | [`LFlow_Seq_1_Appointment_Creation.puml`](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_1_Appointment_Creation.puml) | [`LFlow_Seq_1_Appointment_Creation.svg`](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_1_Appointment_Creation.svg) | Setter workflow: form intake, validation, entity creation, repository save, and event dispatch |
| **Scenario 2: Consultation & Outcome** | [`LFlow_Seq_2_Closer_Outcome.puml`](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_2_Closer_Outcome.puml) | [`LFlow_Seq_2_Closer_Outcome.svg`](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_2_Closer_Outcome.svg) | Closer workflow: role verification gate, state transition (`WON`), and immutable history generation |
| **Scenario 3: Audit Review Loop** | [`LFlow_Seq_3_Audit_Inspection.puml`](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_3_Audit_Inspection.puml) | [`LFlow_Seq_3_Audit_Inspection.svg`](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_3_Audit_Inspection.svg) | Setter feedback loop: read-only access guard and timeline verification |
| **Master Sequence Diagram (All-in-One)** | [`LFlow_Sequence_Diagram.puml`](./ProjectDesign/Sequence%20Diagrams/LFlow_Sequence_Diagram.puml) | [`LFlow_Sequence_Diagram.svg`](./ProjectDesign/Sequence%20Diagrams/LFlow_Sequence_Diagram.svg) | Full end-to-end lifecycle showing all 3 phases and all actors in a single overview |

---

### 3.1 Structural Class Diagram

The structural class diagram specifies all classes, data attributes, method signatures, visibility modifiers, and associations across the entire architecture.

![LeadFlow Structural Class Diagram](./ProjectDesign/Class%20Diagram/LFlow_Structural_Diagram.svg)

#### Architectural Breakdown of Modeled Components:

1. **Domain Model Layer:**
   - **`Lead` (Aggregate Root):** Encapsulates core appointment data (`customerName`, `phoneNumber`, `email`, `serviceInterest`, `appointmentDate`, `appointmentTime`, `setterId`, `closerId`), manages current pipeline status (`LeadStatus`), and owns the audit history list.
   - **`HistoryEntry` (Entity):** Immutable audit log item capturing every status transition, outcome note, timestamp, author ID, and user role.
   - **`User` (Entity):** Represents sales team actors with role-checking methods (`isSetter()`, `isCloser()`).
   - **`LeadStatus` (`<<Enumeration>>`):** Formal lifecycle states (`PENDING`, `CONTACTED`, `INTERESTED`, `FOLLOW_UP_REQUIRED`, `NO_ANSWER`, `WON`, `LOST`).

2. **Repository Layer (Persistence Abstraction):**
   - **`ILeadRepository` (`<<Interface>>`):** Establishes the persistence contract (`save`, `update`, `getAll`, `getById`, `getByCloserId`, `getBySetterId`, `clearAll`, `saveAll`).
   - **`LocalStorageLeadRepository`:** Concrete implementation of `ILeadRepository` targeting browser storage. Insulates domain logic from the underlying storage mechanism.

3. **Service Layer (Business Logic & Messaging):**
   - **`LeadService`:** Enforces domain constraints, validates appointment inputs, asserts closer permissions before status mutations, and compiles operational metrics.
   - **`UserService`:** Manages user directory, demo profiles, and active session context.
   - **`EventEmitter` (`<<Observer>>`):** Centralized publish-subscribe bus for decoupled asynchronous event notifications (`lead:created`, `lead:updated`).

4. **Controller Layer (Application Coordination):**
   - **`AppController`:** Orchestrates top-level application bootstrapping and active user transitions.
   - **`DashboardController`:** Handles KPI metrics computation, real-time table rendering, and multi-criteria filtering.
   - **`ModalController`:** Coordinates UI dialogs for appointment scheduling and closer outcome updates.

---

### 3.2 Behavioral Sequence Diagrams (Modular Scenarios)

The behavioral sequence diagrams break down the core workflows into modular, focused interactions.

#### Scenario 1: Appointment Intake, Scheduling & Closer Assignment (Setter Workflow)

This interaction traces an Appointment Setter scheduling a prospective client and assigning them to a Closer. It highlights input validation in `LeadService`, domain entity construction (`HistoryEntry` and `Lead`), persistence via `ILeadRepository`, and decoupled UI refresh via `EventEmitter`.

![Scenario 1: Appointment Scheduling](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_1_Appointment_Creation.svg)

- **Source File:** [`LFlow_Seq_1_Appointment_Creation.puml`](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_1_Appointment_Creation.puml)
- **Key Flow:** Setter submits form → `ModalController` fetches active user → `LeadService.createAppointment()` validates inputs → instantiates initial `HistoryEntry(action="created")` and `Lead(status=PENDING)` → persists via `ILeadRepository.save()` → dispatches `lead:created` event → `DashboardController` refreshes table and KPI counters.

---

#### Scenario 2: Closer Consultation, Status Advancement & Audit Recording (Closer Workflow)

This interaction illustrates an assigned Closer conducting a consultation and documenting the outcome (e.g., closing the deal as `WON`). It highlights authorization validation in `LeadService`, state transition rules, and immutable audit appending.

![Scenario 2: Closer Consultation & Outcome](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_2_Closer_Outcome.svg)

- **Source File:** [`LFlow_Seq_2_Closer_Outcome.puml`](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_2_Closer_Outcome.puml)
- **Key Flow:** Closer opens assigned lead → `ModalController` fetches record → Closer selects new status (`WON`) and inputs consultation notes → `LeadService.updateLeadOutcome()` asserts closer role and ID match (security gate) → calls `Lead.updateStatus()` which appends a timestamped `HistoryEntry` → persists updated aggregate via `ILeadRepository.update()` → emits `lead:updated` to increment Deals Won KPIs.

---

#### Scenario 3: Closed Feedback Loop — Setter Inspects Immutable Audit Timeline

This scenario demonstrates the closed feedback loop: the Appointment Setter returns to the lead to inspect consultation notes recorded by the Closer.

![Scenario 3: Audit Review Loop](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_3_Audit_Inspection.svg)

- **Source File:** [`LFlow_Seq_3_Audit_Inspection.puml`](./ProjectDesign/Sequence%20Diagrams/LFlow_Seq_3_Audit_Inspection.puml)
- **Key Flow:** Setter re-opens lead details → `ModalController` requests lead by ID → repository reconstitutes entity with complete historical timeline → UI renders a read-only view displaying Closer's timestamped notes and status transition (`PENDING → WON`), closing the sales feedback loop.

---

### 3.3 Master Comprehensive Sequence Diagram (Unified Architecture)

For an end-to-end view of the architecture, all operational phases are consolidated into a unified master sequence diagram:

![LeadFlow Master Sequence Diagram](./ProjectDesign/Sequence%20Diagrams/LFlow_Sequence_Diagram.svg)

- **PlantUML Source File:** [`LFlow_Sequence_Diagram.puml`](./ProjectDesign/Sequence%20Diagrams/LFlow_Sequence_Diagram.puml)
- **Vector Output:** [`LFlow_Sequence_Diagram.svg`](./ProjectDesign/Sequence%20Diagrams/LFlow_Sequence_Diagram.svg)

---

## 4. Application of SOLID Principles

The system architecture and UML models strictly adhere to the five SOLID principles:

| Principle | Architectural Application in LeadFlow |
| :--- | :--- |
| **Single Responsibility Principle (SRP)** | Each class has one well-defined responsibility and reason to change. `LocalStorageLeadRepository` handles persistence only; `LeadService` manages business rules and permissions; `DashboardController` coordinates table and KPI rendering; `Lead` manages its domain state and internal history. |
| **Open/Closed Principle (OCP)** | Storage access is abstracted behind the `ILeadRepository` contract. Switching to an alternative persistence mechanism (such as `IndexedDB` or a REST API) requires adding a new repository subclass without altering existing service or controller code. |
| **Liskov Substitution Principle (LSP)** | `LocalStorageLeadRepository` satisfies the full semantic and structural contract defined by `ILeadRepository`. Any consumer requiring `ILeadRepository` can seamlessly consume `LocalStorageLeadRepository` without side effects. |
| **Interface Segregation Principle (ISP)** | The `ILeadRepository` interface provides a cohesive, role-tailored API (`save`, `update`, `getAll`, `getById`, `getByCloserId`, `getBySetterId`) without burdening consumers with superfluous methods. |
| **Dependency Inversion Principle (DIP)** | High-level business policies (`LeadService`) depend entirely on the abstraction `ILeadRepository`, rather than on concrete storage implementations. Concrete dependencies are injected during composition. |

---

## 5. Design Patterns Modeled

### 5.1 Gang of Four (GoF) Patterns

1. **Repository Pattern (`ILeadRepository`, `LocalStorageLeadRepository`):**  
   Decouples the domain and service layers from storage technologies, providing an in-memory collection-like interface for domain entities.

2. **Observer / Publish-Subscribe Pattern (`EventEmitter`):**  
   Provides loosely-coupled, event-driven communication between the service layer and presentation controllers when domain mutations occur.

3. **Model-View-Controller (MVC):**  
   - **Model:** `Lead`, `User`, and `HistoryEntry` encapsulate business logic, domain invariants, and audit history.
   - **View:** Declarative HTML templates and visual styling.
   - **Controller:** `AppController`, `DashboardController`, and `ModalController` coordinate user interaction and delegate to services.

4. **Dependency Injection:**  
   Services and repositories are instantiated and injected through class constructors, enabling loose coupling and unit testability.

### 5.2 GRASP Guidelines

- **Information Expert:** The `Lead` entity maintains its own status transitions and audit history entries because it holds the requisite state information.
- **Creator:** The `Lead` entity creates `HistoryEntry` instances during status updates.
- **Controller:** Dedicated controllers handle incoming UI events before delegating to domain services.
- **Low Coupling & High Cohesion:** Classes are partitioned along clear boundaries with explicit interfaces.

---

## 6. Domain Rules, Roles & State Machine

### 6.1 Role & Permission Matrix

| Capability / Action | Appointment Setter | Closer |
| :--- | :---: | :---: |
| Schedule new prospect appointments | :white_check_mark: | :x: |
| Assign appointments to Closers | :white_check_mark: | :x: |
| View submitted appointments | :white_check_mark: (Own leads) | :white_check_mark: (Assigned leads) |
| Conduct consultations & advance status | :x: | :white_check_mark: |
| Append consultation notes & outcome logs | :x: | :white_check_mark: |
| Review immutable audit timeline | :white_check_mark: | :white_check_mark: |

### 6.2 Lead Status State Machine

```
             ┌───────────────┐
             │    PENDING    │ (Initial State on Creation)
             └───────┬───────┘
                     │ Closer outreach begins
                     ▼
             ┌───────────────┐
     ┌───────┤   CONTACTED   ├───────┐
     │       └───────┬───────┘       │
     ▼               ▼               ▼
┌─────────┐   ┌─────────────┐   ┌────────────┐
│   NO    │   │ INTERESTED  │   │ FOLLOW-UP  │
│ ANSWER  │   └──────┬──────┘   │  REQUIRED  │
└─────────┘          │          └─────┬──────┘
                     │ Final Outcome  │
            ┌────────┴────────┐       │
            ▼                 ▼       ▼
      ┌───────────┐     ┌───────────┐ │
      │    WON    │     │   LOST    ├─┘
      │ (Success) │     │  (Closed) │
      └───────────┘     └───────────┘
```

---

## 7. Project Structure

```
LeadFlow/
├── README.md                                # System design specification & architecture documentation
├── PDF/
│   └── SWEN383_P1_Marimangat.pdf            # Compiled project design document
└── ProjectDesign/                           # UML Modeling Deliverables
    ├── Class Diagram/
    │   ├── LFlow_Structural_Diagram.puml    # PlantUML Structural Class Diagram source
    │   └── LFlow_Structural_Diagram.svg     # Rendered Vector Structural Diagram
    └── Sequence Diagrams/
        ├── LFlow_Seq_1_Appointment_Creation.puml  # Scenario 1 PUML: Appointment Scheduling (Setter Flow)
        ├── LFlow_Seq_1_Appointment_Creation.svg   # Scenario 1 Vector SVG
        ├── LFlow_Seq_2_Closer_Outcome.puml        # Scenario 2 PUML: Consultation & Outcome (Closer Flow)
        ├── LFlow_Seq_2_Closer_Outcome.svg         # Scenario 2 Vector SVG
        ├── LFlow_Seq_3_Audit_Inspection.puml      # Scenario 3 PUML: Audit Inspection & Feedback Loop
        ├── LFlow_Seq_3_Audit_Inspection.svg       # Scenario 3 Vector SVG
        ├── LFlow_Sequence_Diagram.puml            # Master End-to-End Sequence Diagram source
        └── LFlow_Sequence_Diagram.svg             # Master End-to-End Vector Sequence Diagram
```

---

## 8. Planned Implementation & Technical Roadmap

While **Part 1** is dedicated to system modeling and architectural design, the diagrams have been constructed to facilitate direct implementation in subsequent phases:

- **Target Architecture:** Pure client-side modular web application using **Vanilla JavaScript (ES6+ Modules)**, **HTML5**, and **CSS3**.
- **Zero-Dependency Philosophy:** No build steps (no Webpack, Vite, or Babel), no external UI frameworks, and no npm package requirements.
- **Persistence Strategy:** Concrete browser `localStorage` adapter implementing `ILeadRepository` with JSON hydration and defensive error handling.
- **Security & Integrity:** Input validation and contextual HTML escaping (XSS prevention) on all user-supplied data.
- **UI/UX Vision:** A modern SaaS workspace featuring dynamic KPI metrics, a reactive appointment table with search/filtering, and modal-based appointment creation and outcome logging workflows.

---

## 9. Academic Attribution & Course Information

- **Project Title:** LeadFlow — Lead & Appointment Management System
- **Course:** Software Design Principles and Patterns
- **Milestone:** Part 1 — Structural & Behavioral System Modeling
- **Repository:** [https://github.com/00dnn/LeadFlow](https://github.com/00dnn/LeadFlow)
