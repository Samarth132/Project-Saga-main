# Project-Saga

Project-Saga is a comprehensive web application designed for writers, game masters, and world-builders to create, organize, and visualize their fictional worlds. It provides a suite of tools to manage everything from characters and locations to intricate plotlines and historical events.

## Features

- **Project Management**: Create and manage multiple world-building projects.
- **World Forge**: Define and categorize entities such as characters, places, and items using customizable templates.
- **Cartographer**: Build and interact with maps, pinning entities to specific locations.
- **Relationship Webs**: Map out the relationships between different entities to keep track of social and political dynamics.

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: (Please specify your database, e.g., MongoDB, PostgreSQL)
- **Testing**: Jest

### Frontend

- **Library**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Material-UI, CSS
- **State Management**: Zustand (inferred from store structure)
- **Testing**: React Testing Library, Vitest

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/Project-Saga.git
    cd Project-Saga
    ```

2.  **Setup Backend:**

    ```bash
    cd backend
    npm install
    ```

    - Create a `.env` file in the `backend` directory and add the necessary environment variables (e.g., database connection string, port).

3.  **Setup Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```
    - Create a `.env.local` file in the `frontend` directory to specify the backend API endpoint if it's different from the default.

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    npm run dev
    ```

    The backend will be running on the port specified in your `.env` file (e.g., `http://localhost:5000`).

2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:3000`.
