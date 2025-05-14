# Project Setup Guide

## Summary
To set up the project:

1. Clone the repository from GitHub.  
2. Install Node.js, MySQL, and Git.  
3. Create two separate environment files for each directory: `.env.development` for development and `.env.production` for production. Previously, each folder only contained a single `.env` file, but the new setup separates development and production configurations to better support different environments. Make sure to create and populate both files with the required environment variables for each context.  
4. Install dependencies using `npm install` in each directory.  
5. Run the backend server using the command: `npm start dev`  
6. Run the frontend development server in a different terminal: `npm start`  
7. Test the application by registering, logging in, linking accounts, and checking budgets and challenges.  

## Dependencies

### Frontend:  
- `npm install`  
- `npm install react-plaid-link`  
- `npm install plaid`  
- `npm install node-cron`  
- `npm install react-toastify`  
- `npm install react-transition-group`  
- `npm install openai`  
- `npm install react-flip-numbers`  
- `npm install nodemailer bcrypt dotenv`  
- `npm install react-chartjs-2 chart.js`  
- `npm install framer-motion`  
- `npm install react-intersection-observer`  
- `npm install recharts`  
- `npm install react-datepicker`  
- `npm install react-input-mask`  

### Backend:  
- `npm install express-rate-limit`  
- `npm install nodemailer`  
- `npm install winston`  
- `npm install handlebars`  
- `npm install inline-css`  
- `npm install dotenv-flow`  
- `npm install cross-env --save-dev`  
- `npm install nodemon --save-dev`  
