# AI-calculator
# React + TypeScript + Vite App with FastAPI Backend

This project is a Gemini Based application combining a React frontend (using Vite) and a FastAPI backend. The frontend is built with TypeScript and React, while the backend serves as an API using FastAPI.


## Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python, Uvicorn
- **Linting:** ESLint (with TypeScript, React plugins)
- **Middleware:** CORS (FastAPI)

---

## Setup Instructions

### Prerequisites
- **Node.js** (>= 14.x) and **npm** or **yarn**
- **Python** (>= 3.8)
- **pip** for managing Python packages
- **Virtual Environment** for isolating dependencies (recommended)

### Backend Setup

1. **Clone the repository** and navigate to the backend directory:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo/backend
   python -m venv venv
   pip install -r requirements.txt

source venv/bin/activate   # For Linux/MacOS
# On Windows use `venv\Scripts\activate`
### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd ../frontend
   npm install
   npm install @vitejs/plugin-react eslint eslint-plugin-react --save-dev

### Update eslint.config.js
**
      //eslint.config.js

     import react from 'eslint-plugin-react';

      import tseslint from '@typescript-eslint/eslint-plugin';

     export default tseslint.config({

    languageOptions: {
  
    parserOptions: {
    
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      
      tsconfigRootDir: import.meta.dirname,
    },
    },
    settings: { react: { version: '18.3' } },
  
    plugins: { react },
  
    rules: {
  
    // Enable React recommended rules
    
    ...react.configs.recommended.rules,
    
    ...react.configs['jsx-runtime'].rules,
    },
    });
   **

