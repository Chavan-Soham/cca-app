import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { Card, CardContent, CardActions, Button, Typography, TextField, Avatar } from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material";

export function Assignments({ classId }) {
    const [userTeacher, setTeacher] = useState(false);
    const [assignmentName, setAssignmentName] = useState("");
    const [topic, setTopic] = useState("");
    const [docFile, setDocFile] = useState();
    const [studId, setStudId] = useState([]);
    const [studName, setStudName] = useState([]);
    const [studPic, setStudPic] = useState([]);

    async function userIsTeacher() {
        const getId = await supabase.auth.getUser();
        const user_id = getId.data.user.id;

        const getData = await supabase
            .from("class_duplicate")
            .select("created_by")
            .eq("class_id", classId);

        if (user_id === getData.data[0].created_by) {
            setTeacher(true);
        } else {
            setTeacher(false);
        }
    }

    // Function to handle assignment submission by students
    const handleAssignmentSubmit = async () => {
        const { error } = await supabase
            .from("assignments_duplicate")
            .insert([
                { topic: assignmentName, class_id: classId }
            ])
            .select();
        if (error) {
            console.log(error);
        }
    };

    async function fetchCreatedAssignments() {
        const { data, error } = await supabase
            .from("assignments_duplicate")
            .select("topic")
            .eq("class_id", classId);
        if (data) {
            setTopic(data[0].topic);
        }
        if (error) {
            console.log(error);
        }
    }

    // Function to handle assignment name input change
    const handleAssignmentNameChange = (e) => {
        setAssignmentName(e.target.value);
    };

    async function getAssignId() {
        const data = await supabase.from("assignments_duplicate").select("assignId").eq("class_id", classId);
        return data.data[0].assignId;
    }

    async function uploadFile() {
        if (docFile) {
            const doc = await supabase.storage
                .from("students-assignments")
                .upload(`files/${docFile.name}`, docFile, { public: true });

            const getUrl = supabase.storage.from("students-assignments").getPublicUrl(doc.data.path);

            const assignId = await getAssignId();

            const getId = await supabase.auth.getUser();
            const user_id = getId.data.user.id;

            const { e } = await supabase.from("assignment_submit_duplicate")
                .insert([
                    { assignId: assignId, submited_by: user_id, file_link: getUrl.data.publicUrl, file_path: doc.data.path }
                ]);
            if (e) {
                console.log(e);
            }

        }
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setDocFile(file);
    };

    async function getStudentId() {
        const assignId = await getAssignId();

        const { data, error } = await supabase
            .from("assignment_submit_duplicate")
            .select("submited_by")
            .eq("assignId", assignId);
        if (data) {
            const submittedByArray = data.map(submission => submission.submited_by);
            setStudId(submittedByArray);
        }
        if (error) {
            console.log("No one has submitted");
        }
    }

    async function getStudentDetails() {
        const studentDetailsPromises = studId.map(async studId => {
            const { data, error } = await supabase
                .from("users")
                .select("user_name, user_profile_img")
                .eq("user_id", studId);

            if (data) {
                return {
                    userName: data[0].user_name,
                    userProfImg: data[0].user_profile_img
                };
            }
            if (error) {
                console.log(error);
                console.log("Not submitted");
                return null;
            }
        });

        const studentDetails = await Promise.all(studentDetailsPromises);

        // Assuming you have state variables to store these details
        setStudName(studentDetails.map(detail => detail.userName));
        setStudPic(studentDetails.map(detail => detail.userProfImg));
    }

    useEffect(() => {
        userIsTeacher();
        fetchCreatedAssignments();
        getStudentId();
        getStudentDetails();
    }, [studId]);

    return (
        <div>
            {userTeacher && (
                <div>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Create Assignment
                            </Typography>
                            <TextField
                                label="Assignment Name"
                                variant="outlined"
                                fullWidth
                                value={assignmentName}
                                onChange={handleAssignmentNameChange}
                                sx={{ mt: 2 }}
                            />
                            <Button
                                onClick={handleAssignmentSubmit}
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                            >
                                Publish Assignment
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
            <div>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {topic}
                        </Typography>
                        {!userTeacher && (
                            <CardActions>
                                <input type="file" accept=".pdf, .doc, .docx, .xlsx, .xls, .csv, .txt, .exe, .apk, .jar, .rar, .pptx, .zip" onChange={handleFileSelect} />
                                <Button onClick={uploadFile} component="label" variant="contained" color="primary">
                                    Upload File
                                </Button>
                            </CardActions>
                        )}
                    </CardContent>
                    <CardActions>
                            {userTeacher && (
                                    <div>
                                    {studPic.map((pic, index) => (
                                        <div style={{ display: "flex" }} key={index}>
                                            <Avatar key={index} src={pic} alt={`Student Avatar ${index}`} />
                                            <Typography marginTop="10px" marginLeft="10px">{studName[index]}</Typography>
                                            <Button variant="contained" color="error" style={{marginLeft: "25px"}}><PictureAsPdf/>Download</Button>
                                        </div>
                                    ))}
                                    </div>
                            )}
                    </CardActions>
                </Card>
            </div>
        </div>
    );
}
