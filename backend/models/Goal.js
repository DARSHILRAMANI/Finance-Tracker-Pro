const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    target: { type: Number, required: true, min: 0 },
    current: { type: Number, required: true, min: 0, default: 0 },
    deadline: { type: Date, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Goal", goalSchema);
