# Book Frontend

A React application for managing a mini library, built with Vite. The app uses a **Feature-Based Architecture** combined with **Atomic Design** for a scalable and maintainable codebase.

---

## Project Structure

The application is organized as follows:

### Architecture Overview

- **Feature-Based Architecture** — The app is split by feature (e.g. `homeFeature`) so each feature owns its UI, logic, types, and services in one place.
- **Atomic Design (components)** — Reusable UI is built from small building blocks:
  - **Atoms** — Small, single-purpose components (buttons, inputs, etc.).
  - **Molecules** — Combinations of atoms (forms, headers, table toolbars, etc.).

### Directory Layout

```
src/
├── components/           # Shared UI (Atomic Design)
│   ├── atoms/            # Buttons, inputs, etc.
│   └── molecules/        # Forms, headers, tables, toolbars
├── features/             # Feature modules
│   └── homeFeature/      # Home screen: UI, service, types
├── App.tsx
├── main.tsx
└── ...
```

- **`src/features/`** — One folder per feature, containing the feature component, service (API/data), and types.
- **`src/components/`** — Shared components only; atoms and molecules are used across features.

---

## Environment Setup

The app talks to a backend API. You must provide the API base URL via environment variables.

### 1. Create a `.env` file

In the **project root** (same level as `package.json`), create a file named `.env`.

### 2. Add the API URL

Add this line to `.env`:

```env
VITE_API_BASE_URL=https://minilibrarybackend.onrender.com/
```

> **Note:** Only variables prefixed with `VITE_` are exposed to the client in Vite. Do not put secrets in `VITE_*` variables.

---

## Running the Application Locally

### Prerequisites

- **Node.js** (v18 or newer recommended)
- **npm** (comes with Node.js)

### Step 1: Clone the repository (if needed)

```bash
git clone <repository-url>
cd bookfrontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Configure environment

Create a `.env` file in the project root and add:

```env
VITE_API_BASE_URL=https://minilibrarybackend.onrender.com/
```

### Step 4: Start the development server

```bash
npm run dev
```

The app will be available at the URL shown in the terminal (typically `http://localhost:5173`).

### Other commands

| Command        | Description                |
|----------------|----------------------------|
| `npm run build`| Build for production       |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint                 |

---

## Tech Stack

- **React** — UI
- **Vite** — Build tool and dev server
- **TypeScript** — Typing
- **Axios** — HTTP client
- **Formik + Yup** — Forms and validation
- **TanStack Table** — Tables
