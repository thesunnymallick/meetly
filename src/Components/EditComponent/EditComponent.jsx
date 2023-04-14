import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import "./editMeetings.scss";
import Button from "@mui/joy/Button";
import useFetchUsers from "../../Hooks/useFetchUsers";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import Select from "react-select";
import { FormControlLabel, Switch } from "@mui/material";
import moment from "moment";
import { db } from "../../Utils/firebaseConfig";

const EditComponent = ({ isOpen, setIsOpen, meetings, docId }) => {
  const editMeeting = meetings.find((item) => item.docId === docId);
  const users = useFetchUsers();
  const [meetingName, setMeetingName] = useState(editMeeting.meetingName);
  const [seletedUser, setSeletedUser] = useState([]);
  //moment date convert
  const convertedDate = moment(editMeeting.meetingDate);
  const [newdate, setNewDate] = useState(convertedDate);
  const [checked, setChecked] = useState(
    editMeeting.maxUsers === 50 ? false : true
  );
  const [maxUsers, setMaxUsers] = useState(editMeeting.maxUsers);
  const [isCancel, setIsCancel] = useState(false);
  const [status, setStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useSelector((state) => state.auth);

  //logic set value invited users
  useEffect(() => {
    if (users) {
      const foundUsers = [];
      editMeeting.invitedUsers?.forEach((user) => {
        const findUser = users.find((tempUser) => tempUser.userId === user);
        if (findUser) foundUsers.push(findUser);
      });
      setSeletedUser(foundUsers);
    }
  }, [users, editMeeting]);

  // Edit Meetings
  const meetingSubmitHandel = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const momentDate = moment(newdate);
    const formattedDate = momentDate.format("L");
    try {
      setDoc(doc(db, "meetings", docId), {
        createdBy: editMeeting.createdBy,
        meetingId: editMeeting.meetingId,
        meetingName,
        meetingType:
          seletedUser.length === 1
            ? "one-on-one"
            : checked
            ? "anyone-can-join"
            : "video-conference",
        invitedUsers: checked ? [] : seletedUser.map((user) => user.userId),
        meetingDate: formattedDate,
        maxUsers: checked ? maxUsers : 50,
        status: status,
      });

      toast.success(
        `${
          checked
            ? "Anyone can join meeting upadte successfully"
            : "Video Conference update successfully"
        }`,
        {
          position: "bottom-right",
          theme: theme === "light-theme" ? "light" : "dark",
        }
      );
      setIsOpen(false);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      setIsLoading(false);
      setIsOpen(false);
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
  const CancelHandelSwitch = (event) => {
    setIsCancel(event.target.checked);
    setStatus(false);
  };

  const maxUsersHandel = (e) => {
    if (!e.target.value.length || parseInt(e.target.value) === 0) {
      setMaxUsers(1);
    } else if (parseInt(e.target.value) > 50) {
      setMaxUsers(50);
      toast.info("maximum 50 people can join", {
        theme: theme === "light-theme" ? "light" : "dark",
      });
    } else {
      setMaxUsers(parseInt(e.target.value));
    }
  };

  const list = () => (
    <Box sx={{ width: 250 }} role="presentation" className="editMeeting-main">
      <div className="editMeeting">
        <form onSubmit={meetingSubmitHandel}>
          <h2>Edit Meeting</h2>
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
                    borderColor:
                      theme === "light-theme" ? "#292929" : "#FFFFFF",
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
                }}
              />
            </aside>
          )}

          <input
            type="date"
            className="date-filed"
            value={newdate.format("YYYY-MM-DD")}
            onChange={(e) => setNewDate(moment(e.target.value, "YYYY-MM-DD"))}
          />

          <FormControlLabel
            control={
              <Switch
                color="error"
                checked={isCancel}
                onChange={CancelHandelSwitch}
              />
            }
            label="Canceled Meeting"
          />
          <div>
            <Button
              size="md"
              variant="outlined"
              color="danger"
              onClick={() => setIsOpen(false)}
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
    </Box>
  );

  return (
    <div>
      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        {list()}
      </Drawer>
    </div>
  );
};

export default EditComponent;
