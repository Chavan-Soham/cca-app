import React, { useState } from "react";
import supabase from "../../supabaseClient";
import { Typography, Button, Box, Paper } from "@mui/material"
import { Link } from "react-router-dom";



export default function About({ classId }) {
    const [className, setClassName] = useState('')
    const [classBio, setClassBio] = useState('')
    const [classImage, setClassImage] = useState('')
    const [noOfMember, setNoOfMember] = useState([])
    const [teacherName, setTeacherName] = useState('')
    const [password, setPassword] = useState()


    async function checkIfTeacher() {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
    
        const { data, error } = await supabase
          .from("class_duplicate")
          .select("created_by")
          .eq("class_id", classId);
    
        if (data && userId === data[0].created_by) {
          const teacher = await supabase.from("users").select("user_name").eq("user_id", data[0].created_by)
          setTeacherName(teacher.data[0].user_name)
        } 
    
        if (error || userError) {
          console.error("Error checking if user is teacher:", error || userError);
        }
      }
    async function classDetails() {
        await checkIfTeacher()
        const { data: number, error: e } = await supabase
            .from("class_members_duplicate")
            .select("member_name")
            .eq("classId", classId)

        if (number) {
            setNoOfMember(number.length)

        }
        if (e) {
            console.log(e)
        }


        const { data, error } = await supabase
            .from("class_duplicate")
            .select("class_name, class_description, class_image, password")
            .eq("class_id", classId)
        if (data) {
            setClassName(data[0].class_name)
            setClassBio(data[0].class_description)
            setClassImage(data[0].class_image)
            setPassword(data[0].password)
        }
        if (error) {
            console.log(error)
        }
    }

    useState(() => {
        classDetails()
    }, [teacherName])

    const copyPasswordToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(password);
            alert("Password copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy password: ", error);
            alert("Failed to copy password. Please try again.");
        }
    };

    return (
        <div>
            <Box mt={3} mx="auto" width="80%">
                <Paper elevation={3} sx={{ padding: "20px" }}>
                    <Typography variant="h4" align="center" mb={2}>
                        {className}
                    </Typography>

                    <Link to={`${classImage}`}>
                        
                            <div
                                style={{
                                    backgroundImage: `url('${classImage}')`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "contain",
                                    width: "100%",
                                    height: "250px",
                                    marginBottom: "20px",
                                }}
                            ></div>
                       
                    </Link>

                    <Typography variant="body1" align="center" mb={2}>
                        {classBio}
                    </Typography>
                    <Typography variant="subtitle1" align="center" mb={2}>
                        Teacher: {teacherName}
                    </Typography>
                    <Typography variant="subtitle1" align="center" mb={2}>
                        Number of members: {noOfMember.toString()}
                    </Typography>
                    {password && (
                        <Box display="flex" justifyContent="center">
                            <Button variant="contained" onClick={copyPasswordToClipboard}>
                                Copy Password
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </div>
    );
}