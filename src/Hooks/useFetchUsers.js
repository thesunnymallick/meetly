import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { db, usersRef } from '../Utils/firebaseConfig';

const useFetchUsers = () => {
  
    const userId=useSelector((state)=>state.auth.userInfo?.userId)
    const [users, setUsers]=useState([]);

    useEffect(()=>{
        if(userId){
            const getUsers=async()=>{
                const firestoreQuery=query(usersRef,where("userId", "!=",userId));
                const data=await getDocs(firestoreQuery)
                const firebaseUsers=[];
                data.forEach((user)=>{
                    firebaseUsers.push({
                        ...user.data(),
                        label:user.data().name,
                        value:user.data().name
                    })
                })
                  setUsers(firebaseUsers)
            
            }
            getUsers();
        }
       
    },[userId])
    return users;
}  

export default useFetchUsers