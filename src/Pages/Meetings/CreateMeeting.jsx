import React from "react";
import Header from "../../Components/Header/Header";
import oneOnOneMeeting from "../../assets/one-one-meeting.png";
import videoConferance from "../../assets/video-conferance.png";
import "./createMeeting.scss";
import useAuth from "../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";
const CreateMeeting = () => {
  // fetch user deatils
  useAuth();
  const naviagte = useNavigate();

  return (
    <div className="create-meeting">
      <Header />
      <div className="create-meeting-main">
        <div onClick={() => naviagte("/dashboard/create-meeting/one-on-one-meeting")}>
          <img src={oneOnOneMeeting} alt="one on one meeting " />
          <h2>Create 1 on 1 Meeting</h2>
          <p>Create a personal single person meeting</p>
        </div>

        <div onClick={() => naviagte("/dashboard/create-meeting/video-Conference")}>
          <img src={videoConferance} alt="group metting" />
          <h2>Video Conference</h2>
          <p>invite multiple persons to the meeting</p>
        </div>
      </div>
    </div>
  );
};

export default CreateMeeting;
