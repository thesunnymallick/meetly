import React from "react";
import Button from "@mui/material/Button";
import animationBg from "../../assets/animation.gif";
import logo from "../../assets/logo.png";
import "./login.scss";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { firebaseAuth, db, usersRef} from "../../Utils/firebaseConfig";
import {FcGoogle} from "react-icons/fc"
import {addDoc, getDocs, query, where, collection} from "firebase/firestore";
import {useNavigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import { toast } from "react-toastify";
const Login = () => {

  const navigate=useNavigate();
  const dispatch=useDispatch();
  const { theme } = useSelector((state) => state.auth);
   onAuthStateChanged(firebaseAuth, (currentUser)=>{
      if(currentUser){
        navigate("/dashboard");
      }
   })
     
  //  Login with Google
  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const {user:{displayName, email, photoURL, uid}}=await signInWithPopup(firebaseAuth, provider)
      console.log({displayName, email, photoURL, uid})
          if(email){
           const firebaseQuery=query(usersRef, where("userId", "==", uid));
           const fetchUsers=await getDocs(firebaseQuery);
           if(fetchUsers.docs.length===0){
            await addDoc(collection(db, "users"), 
            {
              userId:uid,
              name:displayName,
              email,
              userImg:photoURL,
            })
           }
          }
      dispatch({
        type:"LOGIN_USER",
        payload:{
              userId:uid,
              name:displayName,
              email,
              userImg:photoURL,
        }
      })
      navigate("/dashboard");
      toast.success("Login Successfull", {
        position: "bottom-right",
        theme: theme === "light-theme" ? "light" : "dark",
      })
    } catch (error) {
      console.log(error);
    }

     
  };

  return (
    <div className="login">
      <section>
        <aside>
          <img src={animationBg} alt="loginBg" />
        </aside>
        <div>
          <section>
            <img src={logo} alt="logo" />
            <h2>
              One Platform To <span>Connect</span>
            </h2>
            <Button variant="contained" color="secondary" onClick={login}>
              <p><FcGoogle/></p>  <span>LOG IN WITH GOOGLE</span>
            </Button>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Login;
