import { Navbar } from "./navbar";
import ClassCards from "./classCards";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import "./create_or_join.css"
import { UTurnRight } from "@mui/icons-material";
import OpenIconSpeedDial from "./plusButton";


export function CreateOrJoin(){
  const [user, setUser] = useState();
  const navigate = useNavigate();

  async function fetchUser(){
    try {
      const {data, error} = await supabase.auth.getUser();
      if (data) {
        setUser(data.user);
      }

      if (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchUser();
  },[])

  if (!user) {
    return(
      <div className="main-not-logged-in">
        <div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
        </div>
      <div className="not-logged-in">
        <h1 className="h1-not-logged-info">You should login first to proceed</h1>
        <Button variant="contained" style={{backgroundColor:"MenuText", color:"AppWorkspace", position:"relative"}} startIcon={<UTurnRight/>} onClick={()=>navigate("/")}>Go to login page</Button>
      </div>
      </div>
    );
  }

  return(
    <div>
    <Navbar/>
    <br/>
    <OpenIconSpeedDial/>
    </div>
  );
}