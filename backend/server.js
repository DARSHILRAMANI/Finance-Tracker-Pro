// // // server.js
// // const express = require("express");
// // const dotenv = require("dotenv");
// // const cors = require("cors");
// // const mongoose = require("mongoose");
// // const bcrypt = require("bcryptjs");
// // const jwt = require("jsonwebtoken");

// // // Initialize environment variables
// // dotenv.config();

// // // Initialize Express app
// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // MongoDB Connection
// // const connectDB = async () => {
// //   try {
// //     const conn = await mongoose.connect(process.env.MONGODB_URI, {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //     });
// //     console.log(`MongoDB Connected: ${conn.connection.host}`);
// //   } catch (error) {
// //     console.error(`Error: ${error.message}`);
// //     process.exit(1);
// //   }
// // };
// // connectDB();

// // // Mongoose Schemas
// // const userSchema = new mongoose.Schema(
// //   {
// //     username: { type: String, required: true, unique: true, trim: true },
// //     email: {
// //       type: String,
// //       required: true,
// //       unique: true,
// //       trim: true,
// //       lowercase: true,
// //     },
// //     password: { type: String, required: true },
// //   },
// //   { timestamps: true }
// // );

// // const transactionSchema = new mongoose.Schema(
// //   {
// //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     type: {
// //       type: String,
// //       enum: ["income", "expense", "savings"],
// //       required: true,
// //     },
// //     amount: { type: Number, required: true, min: 0 },
// //     category: { type: String, required: true },
// //     description: { type: String, required: true },
// //     date: { type: Date, required: true },
// //     tags: { type: [String], default: [] },
// //   },
// //   { timestamps: true }
// // );

// // const budgetSchema = new mongoose.Schema(
// //   {
// //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     category: { type: String, required: true },
// //     budgeted: { type: Number, required: true, min: 0 },
// //     spent: { type: Number, required: true, min: 0, default: 0 },
// //     color: { type: String, required: true },
// //   },
// //   { timestamps: true }
// // );
// // budgetSchema.index({ user: 1, category: 1 }, { unique: true });

// // const goalSchema = new mongoose.Schema(
// //   {
// //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     name: { type: String, required: true },
// //     target: { type: Number, required: true, min: 0 },
// //     current: { type: Number, required: true, min: 0, default: 0 },
// //     deadline: { type: Date, required: true },
// //     color: { type: String, required: true },
// //   },
// //   { timestamps: true }
// // );

// // const notificationSchema = new mongoose.Schema(
// //   {
// //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     type: {
// //       type: String,
// //       enum: ["warning", "success", "info"],
// //       required: true,
// //     },
// //     message: { type: String, required: true },
// //     time: { type: String, required: true },
// //   },
// //   { timestamps: true }
// // );

// // // Mongoose Models
// // const User = mongoose.model("User", userSchema);
// // const Transaction = mongoose.model("Transaction", transactionSchema);
// // const Budget = mongoose.model("Budget", budgetSchema);
// // const Goal = mongoose.model("Goal", goalSchema);
// // const Notification = mongoose.model("Notification", notificationSchema);

// // // Authentication Middleware
// // const auth = (req, res, next) => {
// //   const token = req.header("Authorization")?.replace("Bearer ", "");

// //   if (!token) {
// //     return res.status(401).json({ message: "No token, authorization denied" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded.user;
// //     next();
// //   } catch (error) {
// //     res.status(401).json({ message: "Token is not valid" });
// //   }
// // };

// // // Error Handler Middleware
// // const errorHandler = (err, req, res, next) => {
// //   console.error(err.stack);
// //   res.status(500).json({ message: "Server Error", error: err.message });
// // };

// // // Auth Controllers
// // const register = async (req, res, next) => {
// //   try {
// //     const { username, email, password } = req.body;

// //     let user = await User.findOne({ email });
// //     if (user) {
// //       return res.status(400).json({ message: "User already exists" });
// //     }

// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     user = new User({
// //       username,
// //       email,
// //       password: hashedPassword,
// //     });

// //     await user.save();

// //     const payload = {
// //       user: {
// //         id: user._id,
// //       },
// //     };

// //     const token = jwt.sign(payload, process.env.JWT_SECRET, {
// //       expiresIn: "1h",
// //     });

// //     res.status(201).json({ token });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const login = async (req, res, next) => {
// //   try {
// //     const { email, password } = req.body;

// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(400).json({ message: "Invalid credentials" });
// //     }

// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: "Invalid credentials" });
// //     }

// //     const payload = {
// //       user: {
// //         id: user._id,
// //       },
// //     };

// //     const token = jwt.sign(payload, process.env.JWT_SECRET, {
// //       expiresIn: "1h",
// //     });

// //     res.status(200).json({ token });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // // Transaction Controllers
// // const getTransactions = async (req, res, next) => {
// //   try {
// //     const transactions = await Transaction.find({ user: req.user.id });
// //     res.status(200).json(transactions);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const moment = require("moment");

// // const updateBudgetSpent = async (userId, category, amount, transactionDate) => {
// //   try {
// //     const startOfMonth = moment(transactionDate).startOf("month").toDate();
// //     const endOfMonth = moment(transactionDate).endOf("month").toDate();

// //     const budget = await Budget.findOne({
// //       user: userId,
// //       category: { $regex: `^${category}$`, $options: "i" },
// //     });

// //     if (
// //       budget &&
// //       transactionDate >= startOfMonth &&
// //       transactionDate <= endOfMonth
// //     ) {
// //       budget.spent += amount;
// //       await budget.save();
// //       console.log(`Updated budget for ${category}: spent = ${budget.spent}`);
// //     } else {
// //       console.log(
// //         `No budget found for ${category} or date outside current month`
// //       );
// //     }
// //   } catch (error) {
// //     console.error("Error updating budget spent:", error);
// //   }
// // };

// // const createTransaction = async (req, res, next) => {
// //   try {
// //     const { type, amount, category, description, date, tags } = req.body;

// //     if (!type || !amount || !category || !description || !date) {
// //       return res
// //         .status(400)
// //         .json({ message: "All required fields must be provided" });
// //     }

// //     if (!["income", "expense", "savings"].includes(type)) {
// //       return res.status(400).json({ message: "Invalid transaction type" });
// //     }

// //     if (amount <= 0) {
// //       return res.status(400).json({ message: "Amount must be positive" });
// //     }

// //     const transactionDate = new Date(date);

// //     const transaction = new Transaction({
// //       user: req.user.id,
// //       type,
// //       amount,
// //       category,
// //       description,
// //       date: transactionDate,
// //       tags: tags || [],
// //     });
// //     await transaction.save();

// //     if (type === "expense") {
// //       await updateBudgetSpent(req.user.id, category, amount, transactionDate);
// //     }

// //     res.status(201).json(transaction);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const updateTransaction = async (req, res, next) => {
// //   try {
// //     const { id } = req.params;
// //     const transaction = await Transaction.findOneAndUpdate(
// //       { _id: id, user: req.user.id },
// //       req.body,
// //       { new: true, runValidators: true }
// //     );
// //     if (!transaction) {
// //       return res.status(404).json({ message: "Transaction not found" });
// //     }
// //     res.status(200).json(transaction);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const deleteTransaction = async (req, res, next) => {
// //   try {
// //     const { id } = req.params;
// //     const transaction = await Transaction.findOneAndDelete({
// //       _id: id,
// //       user: req.user.id,
// //     });
// //     if (!transaction) {
// //       return res.status(404).json({ message: "Transaction not found" });
// //     }
// //     res.status(200).json({ message: "Transaction deleted" });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // // Budget Controllers
// // const getBudgets = async (req, res, next) => {
// //   try {
// //     const budgets = await Budget.find({ user: req.user.id });
// //     res.status(200).json(budgets);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const createBudget = async (req, res, next) => {
// //   try {
// //     const { category, budgeted, color } = req.body;
// //     if (!category || !budgeted || !color) {
// //       return res
// //         .status(400)
// //         .json({ message: "Category, budgeted amount, and color are required" });
// //     }
// //     if (budgeted <= 0) {
// //       return res
// //         .status(400)
// //         .json({ message: "Budgeted amount must be positive" });
// //     }
// //     if (!/^#[0-9A-F]{6}$/i.test(color)) {
// //       return res
// //         .status(400)
// //         .json({ message: "Color must be a valid hex code (e.g., #3B82F6)" });
// //     }
// //     const budget = new Budget({
// //       user: req.user.id,
// //       category,
// //       budgeted,
// //       color,
// //       spent: 0,
// //     });
// //     await budget.save();
// //     res.status(201).json(budget);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // // Get Budgets

// // // Goal Controllers
// // const getGoals = async (req, res, next) => {
// //   try {
// //     const goals = await Goal.find({ user: req.user.id });
// //     res.status(200).json(goals);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const createGoal = async (req, res, next) => {
// //   try {
// //     const { name, target, current, deadline, color } = req.body;
// //     const goal = new Goal({
// //       user: req.user.id,
// //       name,
// //       target,
// //       current,
// //       deadline,
// //       color,
// //     });
// //     await goal.save();
// //     res.status(201).json(goal);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const updateGoal = async (req, res, next) => {
// //   try {
// //     const { id } = req.params;
// //     const goal = await Goal.findOneAndUpdate(
// //       { _id: id, user: req.user.id },
// //       req.body,
// //       { new: true, runValidators: true }
// //     );
// //     if (!goal) {
// //       return res.status(404).json({ message: "Goal not found" });
// //     }
// //     res.status(200).json(goal);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const deleteGoal = async (req, res, next) => {
// //   try {
// //     const { id } = req.params;
// //     const goal = await Goal.findOneAndDelete({ _id: id, user: req.user.id });
// //     if (!goal) {
// //       return res.status(404).json({ message: "Goal not found" });
// //     }
// //     res.status(200).json({ message: "Goal deleted" });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // // Notification Controllers
// // const getNotifications = async (req, res, next) => {
// //   try {
// //     const notifications = await Notification.find({ user: req.user.id });
// //     res.status(200).json(notifications);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const createNotification = async (req, res, next) => {
// //   try {
// //     const { type, message, time } = req.body;
// //     const notification = new Notification({
// //       user: req.user.id,
// //       type,
// //       message,
// //       time,
// //     });
// //     await notification.save();
// //     res.status(201).json(notification);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // const deleteNotification = async (req, res, next) => {
// //   try {
// //     const { id } = req.params;
// //     const notification = await Notification.findOneAndDelete({
// //       _id: id,
// //       user: req.user.id,
// //     });
// //     if (!notification) {
// //       return res.status(404).json({ message: "Notification not found" });
// //     }
// //     res.status(200).json({ message: "Notification deleted" });
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // // Routes
// // app.post("/api/auth/register", register);
// // app.post("/api/auth/login", login);

// // app.get("/api/transactions", auth, getTransactions);
// // app.post("/api/transactions", auth, createTransaction);
// // app.put("/api/transactions/:id", auth, updateTransaction);
// // app.delete("/api/transactions/:id", auth, deleteTransaction);

// // app.get("/api/budgets", auth, getBudgets);
// // app.post("/api/budgets", auth, createBudget);
// // // app.put("/api/budgets/:id", auth, updateBudget);
// // // app.delete("/api/budgets/:id", auth, deleteBudget);

// // app.get("/api/goals", auth, getGoals);
// // app.post("/api/goals", auth, createGoal);
// // app.put("/api/goals/:id", auth, updateGoal);
// // app.delete("/api/goals/:id", auth, deleteGoal);

// // app.get("/api/notifications", auth, getNotifications);
// // app.post("/api/notifications", auth, createNotification);
// // app.delete("/api/notifications/:id", auth, deleteNotification);

// // // Error Handler
// // app.use(errorHandler);

// // // Start Server
// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const moment = require("moment");

// // Initialize environment variables
// dotenv.config();

// // Initialize Express app
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// };
// connectDB();

// // Mongoose Schemas
// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true, unique: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//       lowercase: true,
//     },
//     password: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const transactionSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     type: {
//       type: String,
//       enum: ["income", "expense", "savings"],
//       required: true,
//     },
//     amount: { type: Number, required: true, min: 0 },
//     category: { type: String, required: true },
//     description: { type: String, required: true },
//     date: { type: Date, required: true },
//     tags: { type: [String], default: [] },
//     goalId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Goal",
//       default: null,
//     },
//   },
//   { timestamps: true }
// );

// const budgetSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     category: { type: String, required: true },
//     budgeted: { type: Number, required: true, min: 0 },
//     spent: { type: Number, required: true, min: 0, default: 0 },
//     color: { type: String, required: true },
//   },
//   { timestamps: true }
// );
// budgetSchema.index({ user: 1, category: 1 }, { unique: true });

// const goalSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     name: { type: String, required: true },
//     target: { type: Number, required: true, min: 0 },
//     current: { type: Number, required: true, min: 0, default: 0 },
//     deadline: { type: Date, required: true },
//     color: { type: String, required: true },
//   },
//   { timestamps: true }
// );
// goalSchema.index({ user: 1, name: 1 }, { unique: true });

// const notificationSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     type: {
//       type: String,
//       enum: ["warning", "success", "info"],
//       required: true,
//     },
//     message: { type: String, required: true },
//     time: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// // Mongoose Models
// const User = mongoose.model("User", userSchema);
// const Transaction = mongoose.model("Transaction", transactionSchema);
// const Budget = mongoose.model("Budget", budgetSchema);
// const Goal = mongoose.model("Goal", goalSchema);
// const Notification = mongoose.model("Notification", notificationSchema);

// // Authentication Middleware
// const auth = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// // Error Handler Middleware
// const errorHandler = (err, req, res, next) => {
//   console.error(err.stack);
//   if (err.name === "ValidationError") {
//     return res.status(400).json({ message: err.message });
//   }
//   if (err.code === 11000) {
//     return res.status(400).json({ message: "Duplicate entry detected" });
//   }
//   res.status(500).json({ message: "Server Error", error: err.message });
// };

// // Auth Controllers
// const register = async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     let user = await User.findOne({ $or: [{ email }, { username }] });
//     if (user) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     user = new User({ username, email, password: hashedPassword });
//     await user.save();
//     const payload = { user: { id: user._id } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.status(201).json({ token });
//   } catch (error) {
//     next(error);
//   }
// };

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required" });
//     }
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }
//     const payload = { user: { id: user._id } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.status(200).json({ token });
//   } catch (error) {
//     next(error);
//   }
// };

// // Transaction Controllers
// const getTransactions = async (req, res, next) => {
//   try {
//     const transactions = await Transaction.find({ user: req.user.id }).sort({
//       date: -1,
//     });
//     res.status(200).json(transactions);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateBudgetSpent = async (
//   userId,
//   category,
//   amount,
//   transactionDate,
//   operation = "add"
// ) => {
//   try {
//     const startOfMonth = moment(transactionDate).startOf("month").toDate();
//     const endOfMonth = moment(transactionDate).endOf("month").toDate();
//     const budget = await Budget.findOne({
//       user: userId,
//       category: { $regex: `^${category}$`, $options: "i" },
//     });
//     if (
//       budget &&
//       transactionDate >= startOfMonth &&
//       transactionDate <= endOfMonth
//     ) {
//       if (operation === "add") {
//         budget.spent += amount;
//       } else if (operation === "subtract") {
//         budget.spent = Math.max(0, budget.spent - amount);
//       }
//       await budget.save();
//       console.log(`Updated budget for ${category}: spent = ${budget.spent}`);
//     } else {
//       console.log(
//         `No budget found for ${category} or date outside current month`
//       );
//     }
//   } catch (error) {
//     console.error("Error updating budget spent:", error);
//   }
// };

// const updateGoalCurrent = async (userId, goalId, amount, operation = "add") => {
//   try {
//     if (!goalId) return;
//     const goal = await Goal.findOne({ _id: goalId, user: userId });
//     if (goal) {
//       if (operation === "add") {
//         goal.current += amount;
//       } else if (operation === "subtract") {
//         goal.current = Math.max(0, goal.current - amount);
//       }
//       await goal.save();
//       console.log(`Updated goal ${goal.name}: current = ${goal.current}`);
//     } else {
//       console.log(`No goal found for goalId ${goalId}`);
//     }
//   } catch (error) {
//     console.error("Error updating goal current:", error);
//   }
// };

// const createTransaction = async (req, res, next) => {
//   try {
//     const { type, amount, category, description, date, tags, goalId } =
//       req.body;
//     if (!type || !amount || !category || !description || !date) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be provided" });
//     }
//     if (!["income", "expense", "savings"].includes(type)) {
//       return res.status(400).json({ message: "Invalid transaction type" });
//     }
//     if (amount <= 0) {
//       return res.status(400).json({ message: "Amount must be positive" });
//     }
//     if (
//       type === "savings" &&
//       goalId &&
//       !(await Goal.findOne({ _id: goalId, user: req.user.id }))
//     ) {
//       return res.status(400).json({ message: "Invalid goal ID" });
//     }
//     const transactionDate = new Date(date);
//     const transaction = new Transaction({
//       user: req.user.id,
//       type,
//       amount,
//       category,
//       description,
//       date: transactionDate,
//       tags: tags || [],
//       goalId: type === "savings" ? goalId || null : null,
//     });
//     await transaction.save();
//     if (type === "expense") {
//       await updateBudgetSpent(
//         req.user.id,
//         category,
//         amount,
//         transactionDate,
//         "add"
//       );
//     } else if (type === "savings" && goalId) {
//       await updateGoalCurrent(req.user.id, goalId, amount, "add");
//     }
//     res.status(201).json(transaction);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateTransaction = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { type, amount, category, description, date, tags, goalId } =
//       req.body;
//     const oldTransaction = await Transaction.findOne({
//       _id: id,
//       user: req.user.id,
//     });
//     if (!oldTransaction) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }
//     if (oldTransaction.type === "expense") {
//       await updateBudgetSpent(
//         req.user.id,
//         oldTransaction.category,
//         oldTransaction.amount,
//         oldTransaction.date,
//         "subtract"
//       );
//     } else if (oldTransaction.type === "savings" && oldTransaction.goalId) {
//       await updateGoalCurrent(
//         req.user.id,
//         oldTransaction.goalId,
//         oldTransaction.amount,
//         "subtract"
//       );
//     }
//     const transaction = await Transaction.findOneAndUpdate(
//       { _id: id, user: req.user.id },
//       {
//         type,
//         amount,
//         category,
//         description,
//         date: new Date(date),
//         tags,
//         goalId,
//       },
//       { new: true, runValidators: true }
//     );
//     if (type === "expense") {
//       await updateBudgetSpent(
//         req.user.id,
//         category,
//         amount,
//         new Date(date),
//         "add"
//       );
//     } else if (type === "savings" && goalId) {
//       await updateGoalCurrent(req.user.id, goalId, amount, "add");
//     }
//     res.status(200).json(transaction);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteTransaction = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const transaction = await Transaction.findOne({
//       _id: id,
//       user: req.user.id,
//     });
//     if (!transaction) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }
//     if (transaction.type === "expense") {
//       await updateBudgetSpent(
//         req.user.id,
//         transaction.category,
//         transaction.amount,
//         transaction.date,
//         "subtract"
//       );
//     } else if (transaction.type === "savings" && transaction.goalId) {
//       await updateGoalCurrent(
//         req.user.id,
//         transaction.goalId,
//         transaction.amount,
//         "subtract"
//       );
//     }
//     await Transaction.deleteOne({ _id: id });
//     res.status(200).json({ message: "Transaction deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

// // Budget Controllers
// const getBudgets = async (req, res, next) => {
//   try {
//     const budgets = await Budget.find({ user: req.user.id });
//     res.status(200).json(budgets);
//   } catch (error) {
//     next(error);
//   }
// };

// const createBudget = async (req, res, next) => {
//   try {
//     const { category, budgeted, color } = req.body;
//     if (!category || !budgeted || !color) {
//       return res
//         .status(400)
//         .json({ message: "Category, budgeted amount, and color are required" });
//     }
//     if (budgeted || parseFloat(budgeted) <= 0) {
//       return res
//         .status(400)
//         .json({ message: "Budgeted amount must be positive" });
//     }
//     if (!/^#[0-9A-F]{6}$/i.test(color)) {
//       return res
//         .status(400)
//         .json({ message: "Color must be a valid hex code (e.g., #3B82F6)" });
//     }
//     const budget = new Budget({
//       user: req.user.id,
//       category,
//       budgeted: parseFloat(budgeted),
//       color,
//       spent: 0,
//     });
//     await budget.save();
//     res.status(201).json(budget);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateBudget = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { category, budgeted, color } = req.body;
//     if (!category || !budgeted || !color) {
//       return res
//         .status(400)
//         .json({ message: "Category, budgeted amount, and color are required" });
//     }
//     if (budgeted <= 0) {
//       return res
//         .status(400)
//         .json({ message: "Budgeted amount must be positive" });
//     }
//     if (!/^#[0-9A-F]{6}$/i.test(color)) {
//       return res
//         .status(400)
//         .json({ message: "Color must be a valid hex code (e.g., #3B82F6)" });
//     }
//     const budget = await Budget.findOneAndUpdate(
//       { _id: id, user: req.user.id },
//       { category, budgeted: parseFloat(budgeted), color },
//       { new: true, runValidators: true }
//     );
//     if (!budget) {
//       return res.status(404).json({ message: "Budget not found" });
//     }
//     res.status(200).json(budget);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteBudget = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const budget = await Budget.findOneAndDelete({
//       _id: id,
//       user: req.user.id,
//     });
//     if (!budget) {
//       return res.status(404).json({ message: "Budget not found" });
//     }
//     res.status(200).json({ message: "Budget deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

// // Goal Controllers
// const getGoals = async (req, res, next) => {
//   try {
//     const goals = await Goal.find({ user: req.user.id });
//     res.status(200).json(goals);
//   } catch (error) {
//     next(error);
//   }
// };

// const createGoal = async (req, res, next) => {
//   try {
//     const { name, target, current, deadline, color } = req.body;
//     if (!name || !target || !deadline || !color) {
//       return res
//         .status(400)
//         .json({ message: "Name, target, deadline, and color are required" });
//     }
//     if (parseFloat(target) <= 0) {
//       return res
//         .status(400)
//         .json({ message: "Target amount must be positive" });
//     }
//     if (!moment(deadline, "YYYY-MM-DD", true).isValid()) {
//       return res.status(400).json({ message: "Invalid deadline date" });
//     }
//     if (!/^#[0-9A-F]{6}$/i.test(color)) {
//       return res
//         .status(400)
//         .json({ message: "Color must be a valid hex code (e.g., #FF6B6B)" });
//     }
//     const goal = new Goal({
//       user: req.user.id,
//       name,
//       target: parseFloat(target),
//       current: parseFloat(current) || 0,
//       deadline: new Date(deadline),
//       color,
//     });
//     await goal.save();
//     res.status(201).json(goal);
//   } catch (error) {
//     next(error);
//   }
// };

// const updateGoal = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { name, target, current, deadline, color } = req.body;
//     if (!name || !target || !deadline || !color) {
//       return res
//         .status(400)
//         .json({ message: "Name, target, deadline, and color are required" });
//     }
//     if (parseFloat(target) <= 0) {
//       return res
//         .status(400)
//         .json({ message: "Target amount must be positive" });
//     }
//     if (!moment(deadline, "YYYY-MM-DD", true).isValid()) {
//       return res.status(400).json({ message: "Invalid deadline date" });
//     }
//     if (!/^#[0-9A-F]{6}$/i.test(color)) {
//       return res
//         .status(400)
//         .json({ message: "Color must be a valid hex code" });
//     }
//     const goal = await Goal.findOneAndUpdate(
//       { _id: id, user: req.user.id },
//       {
//         name,
//         target: parseFloat(target),
//         current: parseFloat(current) || 0,
//         deadline: new Date(deadline),
//         color,
//       },
//       { new: true, runValidators: true }
//     );
//     if (!goal) {
//       return res.status(404).json({ message: "Goal not found" });
//     }
//     res.status(200).json(goal);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteGoal = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const goal = await Goal.findOneAndDelete({ _id: id, user: req.user.id });
//     if (!goal) {
//       return res.status(404).json({ message: "Goal not found" });
//     }
//     res.status(200).json({ message: "Goal deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

// // Notification Controllers
// const getNotifications = async (req, res, next) => {
//   try {
//     const notifications = await Notification.find({ user: req.user.id }).sort({
//       createdAt: -1,
//     });
//     res.status(200).json(notifications);
//   } catch (error) {
//     next(error);
//   }
// };

// const createNotification = async (req, res, next) => {
//   try {
//     const { type, message, time } = req.body;
//     if (!type || !message || !time) {
//       return res
//         .status(400)
//         .json({ message: "Type, message, and time are required" });
//     }
//     if (!["warning", "success", "info"].includes(type)) {
//       return res.status(400).json({ message: "Invalid notification type" });
//     }
//     const notification = new Notification({
//       user: req.user.id,
//       type,
//       message,
//       time,
//     });
//     await notification.save();
//     res.status(201).json(notification);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteNotification = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const notification = await Transaction.findOneAndDelete({
//       _id: id,
//       user: req.user.id,
//     });
//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }
//     res.status(200).json({ message: "Notification deleted" });
//   } catch (error) {
//     next(error);
//   }
// };

// // Routes
// app.post("/api/auth/register", register);
// app.post("/api/auth/login", login);

// app.get("/api/transactions", auth, getTransactions);
// app.post("/api/transactions", auth, createTransaction);
// app.put("/api/transactions/:id", auth, updateTransaction);
// app.delete("/api/transactions/:id", auth, deleteTransaction);

// app.get("/api/budgets", auth, getBudgets);
// app.post("/api/budgets", auth, createBudget);
// app.put("/api/budgets/:id", auth, updateBudget);
// app.delete("/api/budgets/:id", auth, deleteBudget);

// app.get("/api/goals", auth, getGoals);
// app.post("/api/goals", auth, createGoal);
// app.put("/api/goals/:id", auth, updateGoal);
// app.delete("/api/goals/:id", auth, deleteGoal);

// app.get("/api/notifications", auth, getNotifications);
// app.post("/api/notifications", auth, createNotification);
// app.delete("/api/notifications/:id", auth, deleteNotification);

// // Error Handler
// app.use(errorHandler);

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transactions");
const budgetRoutes = require("./routes/budgets");
const goalRoutes = require("./routes/goals");
const notificationRoutes = require("./routes/notifications");

// Initialize environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/notifications", notificationRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
