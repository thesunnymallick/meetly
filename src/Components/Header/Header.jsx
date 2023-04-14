import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiDark } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import { MdOutlineLogin, MdOutlineLightMode } from "react-icons/md";
import "./header.scss";
import logo from "../../assets/logo1.png";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../Utils/firebaseConfig";
import { signOut } from "firebase/auth";
import useAuth from "../../Hooks/useAuth";
const Header = () => {
  useAuth();
  const {
    userInfo: { name, userImg },
  } = useSelector((state) => state.auth);
  const naviagte = useNavigate();
  const dispatch=useDispatch();

  const [theme, setTheme] = useState("light-theme");
  const local_theme = localStorage.getItem("meet-now");

  // change theme
  const toggleTheme = () => {
    if (theme === "light-theme") {
      setTheme("dark-theme");
      localStorage.setItem("meet-now", theme);
    } else {
      setTheme("light-theme");
      localStorage.setItem("meet-now", theme);
    }
   

  };

  useEffect(() => {
    document.body.className = local_theme;
    dispatch({
      type:"SET_THEME",
      payload:local_theme
    })
  }, [local_theme, dispatch]);

  let crumbLink = "";
  const crumbPath = location.pathname
    .split("/")
    .filter((path) => path !== "")
    .map((crumb) => {
      crumbLink += `/${crumb}`;
      return (
        <Link className="breadCrums" to={crumbLink} key={crumb}>
          {crumb}
        </Link>
      );
    });
    console.log("Path",crumbPath)

    

  const LogutHandel = () => {
    signOut(firebaseAuth)
      .then(() => {
        console.log("log out success full");
      })
      .catch((error) => {
        console.log("log out ", error);
      });
  };
  const LogInHandel = () => {
    console.log("log in");
    naviagte("/login");
  };

  return (
    <>
      <div className="header-1">
        <div>
          <section>
            <img src={logo} alt="Logo" onClick={()=>naviagte("/dashboard")} />
          </section>
        </div>

        <div>
          {name ? <h2> Hi, {name}</h2> : null}
          {userImg ? (
            <span>
              <img src={userImg} alt="userImg" />
            </span>
          ) : null}
          <div>
            {local_theme === "dark-theme" ? (
              <MdOutlineLightMode onClick={toggleTheme} />
            ) : (
              <CiDark onClick={toggleTheme} />
            )}
          </div>
          {name ? (
            <IoMdLogOut onClick={LogutHandel} />
          ) : (
            <MdOutlineLogin onClick={LogInHandel} />
          )}
        </div>
      </div>

      <div className="header-2">
        <div>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {crumbPath}
          </Breadcrumbs>
        </div>
      </div>
    </>
  );
};

export default Header;
