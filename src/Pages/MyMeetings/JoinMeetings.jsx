import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firebaseAuth, meetingsRef } from "../../Utils/firebaseConfig";
import { getDocs, query, where } from "firebase/firestore";
import moment from "moment";
import { toast } from "react-toastify";
import { generateMeetingID } from "../../Utils/generateMeetingID";
import { useSelector } from "react-redux";
import Loader from "../../Components/Loader/Loader";

const JoinMeetings = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isAllowed, setIsAllowed] = useState(false);
  const [user, setUser] = useState(undefined);
  const [userLoaded, setUserLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useSelector((state) => state.auth);

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }
    setUserLoaded(true);
  });

  useEffect(() => {
    const getMeetingData = async () => {
      try {
        if (params.id && userLoaded) {
          // fetch meeting data logic
          const firestoreQuery = query(
            meetingsRef,
            where("meetingId", "==", params.id)
          );
          const fetchedMeetings = await getDocs(firestoreQuery);
          //meeting excited check
          if (fetchedMeetings.docs.length) {
            const meeting = fetchedMeetings.docs[0].data();

            const isCreator = meeting.createdBy === user?.uid;
            // join one one one meeting logic
            if (meeting.meetingType === "one-on-one") {
              if (meeting.invitedUsers[0] === user?.uid || isCreator) {
                if (meeting.meetingDate === moment().format("L")) {
                  setIsAllowed(true);
                  setIsLoading(false);
                } else if (
                  moment(meeting.meetingDate).isBefore(moment().format("L"))
                ) {
                  toast.warning("Meeting has ended", {
                    position: "bottom-right",
                  });
                  navigate(user ? "/dashboard" : "/login");
                } else if (moment(meeting.meetingDate).isAfter()) {
                  toast.warning(`Meeting is on ${meeting.meetingDate}`, {
                    position: "bottom-right",
                  });
                  navigate(user ? "/dashboard" : "/login");
                }
              }
              //User not found
              else {
                navigate(user ? "/dashboard" : "/login");
              }
            }
            // join video conference meeting logic
            else if (meeting.meetingType === "video-conference") {
              const index = meeting.invitedUsers?.findIndex(
                (invitedUser) => invitedUser === user?.uid
              );

              if (index !== -1 || isCreator) {
                if (meeting.meetingDate === moment().format("L")) {
                  setIsAllowed(true);
                  setIsLoading(false);
                } else if (
                  moment(meeting.meetingDate).isBefore(moment().format("L"))
                ) {
                  toast.warning("Meeting has ended.", {
                    position: "bottom-right",
                  });
                  navigate(user ? "/dashboard" : "/login");
                } else if (moment(meeting.meetingDate).isAfter()) {
                  toast.warning(`Meeting is on ${meeting.meetingDate}`, {
                    position: "bottom-right",
                  });
                  navigate(user ? "/dashboard" : "/login");
                }
              } else {
                toast.warning("You are not invited to the meeting.", {
                  position: "bottom-right",
                });
                navigate(user ? "/dashboard" : "/login");
              }
            } else {
              setIsAllowed(true);
              setIsLoading(false);
            }
          }
        }
      } catch (error) {
        setIsLoading(false);
        toast.error(`Something Wrong!${error}`, {
          position: "bottom-right",
          theme: theme === "light-theme" ? "light" : "dark",
        });
      }
    };
    // call getMeetings fuction
    getMeetingData();
  }, [params.id, userLoaded, user, navigate]);

// import.meta.env.VITE_REACT_APP_ZOGO_API_ID;

  const API_ID=605458509 


  const myMeeting = async (element) => {
    try {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        parseInt(import.meta.env.VITE_REACT_APP_ZEGO_API_ID),
        import.meta.env.VITE_REACT_APP_ZEGO_SK_KEY,
        params.id,
        user?.uid ? user.uid : generateMeetingID(),
        user?.displayName ? user.displayName : generateMeetingID()
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp?.joinRoom({
        container: element,
        maxUsers: 50,
        sharedLinks: [
          {
            name: "Personal link",
            url: window.location.origin,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    } catch (error) {
      toast.error(`Something worng! ${error}`);
      navigate(user ? "/dashboard" : "/login");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {isAllowed ? (
            <div
              style={{
                display: "flex",
                height: "100vh",
                flexDirection: "column",
              }}
            >
              <div
                className="myCallContainer"
                ref={myMeeting}
                style={{ width: "100%", height: "100vh" }}
              ></div>
            </div>
          ) : (
            <div id="notAllowed">
              <h2>You can't join this meeting</h2>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default JoinMeetings;
