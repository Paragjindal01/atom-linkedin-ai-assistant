# AI Marketing Platform

Full-stack AI marketing assistant project using React, Node.js, Express, PostgreSQL, and OpenAI API.

## Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ai-marketing-platform
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory using the provided environment variables template.
   
   Run the backend:
   ```bash
   npm run dev
   # or node index.js
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   ```
   Create a `.env` file in the `client` directory (if needed) to override the default API URL.
   
   Run the frontend:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (`server/.env`)
```env
# Server Configuration
PORT=5001
NODE_ENV=development # change to 'production' in deployment

# Client URL for CORS
CLIENT_URL=http://localhost:5173 # change to your live frontend URL in production

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/ai_marketing_db

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_jwt_key

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key
```

### Frontend (`client/.env`)
```env
# Optional: Override the default API URL for production
VITE_API_URL=https://your-production-backend.onrender.com/api
```

## Production Deployment Notes

To deploy the application to a production environment:

1. **Database:**
   - Host your PostgreSQL database on a service like Supabase, Render, or AWS RDS.
   - Run your schema SQL commands to initialize the database structure.
   - Obtain the secure connection string (`DATABASE_URL`).

2. **Backend (Node.js/Express):**
   - Deploy the `server/` directory to a hosting service like Render, Heroku, or DigitalOcean.
   - Configure all environment variables mentioned above in the hosting dashboard.
   - Ensure `NODE_ENV=production`.
   - Set `CLIENT_URL` exactly to the URL where your frontend will be hosted (e.g., `https://my-frontend.vercel.app`) to ensure CORS is securely configured.

3. **Frontend (Vite/React):**
   - Deploy the `client/` directory to a static host like Vercel, Netlify, or Render.
   - Add the `VITE_API_URL` environment variable during the build process, pointing it to your deployed backend URL (e.g., `https://my-backend.onrender.com/api`).
   - The build command is `npm run build`, and the output directory is `dist/`.
