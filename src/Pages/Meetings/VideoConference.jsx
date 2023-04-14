import React, { useState } from "react";
import Header from "../../Components/Header/Header";
import "./oneononeMeeting.scss";
import Button from "@mui/joy/Button";
import useFetchUsers from "../../Hooks/useFetchUsers";
import { useNavigate } from "react-router-dom";
import { generateMeetingID } from "../../Utils/generateMeetingID";
import { useSelector } from "react-redux";
import { meetingsRef } from "../../Utils/firebaseConfig";
import { toast } from "react-toastify";
import { addDoc } from "firebase/firestore";
import Select from "react-select";
import { FormControlLabel, Switch } from "@mui/material";
import moment from "moment";

const VideoConference = () => {
  const users = useFetchUsers();
  const [meetingName, setMeetingName] = useState("");
  const [seletedUser, setSeletedUser] = useState([]);
  const [newdate, setNewDate] = useState("");
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [maxUsers, setMaxUsers] = useState();
  const userId = useSelector((state) => state.auth.userInfo?.userId);
  const { theme } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  // video confernces meeting submit
  const meetingSubmitHandel = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const meetingId = generateMeetingID();
    const momentDate = moment(newdate);
    const formattedDate = momentDate.format("L");
    try {
      
      await addDoc(meetingsRef, {
        createdBy: userId,
        meetingId,
        meetingName,
        meetingType: checked ? "anyone-can-join" : "video-conference",
        invitedUsers: checked ? [] : seletedUser.map((user) => user.userId),
        meetingDate: formattedDate,
        maxUsers: checked ? maxUsers : 50,
        status: true,
      });
      toast.success(
        `${
          checked
            ? "Anyone can join meeting created successfully"
            : "Video Conference created successfully"
        }`,
        {
          position: "bottom-right",
          theme: theme === "light-theme" ? "light" : "dark",
        }
      );
      setIsLoading(false)
      navigate("/dashboard");
     
    } catch (error) {
      setIsLoading(false)
      toast.error(`Something Wrong!${error}`, {
        position: "bottom-right",
        theme: theme === "light-theme" ? "light" : "dark",
      });
    }
  };
  const handleChange = (selectedOption) => {
    setSeletedUser(selectedOption);
  };

  const handleChangeSwitch = (event) => {
    setChecked(event.target.checked);
  };

  // maximum 50 users add logic
  const maxUsersHandel = (e) => {
    if (!e.target.value.length || parseInt(e.target.value) === 0) {
      setMaxUsers(1);
    } else if (parseInt(e.target.value) > 50) {
      setMaxUsers(50);
      toast.info("maximum 50 people can join");
    } else {
      setMaxUsers(parseInt(e.target.value));
    }
  };

  return (
    <div className="oneOnOneMetting">
      <Header />
      <div className="oneOnOneMetting-main">
        <form onSubmit={meetingSubmitHandel}>
          <h2>Create Video Conference Meeting</h2>
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                checked={checked}
                onChange={handleChangeSwitch}
              />
            }
            label="Anyone can join"
          />
          <input
            className="input-filed"
            placeholder="Meeting Name"
            type="text"
            required
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
          />

          {checked ? (
            <input
              className="input-filed"
              placeholder="Maximum People"
              type="number"
              min={1}
              max={50}
              required
              value={maxUsers}
              onChange={maxUsersHandel}
            />
          ) : (
            <aside className="select-filed">
              <Select
                classNamePrefix="filter"
                placeholder="Select a user"
                value={seletedUser}
                onChange={handleChange}
                isMulti
                options={users}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    marginTop: "0.7rem",
                    borderColor:
                      theme === "light-theme" ? "#292929" : "#FFFFFF",
                    borderRadius: "10px",
                    backgroundColor:
                      theme === "light-theme" ? "#FFFFFF" : "#292929",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    color: theme === "light-theme" ? "#292929" : "#FFFFFF",
                  }),
                  option: (base, state) => ({
                    ...base,
                    color: theme === "light-theme" ? "#292929" : "#FFFFFF",
                    backgroundColor:
                      theme === "light-theme" ? "#FFFFFF" : "#292929",
                    padding: ".5rem 3rem .5rem .5rem",
                    cursor: "pointer",
                  }),
                  singleValue: provided => ({
                    ...provided,
                    color: theme === "light-theme" ? "#292929" : "#FFFFFF",
                  })
                }}
              />
            </aside>
          )}

          <input
            type="date"
            className="date-filed"
            value={newdate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <div>
            <Button
              size="md"
              variant="outlined"
              color="danger"
              onClick={() => navigate("/")}
            >
              {" "}
              Cancel{" "}
            </Button>
            <Button
              size="md"
              variant="solid"
              color="info"
              type="submit"
              loading={isLoading}
              disabled={seletedUser === "Invite User" ? true : false}
            >
              {" "}
              Submit{" "}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoConference;
