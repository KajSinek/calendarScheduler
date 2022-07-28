const mongo = require("../../utils/mongo"); // MongoDB (database)
const Calendaradd = require("../../models/CalendarAdd");

exports.calendarCreateReservation = async function (req, res) {
  await mongo.connect();

  try {
    const {
      title,
      name,
      email,
      telnum,
      dateStart,
      timeStart,
      dateEnd,
      timeEnd,
    } = req.body;

    const existingReservation = await Calendaradd.findOne({
      dateStart,
      timeStart,
    });
    if (existingReservation) {
      return res.status(400).json({
        error: dateStart + " " + timeStart,
        message: 'An account already exists with that "date and time"',
      });
    }

    const newReservation = new Calendaradd({
      title,
      name,
      email,
      telnum,
      dateStart,
      timeStart,
      dateEnd,
      timeEnd,
    });
    await newReservation.save();

    res.status(201).json({
      message: "Succesfully",
      data: newReservation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
};

exports.calendarGetReservation = async function (req, res) {
  await mongo.connect();

  try {
    // Get account from DB, and verify existance
    const foundAccount = await Calendaradd.find({});
    if (!foundAccount) {
      return res.status(400).json({
        message: "Bad credentials",
      });
    }

    res.status(200).json({
      message: "Succesfully generated calendar data",
      data: foundAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

exports.calendarGetReservationsWeek = async function (req, res) {
  await mongo.connect();

  const { dateStart } = req.body;

  let week = [];

  const today = new Date(dateStart);
  const first = today.getDate() - today.getDay() + 1;

  const monday = new Date(today.setDate(first));

  var thisDay = new Date(dateStart);
  var startingDay = new Date(monday);
  for (var i = 0; i < 7; i++) {
    thisDay.setDate(startingDay.getDate() + i);
    week.push(thisDay.toISOString().slice(0, 10));
  }

  try {
    // Get account from DB, and verify existance

    const foundAccount = await Calendaradd.find({ dateStart: { $in: week } });
    if (!foundAccount) {
      return res.status(400).json({
        message: "Bad credentials",
      });
    }

    res.status(201).json({
      message: "Succesfully generated calendar data",
      data: foundAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

exports.calendarGetReservationsWeekEmail = async function (req, res) {
  await mongo.connect();

  const { email, dateStart } = req.body;

  let week = [];

  const today = new Date(dateStart);
  const first = today.getDate() - today.getDay() + 1;

  const monday = new Date(today.setDate(first));

  var thisDay = new Date(dateStart);
  var startingDay = new Date(monday);
  for (var i = 0; i < 7; i++) {
    thisDay.setDate(startingDay.getDate() + i);
    week.push(thisDay.toISOString().slice(0, 10));
  }

  try {
    // Get account from DB, and verify existance

    const foundAccount = await Calendaradd.find({
      $and: [{ dateStart: { $in: week } }, { email: { $eq: email } }],
    });
    if (!foundAccount) {
      return res.status(400).json({
        message: "Bad credentials",
      });
    }

    res.status(201).json({
      message: "Succesfully generated calendar data",
      data: foundAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};

exports.calendarGetReservationEmailSingle = async function (req, res) {
  await mongo.connect();

  const { email, dateStart } = req.body;

  try {
    // Get account from DB, and verify existance

    const foundAccount = await Calendaradd.find({
      $and: [{ dateStart: { $eq: dateStart } }, { email: { $eq: email } }],
    });
    if (!foundAccount) {
      return res.status(400).json({
        message: "Bad credentials",
      });
    }

    res.status(201).json({
      message: "Succesfully generated calendar data",
      data: foundAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};
