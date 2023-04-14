import React, { useEffect, useState } from "react";
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
import moment from "moment";
const OneOnOneMeeting = () => {
  const users = useFetchUsers();
  const [meetingName, setMeetingName] = useState("");
  const [seletedUser, setSeletedUser] = useState([]);
  const [newdate, setNewDate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userInfo?.userId);
  const { theme } = useSelector((state) => state.auth);

  // One on one meeting create:
  const meetingSubmitHandel = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const meetingId = generateMeetingID();
    const momentDate = moment(newdate);
    const formattedDate = momentDate.format("L");
    try {
      await addDoc(meetingsRef, {
        createdBy: userId,
        meetingId,
        meetingName,
        meetingType: "one-on-one",
        invitedUsers: [seletedUser.userId],
        meetingDate: formattedDate,
        maxUsers: 1,
        status: true,
      });
      setIsLoading(false);
      toast.success("One on One Meeting Created Successfully", {
        position: "bottom-right",
        theme: theme === "light-theme" ? "light" : "dark",
      });
      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      toast.error(`Something Wrong!${error}`, {
        position: "bottom-right",
        theme: theme === "light-theme" ? "light" : "dark",
      });
    }
  };

  // set select user the meeting
  const handleChange = (selectedOption) => {
    setSeletedUser(selectedOption);
  };

  return (
    <div className="oneOnOneMetting">
      <Header />
      <div className="oneOnOneMetting-main">
        <form onSubmit={meetingSubmitHandel}>
          <h2>Create One On One Meeting</h2>
          <input
            className="input-filed"
            placeholder="Meeting Name"
            type="text"
            required
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
          />
          <aside className="select-filed">
            <Select
              classNamePrefix="filter"
              placeholder="Select a user"
              value={seletedUser}
              onChange={handleChange}
              options={users.length === 0 ? [{ label: "Invite User" }] : users}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: theme === "light-theme" ? "#292929" : "#FFFFFF !importnat",
                  borderRadius: "10px",
                  backgroundColor:
                    theme === "light-theme" ? "#FFFFFF" : "#292929",
                  paddingTop: "3px",
                  paddingBottom: "3px",
                  marginTop: "0.7rem",
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

export default OneOnOneMeeting;
