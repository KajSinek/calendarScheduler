import { Button } from "@mui/material";
const exports = {};

exports.toIsoString = (date) => {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
};

exports.calendarFields = () => {
  //Array with objects -> form inputs after click on the calendar field
  return [
    {
      name: "title",
      type: "input",
      default: "Reserved",
      config: { label: "title", required: true },
    },
    {
      name: "name",
      type: "input",
      config: { label: "Name", required: true },
    },
    {
      name: "email",
      type: "input",
      config: { label: "Email", required: true },
    },
    {
      name: "telnum",
      type: "input",
      config: { label: "Telephone Number", required: true },
    },
  ];
};

exports.explanations = () => {
  //Explanations for calendar
  return (
    <div>
      <ul>
        <li>
          <div>
            <div className="box red"></div> Closed
          </div>
        </li>
        <li>
          <div>
            <div className="box gray"></div> Blocked
          </div>
        </li>
        <li>
          <div>
            <div className="box yellow"></div> Break
          </div>
        </li>
        <li>
          <div>
            <div className="box blue"></div> Reserved
          </div>
        </li>
      </ul>
    </div>
  );
};

exports.getNumberOfWeek = (start, month) => {
  //Current date with Isostring format
  let currentDate = new Date(
    start.getFullYear() + "-" + month + "-" + start.getDate()
  );

  //Get first day of a year and how many days have passed since the beginning of the year
  let startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

  //Days devided by 7
  var weekNumber = Math.ceil(days / 7);

  // Display the calculated result
  return weekNumber;
};

exports.disabledButton = (
  dayOfWeekDigit,
  disabled,
  hour,
  minutes,
  arrEven,
  start,
  month,
  tomorrowISO,
  calendarDate,
  disabledHour,
  disabledPause,
  getNumberOfWeek,
  arrOdd
) => {
  if (dayOfWeekDigit % 2 === 0) {
    //Conditions when a buttons can be blocked/disabled
    disabled =
      (hour === 11 && minutes === 0) ||
      !arrEven.includes(hour) ||
      (getNumberOfWeek(start, month) % 2 === 1 && start.getDay() === 6) ||
      tomorrowISO > calendarDate;
    disabledHour = !arrEven.includes(hour);
    disabledPause = hour === 11 && minutes === 0;
  } else {
    disabled =
      (hour === 16 && minutes === 0) ||
      !arrOdd.includes(hour) ||
      (getNumberOfWeek(start, month) % 2 === 1 && start.getDay() === 6) ||
      tomorrowISO >= calendarDate;
    disabledHour = !arrOdd.includes(hour);
    disabledPause = hour === 16 && minutes === 0;
  }

  return {
    disabled: disabled,
    disabledHour: disabledHour,
    disabledPause: disabledPause,
  };
};

exports.button = (
  disabled,
  disabledHour,
  disabledPause,
  setDate,
  start,
  month,
  date,
  onClick
) => {
  //Button with a properties
  return (
    <Button
      style={{
        height: "100%",
        background: disabled
          ? disabledHour
            ? "#FF5C5D"
            : disabledPause
            ? "#F29D00"
            : "#eee"
          : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onClick={() => {
        date--;
        setDate(start.getFullYear() + "-" + month + "-" + date);
        if (disabled) {
          return alert("The office in this time is close.");
        }
        onClick();
      }}
      onload={setDate(start.getFullYear() + "-" + month + "-" + date)}
      disableRipple={disabled}
      // disabled={disabled}
    ></Button>
  );
};

exports.isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

exports.onlyLetters = (name) => {
  return /^[a-zA-Z]+$/.test(name);
};

export default exports;
