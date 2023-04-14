import {createReducer} from "@reduxjs/toolkit"

 export const authReducer=createReducer(
    {
       userInfo:{
        userId:"",
        name:"",
        email:"",
        userImg:""
       },
       theme:"light-theme"
    },
    {
        LOGIN_USER:(state, action)=>{
          
            state.userInfo=action.payload;
        },
        SET_THEME:(state, action)=>{
          state.theme=action.payload;
        }
    })