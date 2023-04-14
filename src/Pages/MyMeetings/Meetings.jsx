import React, { useEffect, useState } from "react";
import moment from "moment";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import Header from "../../Components/Header/Header";
import { meetingsRef } from "../../Utils/firebaseConfig";
import { getDocs, query } from "firebase/firestore";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./mettings.scss";
import PaginationUI from "../../Components/Pagination/Pagination";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
const Meetings = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);
  const [meetings, setMeetings] = useState([]);
  const { theme } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);

  const IndexOfLastProduct = currentPage * perPage;
  const IndexOfFirstProduct = IndexOfLastProduct - perPage;
  const CurrentMeetings = meetings.slice(
    IndexOfFirstProduct,
    IndexOfLastProduct
  );

  // Get Meetings Deatils
  useEffect(() => {
    try {
      const getMeetings = async () => {
        setIsLoading(true);
        const firestoreQuery = query(meetingsRef);
        const fetchedMeetings = await getDocs(firestoreQuery);
        if (fetchedMeetings.docs.length) {
          const myMeetings = [];
          fetchedMeetings.forEach((meeting) => {
            const data = meeting.data();
            if (data.createdBy === userInfo?.userId) {
              myMeetings.push(meeting.data());
            } else if (data.meetingType === "anyone-can-join") {
              myMeetings.push(meeting.data());
            } else {
              console.log("else 3.....");
              const index = data.invitedUsers?.findIndex(
                (user) => user === userInfo?.userId
              );
              console.log("The index is", index);
              if (index !== -1) {
                myMeetings.push(meeting.data());
              }
            }
          });
          setIsLoading(false);
          setMeetings(myMeetings);
        }
      };

      if (userInfo) {
        getMeetings();
      }
    } catch (error) {
      setIsLoading(false);
    }
  }, [userInfo]);

  //  meeting Status Handel
  const statusHandel = (meetingId, meetingDate, status) => {
    if (status) {
      if (meetingDate === moment().format("L")) {
        return (
          <Link to={`/join/${meetingId}`} style={{ textDecoration: "none" }}>
            <Chip
              label="Join Now"
              color="success"
              size="small"
              style={{ borderRadius: "7px", fontSize: "0.7rem" }}
              clickable={true}
            />
          </Link>
        );
      } else if (moment(meetingDate).isBefore(moment().format("L"))) {
        return (
          <Chip
            label="Ended"
            size="small"
            color="warning"
            style={{ borderRadius: "7px", fontSize: "0.7rem" }}
          />
        );
      } else if (moment(meetingDate).isAfter()) {
        return (
          <Chip
            label="Upcoming"
            color="secondary"
            size="small"
            style={{ borderRadius: "7px", fontSize: "0.7rem" }}
          />
        );
      }
    } else {
      return (
        <Chip
          label="Cancelled"
          size="small"
          color="error"
          style={{ borderRadius: "7px", fontSize: "0.7rem" }}
        />
      );
    }
  };
  // Meeting CopyHandel
  const CopyHandel = (meetingId) => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_REACT_APP_HOST}/join/${meetingId}`
    );
    toast.success("Copy Link", {
      position: "top-right",
      theme: theme === "light-theme" ? "light" : "dark",
    });
  };

  return (
    <div className="meeting-main">
      <Header />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {CurrentMeetings.length !== 0 ? (
            <div className="user-meeting">
              <table>
                <thead>
                  <th>Sl/No</th>
                  <th>Meeting Name</th>
                  <th>Meeting Type </th>
                  <th>Meeting Date</th>
                  <th>Status</th>
                  <th>Copy Link</th>
                </thead>
                <tbody>
                  {CurrentMeetings.map((item, index) => {
                    const {
                      meetingName,
                      meetingType,
                      meetingId,
                      meetingDate,
                      status,
                    } = item;
                    const momentDate = moment(meetingDate);
                    const formattedDate = momentDate.format("L");
                    return (
                      <tr key={meetingId}>
                        <td>{index + 1}</td>
                        <td>{meetingName}</td>
                        <td>{meetingType}</td>
                        <td>{formattedDate}</td>
                        <td>
                          {statusHandel(meetingId, formattedDate, status)}
                        </td>
                        <td>
                          {
                            <button
                              disabled={
                                moment(meetingDate).isBefore(
                                  moment().format("L")
                                ) || !status
                              }
                              onClick={() => CopyHandel(meetingId)}
                            >
                              <MdContentCopy
                                style={
                                  moment(meetingDate).isBefore(
                                    moment().format("L")
                                  ) || !status
                                    ? {
                                        color:
                                          theme === "light-theme"
                                            ? "#C5C5C5"
                                            : "#525252",
                                        cursor: "not-allowed",
                                      }
                                    : { color: "#6D00B3" }
                                }
                              />
                            </button>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {meetings.length >= perPage ? (
                <PaginationUI
                  setCurrentPage={setCurrentPage}
                  perPage={perPage}
                  totalMeetings={meetings.length}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            <NotFound />
          )}
        </>
      )}
    </div>
  );
};

export default Meetings;
