import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState } from "react";
//import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "react-alert";
import Exports from "../tools/DoctorCalendarHelper";
const {
  toIsoString,
  calendarFields,
  explanations,
  getNumberOfWeek,
  button,
  disabledButton,
  isValidEmail,
  onlyLetters,
} = Exports;

export default function DoctorCalendar() {
  const [calendarData, setCalendarData] = useState(null);
  const [date, setDate] = useState(null);
  let events = [];
  //const { isLoggedIn } = useAuth();
  const alert = useAlert();

  //Get data for a week
  useEffect(() => {
    const getData = async () => {
      try {
        let response = await fetch("http://localhost:8080/calendarGetWeek", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dateStart: date,
          }),
        });
        if (!response.ok) {
          alert.show(`This is an HTTP error: The status is ${response.status}`);
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setCalendarData(actualData);
      } catch (err) {
        setCalendarData(null);
      }
    };
    getData();
  }, [date, alert]);

  //Push objects into array
  useEffect(() => {
    calendarData &&
      calendarData.data.map((calendarData) =>
        events.push({
          event_id: calendarData._id,
          title: calendarData.title,
          start: new Date(
            calendarData.dateStart + " " + calendarData.timeStart
          ),
          end: new Date(calendarData.dateEnd + " " + calendarData.timeEnd),
        })
      );
  });

  //Get date of tomorrow
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  //Function after click "Confirm" in modal window
  const handleConfirm = async (event, action) => {
    if (action === "edit") {
      /** PUT event to remote DB */
    } else if (action === "create") {
      /**POST event to remote DB */
      let start = new Date(event.start).toString();
      start = new Date(start).toISOString().slice(0, 10);
      let time = new Date(event.start).toString();
      time = toIsoString(new Date(time)).slice(11, 16);
      let timeEnd = new Date(event.end).toString();
      timeEnd = toIsoString(new Date(timeEnd)).slice(11, 16);

      if (!isValidEmail(event.email)) {
        alert.show("Email address is not valid!");
        throw new Error("Email address is not valid!");
      }

      if (!onlyLetters(event.name)) {
        alert.show("Name must contains only letters!");
        throw new Error("Name must contains only letters!");
      }

      //Get week Data for a patient with email

      let response = await fetch("http://localhost:8080/calendarGetWeekEmail", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateStart: start,
          email: event.email,
        }),
      });

      let actualData = await response.json();

      //Check if a patient have more than 1 reservations per week
      if (actualData.data.length >= 2) {
        alert.show("You can create a reservation twice a week!");
        throw new Error("You can create a reservation twice a week!");
      }

      //Get day Data for a patient with email

      response = await fetch("http://localhost:8080/calendarGetEmailSingle", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dateStart: start,
          email: event.email,
        }),
      });

      actualData = await response.json();

      //Check if a patient have more than 0 reservations
      if (actualData.data.length >= 1) {
        alert.show("You can create a reservation once a day!");
        throw new Error("You can create a reservation once a day!");
      }

      //Fetch data to db

      fetch("http://localhost:8080/calendar", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: event.title,
          name: event.name,
          email: event.email,
          telnum: event.telnum,
          dateStart: start,
          timeStart: time,
          dateEnd: start,
          timeEnd: timeEnd,
        }),
      });
    }

    return new Promise((res, rej) => {
      setTimeout(() => {
        res({
          ...event,
          event_id: event.event_id || Math.random(),
        });
      }, 3000);
    });
  };

  // zložitejšie props dať do funkcie napr. getFields celé dať do funkcie
  //To čo je statické, môže byť v nejakom helperi
  return (
    <>
      {explanations()}

      <Scheduler
        onConfirm={handleConfirm}
        view="week"
        fields={calendarFields()}
        month={{
          weekDays: [],
        }}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5],
          weekStartOn: 1,
          startHour: 8,
          endHour: 19,
          step: 30,
          cellRenderer: ({ height, start, onClick }) => {
            // definitions
            const dayOfWeekDigit = start.getDay();
            let arrEven = [8, 9, 10, 11, 12, 13];
            let arrOdd = [13, 14, 15, 16, 17, 18];
            let month = start.getMonth() + 1;
            let date = start.getDate() + 1;
            const hour = start.getHours();
            const minutes = start.getMinutes();
            let disabled, disabledHour, disabledPause;
            let tomorrowISO = tomorrow.toISOString().slice(0, 10);
            let calendarDate = new Date(
              start.getFullYear() + "-" + month + "-" + date
            )
              .toISOString()
              .slice(0, 10);

            let values = disabledButton(
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
            );

            disabled = values.disabled;
            disabledHour = values.disabledHour;
            disabledPause = values.disabledPause;

            date--;
            return button(
              disabled,
              disabledHour,
              disabledPause,
              setDate,
              start,
              month,
              date,
              onClick
            );
          },
        }}
        events={events}
      />
    </>
  );
}
