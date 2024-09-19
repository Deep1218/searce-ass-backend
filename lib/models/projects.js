const mongoose = require("mongoose");
const { dbCollection } = require("../../config/global");

const customerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return new mongoose.Types.ObjectId().toString();
      },
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: dbCollection.USERS,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    planners: [
      {
        _id: 0,
        userId: {
          type: String,
          required: true,
          ref: dbCollection.USERS,
        },
      },
    ],
    totalBudget: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model(dbCollection.PROJECTS, customerSchema);
