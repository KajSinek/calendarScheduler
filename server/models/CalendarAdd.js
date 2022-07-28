const mongoose = require("mongoose");

const instance = new mongoose.Schema(
  {
    /*
      document ID is set by default via MongoDB - next line is deprecated
      _id: mongoose.Schema.Types.ObjectId,
    */

    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    telnum: {
      type: String,
      required: true,
    },
    dateStart: {
      type: String,
      required: true,
    },
    timeStart: {
      type: String,
      required: true,
    },
    dateEnd: {
      type: String,
      required: true,
    },
    timeEnd: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// NOTE! use a singular model name, mongoose automatically creates a collection like so:
// model: 'Account' === collection: 'accounts'
const modelName = "Calendaradd";

module.exports = mongoose.model(modelName, instance);
