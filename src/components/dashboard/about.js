import React, { useState } from "react";
import supabase from "../../supabaseClient";


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
            <h1>{className}</h1>
            <div style={{backgroundImage: `url('${classImage}')`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain',width: '570px', height: '440px'}}></div>
        </div>
    );
}