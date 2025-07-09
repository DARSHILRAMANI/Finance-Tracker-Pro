// const mongoose = require("mongoose");

// const budgetSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     category: { type: String, required: true },
//     budgeted: { type: Number, required: true, min: 0 },
//     spent: { type: Number, required: true, min: 0, default: 0 },
//     deadline: { type: Date, required: true },
//     color: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// budgetSchema.index({ user: 1, category: 1 }, { unique: true });

// module.exports = mongoose.model("Budget", budgetSchema);
const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    budgeted: { type: Number, required: true, min: 0 },
    spent: { type: Number, required: true, min: 0, default: 0 },
    deadline: { type: Date, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
