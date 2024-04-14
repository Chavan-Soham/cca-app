import React, { useState } from "react";
import supabase from "../../supabaseClient";
import { Typography } from "@mui/material"
import { Link } from "react-router-dom";


export default function About({classId}){
    const [className, setClassName] = useState('')
    const [classBio, setClassBio] = useState('')
    const [classImage, setClassImage] = useState('')
    const [noOfMember, setNoOfMember] = useState([])
    const [teacherName, setTeacherName] = useState('')
    

    
    async function classDetails(){
        const {data: number, error: e} = await supabase
        .from("class_members_duplicate")
        .select("member_name")
        .eq("classId", classId)

        if (number) {
            setNoOfMember(number.length)
            
        }
        if (e) {
            console.log(e)
        }


        const {data, error} = await supabase
            .from("class_duplicate")
            .select("class_name, class_description, teacher_name, class_image")
            .eq("class_id", classId)
        if (data) {
            setClassName(data[0].class_name)
            setClassBio(data[0].class_description)
            setClassImage(data[0].class_image)
            setTeacherName(data[0].teacher_name)
        }
        if (error) {
            console.log(error)
        }
    }

    useState(()=>{
        classDetails()
    },[])

    
    return(
        <div>
            <center>
            <h1>{className}</h1>
            <Link to={`${classImage}`}>
                <div style={{backgroundImage: `url('${classImage}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain',width: '600px', height: '380px'}}></div>
            </Link>
            <div>
                <h3>{classBio}</h3>
            </div>
            <div>
                <h4>Teacher: {teacherName}</h4>
            </div>
            <div>
                <Typography>Number of members: {noOfMember.toString()}</Typography>
            </div>
            </center>
        </div>
    );
}