// src/data/initialData.js
export const initialTransactions = [
  {
    id: 1,
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: "2024-05-01",
    tags: ["work", "regular"],
  },
  {
    id: 2,
    type: "expense",
    amount: 1200,
    category: "Rent",
    description: "Monthly rent",
    date: "2024-05-02",
    tags: ["housing", "fixed"],
  },
  {
    id: 3,
    type: "expense",
    amount: 300,
    category: "Groceries",
    description: "Weekly shopping",
    date: "2024-05-03",
    tags: ["food", "essential"],
  },
  {
    id: 4,
    type: "expense",
    amount: 150,
    category: "Entertainment",
    description: "Movie night",
    date: "2024-05-04",
    tags: ["leisure", "optional"],
  },
  {
    id: 5,
    type: "income",
    amount: 500,
    category: "Freelance",
    description: "Web design project",
    date: "2024-05-05",
    tags: ["side-hustle", "project"],
  },
  {
    id: 6,
    type: "expense",
    amount: 80,
    category: "Transportation",
    description: "Gas and parking",
    date: "2024-05-06",
    tags: ["transport", "regular"],
  },
  {
    id: 7,
    type: "expense",
    amount: 200,
    category: "Utilities",
    description: "Electricity bill",
    date: "2024-05-07",
    tags: ["housing", "utilities"],
  },
  {
    id: 8,
    type: "savings",
    amount: 1000,
    category: "Emergency Fund",
    description: "Monthly savings",
    date: "2024-05-08",
    tags: ["savings", "emergency"],
  },
];

export const initialBudgets = [
  { category: "Rent", budgeted: 1200, spent: 1200, color: "#FF6B6B" },
  { category: "Groceries", budgeted: 400, spent: 300, color: "#4ECDC4" },
  { category: "Entertainment", budgeted: 200, spent: 150, color: "#45B7D1" },
  { category: "Transportation", budgeted: 150, spent: 80, color: "#96CEB4" },
  { category: "Utilities", budgeted: 250, spent: 200, color: "#FFEAA7" },
];

export const initialGoals = [
  {
    id: 1,
    name: "Emergency Fund",
    target: 10000,
    current: 5500,
    deadline: "2024-12-31",
    color: "#FF6B6B",
  },
  {
    id: 2,
    name: "Vacation",
    target: 3000,
    current: 1200,
    deadline: "2024-08-15",
    color: "#4ECDC4",
  },
  {
    id: 3,
    name: "New Laptop",
    target: 1500,
    current: 800,
    deadline: "2024-07-01",
    color: "#45B7D1",
  },
];

export const initialNotifications = [
  {
    id: 1,
    type: "warning",
    message: "You've exceeded your Entertainment budget by $50",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "success",
    message: "Congratulations! You've reached 80% of your Emergency Fund goal",
    time: "1 day ago",
  },
  {
    id: 3,
    type: "info",
    message: "Monthly budget review is due",
    time: "3 days ago",
  },
];

export const categories = [
  "Salary",
  "Freelance",
  "Rent",
  "Groceries",
  "Entertainment",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Emergency Fund",
];

export const colors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];
