import React from "react";
import useAuth from "../../Hooks/useAuth";
import Header from "../../Components/Header/Header";
import "./dashboard.scss";
import { Link } from "react-router-dom";
import dashboard1 from "../../assets/dashboard1.png";
import dashboard2 from "../../assets/dashboard2.png";
import dashboard3 from "../../assets/dashboard3.png";
const Dashboard = () => {
  // fetch user details
  useAuth();
  return (
    <>
      <div className="dashboard-main">
        <Header />
        <div className="dashboard">
          <Link to="/dashboard/create-meeting">
            <div>
              <img src={dashboard1} alt="create meeting" />
              <h1>Create Meeting</h1>
              <p>Create a new meeting and invite people.</p>
            </div>
          </Link>
          <Link to="/dashboard/my-meetings">
            <div className="hover-effect">
              <img src={dashboard2} alt="My meetings" />
              <h1>My Meetings</h1>
              <p>View your all meettings.</p>
            </div>
          </Link>
          <Link to="/dashboard/meetings">
            <div>
              <img src={dashboard3} alt="Meetings" />
              <h1>Meetings</h1>
              <p>View the mettings that you are invite to.</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
