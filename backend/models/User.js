// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     username: String,
//     email: String,
//     password: String,
//     profile: {
//       firstName: String,
//       lastName: String,
//       dateOfBirth: Date,
//       gender: String,
//       phoneNumber: String,
//       address: {
//         street: String,
//         city: String,
//         state: String,
//         zipCode: String,
//         country: String,
//       },
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,

    // Accept code from frontend (must be 6-digit string)
    verificationCode: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v); // ensure it's a 6-digit number string
        },
        message: (props) => `${props.value} is not a valid 6-digit code`,
      },
    },

    profile: {
      firstName: String,
      lastName: String,
      dateOfBirth: Date,
      gender: String,
      phoneNumber: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
