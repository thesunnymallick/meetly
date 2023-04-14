import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/auth/Login";
import Dashboard from "./Pages/dashboard/Dashboard";
import "./Style/app.scss";
import CreateMeeting from "./Pages/Meetings/CreateMeeting";
import OneOnOneMeeting from "./Pages/Meetings/OneOnOneMeeting";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoConference from "./Pages/Meetings/VideoConference";
import Mymeetings from "./Pages/MyMeetings/Mymeetings";
import Meetings from "./Pages/MyMeetings/Meetings";
import JoinMeetings from "./Pages/MyMeetings/JoinMeetings";
import Loader from "./Components/Loader/Loader";
import { useEffect, useState } from "react";
function App() {
  const [isLoading, setIsLoading] = useState(false);
//
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    },5000);
  },[]);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/dashboard/create-meeting"
              element={<CreateMeeting />}
            />
            <Route
              path="/dashboard/create-meeting/one-on-one-meeting"
              element={<OneOnOneMeeting />}
            />
            <Route
              path="/dashboard/create-meeting/video-Conference"
              element={<VideoConference />}
            />
            <Route path="/dashboard/my-meetings" element={<Mymeetings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/meetings" element={<Meetings />} />
            <Route path="/join/:id" element={<JoinMeetings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
