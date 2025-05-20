# Project Setup Guide

This project can be easily set up using Docker or manually by cloning the repository and following the steps below.

---

## 🚀 Docker Setup

This project can be easily set up using Docker. The Docker setup supports both development and production environments.

### 📌 Prerequisites
- Ensure Docker and Docker Compose are installed on your system.

### 🚦 Starting the Project with Docker

1. Clone this repository:
```bash
git clone https://github.com/dagm4020/FinanceFlow.git
cd FinanceFlow
```

2. Make the Docker run script executable:
```bash
chmod +x docker-run
```

3. Start Docker using the interactive command:
```bash
./docker-run
```

### ⚡ How It Works
- You will be prompted to choose between:
  - **Development (http://localhost:3000)**  
  - **Production (https://financeflow.icu)**

- The backend runs on port **5005**.
- The frontend runs on port **3000**.

### 🔧 Environment Variables

This project uses environment variables stored securely in Docker. You can set these variables in the `.env` file in the main `FinanceFlow` folder (not included in the repo).

```env
DB_HOST=your-rds-endpoint
MYSQL_HOST=your-rds-endpoint
MYSQL_USER=your-db-user
MYSQL_PASSWORD=your-db-password
MYSQL_DATABASE=expense_manager
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
PLAID_ENV=sandbox
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET=your-jwt-secret
EMAIL_USER=your-gmail-user
EMAIL_PASS=your-gmail-app-password
FRONTEND_BASE_URL=http://localhost:3000
```

---

## 📌 Manual Setup

To set up the project manually:

1. Clone the repository from GitHub.
2. Install Node.js, MySQL, and Git.
3. Create two separate environment files for each directory: `.env.development` for development and `.env.production` for production. Populate both files with the required environment variables.
4. Install dependencies using `npm install` in each directory.
5. Run the backend server: `npm run dev`
6. Run the frontend server in another terminal: `npm start`
7. Test the application by registering, logging in, linking accounts, and checking budgets and challenges.

---

## 🛠️ Dependencies

### Frontend:

```bash
npm install react-plaid-link plaid node-cron react-toastify react-transition-group openai react-flip-numbers nodemailer bcrypt dotenv react-chartjs-2 chart.js framer-motion react-intersection-observer recharts react-datepicker react-input-mask
```

### Backend:

```bash
npm install express-rate-limit nodemailer winston handlebars inline-css dotenv-flow
npm install cross-env nodemon --save-dev
```

---

## 🛑 Stopping Docker Containers

```bash
docker compose down
```

---

## 📄 Checking Docker Logs

```bash
docker compose logs backend
docker compose logs frontend