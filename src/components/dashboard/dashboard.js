import { useLocation } from "react-router-dom";
import { Navbar } from "./dashNavbar";
import supabase from "../../supabaseClient"
import { useEffect, useState } from "react";


export function ClassDashboard(){
    const [class_id, setClassId] = useState()
    const location = useLocation()
    const getClassName = location.state.clickedClass;
    console.log(getClassName)

    return(
        <div>
            <Navbar/>
             <h1>{getClassName}</h1>
        </div>
    );
}