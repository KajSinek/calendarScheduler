import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import DoctorCalendar from "./components/DoctorCalendar";

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="App">
      <Header />

      {isLoggedIn ? <LoggedInText /> : <LoggedOutText />}
      <Routes>
        <Route path="/" element={<div>Test Home</div>} />
        <Route path="scheduler" element={<DoctorCalendar />} />
      </Routes>
    </div>
  );
}

const LoggedInText = () => {
  const { account } = useAuth();

  return (
    <p>
      Hey, {account.username}! I'm happy to let you know: you are authenticated!
    </p>
  );
};

const LoggedOutText = () => (
  <p>Don't forget to start your backend server, then authenticate yourself.</p>
);
