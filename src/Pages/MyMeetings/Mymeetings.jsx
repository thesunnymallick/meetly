import React, { useEffect, useState } from "react";
import "./mymeetings.scss";
import Header from "../../Components/Header/Header";
import { useSelector } from "react-redux";
import { meetingsRef } from "../../Utils/firebaseConfig";
import { getDocs, query, where } from "firebase/firestore";
import { FiEdit } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import moment from "moment";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import EditComponent from "../../Components/EditComponent/EditComponent";
import { toast } from "react-toastify";
import PaginationUI from "../../Components/Pagination/Pagination";
import NotFound from "../../Components/NotFound/NotFound";
import Loader from "../../Components/Loader/Loader";
const Mymeetings = () => {
  const userId = useSelector((state) => state.auth.userInfo?.userId);
  const [meetings, setMeetings] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectMeetingId, setSelectMeetingId] = useState("");
  const { theme } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(6);
  
    const IndexOfLastProduct = currentPage * perPage;
    const IndexOfFirstProduct = IndexOfLastProduct - perPage;
    const CurrentMeetings = meetings.slice(
      IndexOfFirstProduct,
      IndexOfLastProduct
    );

   
  useEffect(() => {
    try {
      const getMeetings = async () => {
        setIsLoading(true);
        const firestoreQuery = query(
          meetingsRef,
          where("createdBy", "==", userId)
        );
        const fetchedMeetings = await getDocs(firestoreQuery);
        if (fetchedMeetings.docs.length) {
          const myMeetings = [];
  
          fetchedMeetings.forEach((meeting) => {
            myMeetings.push({
              docId: meeting.id,
              ...meeting.data(),
            });
          });
          setIsLoading(false)
          setMeetings(myMeetings);
        }
      };
      getMeetings();
    } catch (error) {
      setIsLoading(false);
    }
  }, [userId]);

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
            color="warning"
            size="small"
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
          color="error"
          size="small"
          style={{ borderRadius: "7px", fontSize: "0.7rem" }}
        />
      );
    }
  };

  // Open Edit sideBar
  const EditHandel = (docId) => {
    setIsOpen(!isOpen);
    setSelectMeetingId(docId);
  };
  // Copy meeting Link
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
    <div className="myMeetings">
      <Header />
       {
         isLoading ? <Loader/> : 
         <>
        {
        CurrentMeetings.length!==0? 
        <div className="meeting">
        <table>
          <thead>
            <th>SL/NO</th>
            <th>Meeting Name</th>
            <th>Meeting Type </th>
            <th>Meeting Date</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Copy Link</th>
          </thead>
          <tbody>
            {CurrentMeetings.map((item,index) => {
              const {
                meetingName,
                meetingType,
                meetingId,
                meetingDate,
                status,
                docId,
              } = item;
              const momentDate = moment(meetingDate);
              const formattedDate = momentDate.format("L");
              return (
                <tr key={meetingId}>
                  <td>{index+1}</td>
                  <td>{meetingName}</td>
                  <td>{meetingType}</td>
                  <td>{formattedDate}</td>
                  <td>{statusHandel(meetingId, formattedDate, status)}</td>
                  <td>
                    <button
                      onClick={() => EditHandel(docId)}
                      disabled={
                        moment(meetingDate).isBefore(moment().format("L")) ||
                        !status
                      }
                    >
                      <FiEdit
                        style={
                          moment(meetingDate).isBefore(moment().format("L")) ||
                          !status
                            ? {
                                color:
                                  theme === "light-theme"
                                    ? "#C5C5C5"
                                    : "#525252",
                                cursor: "not-allowed",
                              }
                            : { color: "4BB543" }
                        }
                      />
                    </button>
                  </td>
                  <td>
                    {
                      <button
                        disabled={
                          moment(meetingDate).isBefore(moment().format("L")) ||
                          !status
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
        
        {isOpen && (
          <EditComponent
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            meetings={meetings}
            docId={selectMeetingId}
          />
        )}
      </div>:
      <NotFound/>
      }
         </>
       }
      
    </div>
  );
};

export default Mymeetings;
