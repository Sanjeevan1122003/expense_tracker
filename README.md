# Expense Tracker

A full-stack expense management application with authentication, smart filtering, analytics dashboards, and PDF export.

## Features
- User authentication (Register/Login) with JWT cookies
- Add, update, delete, and list expenses
- Category-wise analytics with bar/line charts
- Income vs expense comparisons and trend insights
- Date filters (month, year, custom range)
- Export expense reports to PDF

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, shadcn/ui, Recharts
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** JWT, bcryptjs, cookies
- **PDF Export:** pdfkit

## Project Structure
```
backend/    # Express API (PostgreSQL)
frontend/   # React + Vite frontend
```

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/Sanjeevan1122003/expense_tracker.git
cd expense-tracker
```

### 2. Backend Setup
```sh
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/expense_tracker
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend server:
```sh
npm run dev
# or
npm start
```

> Note: CORS in `backend/server.js` is set to the production frontend URL.  
> For local development, update it to `http://localhost:5173`.

### 3. Frontend Setup
```sh
cd ../frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

### 4. Database Setup (PostgreSQL)
Create the following tables:
```sql
CREATE TABLE users_autho (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE expense_data (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  user_expense_id INT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  category VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time VARCHAR(20),
  created_at TIMESTAMP,
  FOREIGN KEY (email) REFERENCES users_autho(email)
);
```

## Usage
- Register a new user and log in
- Add income/expenses with categories and descriptions
- Filter data by date range, month, or year
- View charts and tables on the dashboard
- Export your expenses as a PDF report

## Contributing
Contributions are welcome:
1. Fork the repository
2. Create a branch: `git checkout -b feature/YourFeatureName`
3. Commit your changes
4. Push the branch and open a PR

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE).

## Contact
For questions or feedback, please reach out to **Sanjeevan**.
