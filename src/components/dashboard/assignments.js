import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  TextField,
  Avatar,
} from "@mui/material";
import { Notifications, PictureAsPdf } from "@mui/icons-material";

export function Assignments({ classId }) {
  const [userTeacher, setTeacher] = useState(false);
  const [assignmentName, setAssignmentName] = useState("");
  const [assignments, setAssignments] = useState([]); // List of all assignments
  const [docFile, setDocFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions(); 
    checkIfTeacher();
  }, []);

  // Fetch assignment submissions
  async function fetchSubmissions() {
    try {
      const { data: assignments, error: assignmentsError } = await supabase
        .from("assignments_duplicate")
        .select("assignId")
        .eq("class_id", classId);

      if (assignmentsError) {
        console.error("Error fetching assignments:", assignmentsError);
        return;
      }

      const { data: submissionsData, error: submissionsError } = await supabase
        .from("assignment_submit_duplicate")
        .select("assignId, file_link, submited_by, file_path")
        .in("assignId", assignments.map((a) => a.assignId));

      if (submissionsError) {
        console.error("Error fetching submissions:", submissionsError);
        return;
      }

      // Fetch user details for each submission
      const userIds = submissionsData.map((s) => s.submited_by);

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("user_id, user_profile_img, user_name")
        .in("user_id", userIds);

      if (usersError) {
        console.error("Error fetching user data:", usersError);
        return;
      }

      // Combine submissions with user details
      const combinedSubmissions = submissionsData.map((s) => {
        const user = usersData.find((u) => u.user_id === s.submited_by);
        return { ...s,
            user_profile_img: user.user_profile_img,
            user_name: user.user_name,
        };
      });

      setSubmissions(combinedSubmissions);
    } catch (error) {
      console.error("Error during fetching submissions:", error);
    }
  }
  
  
  async function checkIfTeacher() {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    const { data, error } = await supabase
      .from("class_duplicate")
      .select("created_by")
      .eq("class_id", classId);

    if (data && userId === data[0].created_by) {
      setTeacher(true);
    } else {
      setTeacher(false);
    }

    if (error || userError) {
      console.error("Error checking if user is teacher:", error || userError);
    }
  }

  
  async function fetchAssignments() {
    try {
      const { data, error } = await supabase
        .from("assignments_duplicate")
        .select("assignId, topic")
        .eq("class_id", classId);

      if (data) {
        setAssignments(data); 
      }

      if (error) {
        console.error("Error fetching assignments:", error);
      }
    } catch (error) {
      console.error("Error during fetching assignments:", error);
    }
  }

  const handleAssignmentNameChange = (e) => {
    setAssignmentName(e.target.value);
  };

  
  async function handleAssignmentSubmit() {
    try {
      const { data, error } = await supabase
        .from("assignments_duplicate")
        .insert([{ topic: assignmentName, class_id: classId }])
        .select();

      if (data) {
        setAssignments((prevAssignments) => [...prevAssignments, data[0]]);
      }

      if (error) {
        console.error("Error creating assignment:", error);
      }
    } catch (error) {
      console.error("Error during assignment submission:", error);
    }
  }

  
  async function uploadFile(topic) {
    try {
      const assignment = assignments.find((a) => a.topic === topic); 
      if (!assignment) {
        console.error("Assignment not found");
        return;
      }

      const assignId = assignment.assignId; 

      if (docFile) {
        const uploadPath = `files/${docFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("students-assignments")
          .upload(uploadPath, docFile, { public: true });

        if (uploadData) {
          const publicUrl = supabase.storage.from("students-assignments").getPublicUrl(uploadData.path);

          const { data: userData } = await supabase.auth.getUser();
          const userId = userData.user.id

          const { error: insertError } = await supabase
            .from("assignment_submit_duplicate")
            .insert([
              {
                assignId: assignId,
                submited_by: userId,
                file_link: publicUrl.data.publicUrl,
                file_path: uploadData.path,
              },
            ]);

          if (insertError) {
            console.error("Error inserting assignment submission:", insertError);
          } else {
            console.log("File uploaded successfully");
          }
        }

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
        }
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  }

  const handleFileSelect = (e) => {
    setDocFile(e.target.files[0]);
  };

  const handleFileDownload = async(fileLink, filePath) => {
    try {
        
        const response = await fetch(fileLink);
        const fileData = await response.blob();

        
        const blob = new Blob([fileData], { type: response.headers.get("content-type") });


        
        const fileURL = URL.createObjectURL(blob);

        const fileName = filePath.split("/").pop(); 
       
        const anchor = document.createElement("a");
        anchor.href = fileURL;
        anchor.download = fileName
        anchor.click();

        
        URL.revokeObjectURL(fileURL);
    } catch (error) {
        console.error("Error downloading image:", error);
    }
}

useEffect(() => {
    
    const channels = supabase
        .channel('custom-all-channel')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'assignments_duplicate' },
            (payload) => {
                console.log('Change received!', payload);
                
                fetchAssignments();
            }
        )
        .subscribe();

    
    return () => {
        channels.unsubscribe();
    };
}, []);
  return (
    <div>
      {userTeacher && (
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
            /><br></br>
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
      )}
      
      <div>
        {assignments.length > 0 ? (
          assignments.map((assignment, index) => (
            <Card key={index} variant="elevation" sx={{ mt: 3 }}>
                <Typography variant="h5">{assignment.topic}</Typography>
                
                {userTeacher && (
                  <>
                    <Typography variant="body1">Assignments submitted:</Typography>
                    {submissions
                      .filter((s) => s.assignId === assignment.assignId) 
                      .map((submission, subIndex) => (
                        <div key={subIndex} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                          <Avatar src={submission.user_profile_img} alt={submission.user_profile_img} />
                          <Typography variant="body1" sx={{ marginLeft: "10px" }}>
                            {submission.user_name}
                          </Typography>
                          <Button variant="contained" color="error" onClick={()=>handleFileDownload(submission.file_link, submission.file_path)}><PictureAsPdf/>Download File</Button>
                        </div>
                      ))}
                  </>
                )}
  
                {!userTeacher && (
                  <CardActions>
                    <input
                      type="file"
                      accept=".pdf, .docx, etc."
                      onChange={(e) => handleFileSelect(e)}
                    />
                    <Button
                      onClick={() => uploadFile(assignment.topic)}
                      variant="contained"
                      color="primary"
                    >
                      Upload File
                    </Button>
                  </CardActions>
                )}
              
            </Card>
          ))
        ) : (
          <Card variant="elevation" sx={{ mt: 3 }}>
            <CardContent>
              <center>
                <Notifications />
                <Typography>No Assignments Published</Typography>
              </center>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
  
}
