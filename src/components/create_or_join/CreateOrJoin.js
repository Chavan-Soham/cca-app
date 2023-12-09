import { Navbar } from "./navbar";
import ClassCards from "./classCards";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";


export function CreateOrJoin(){
  const navigate = useNavigate()
  const [user, setUser] = useState()
  async function fetchUserData(){
    try {
        const {data, error, status} = await supabase.auth.getUser();
        if (error) {
            console.log(error)
            if(status === 401){
              navigate("/")
            }
        }
        if (data) {
            setUser(data)
        }
    } catch (error) {
        console.error('Error fetching user data: ', error)
    }
}

useEffect(()=>{
    fetchUserData()
},[])

/*if (!user) {
  return (
    <div>
      <p>User should log in first, go back to the login page.</p>
      <button onClick={() => navigate("/")}>Go to Login</button>
    </div>
  );
}*/
    return(
      <div>
      <Navbar/>
      <br/>
      <ClassCards/>
      </div>
    );
}