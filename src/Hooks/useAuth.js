import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../Utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const isAuthenticated = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        dispatch({
          type: "LOGIN_USER",
          payload: {
            userId: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            userImg: currentUser.photoURL,
          },
        });
      }
    });
    return () => isAuthenticated();
  }, [dispatch, navigate]);
};

export default useAuth;
