import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import { AddBoxRounded, CloseRounded, PeopleSharp } from '@mui/icons-material';
import "./create_or_join.css"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import supabase from "../../supabaseClient"




export default function OpenIconSpeedDial() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)
  const [teacherName, setTeacherName] = useState('')
  const [className, setClassName] = useState('')
  const [password, setPassword] = useState('')
  const [description, setDescription] = useState('')
  const [passwordJoin, setPasswordJoin] = useState('')
  



  const handleOpenCreate = () => {
    setCreateDialogOpen(true);
  }

  const handleCloseCreate = () => {
    setCreateDialogOpen(false)
    setTeacherName('')
    setClassName('')
    setDescription('')
    setPassword('')
  }

  const handleOpenJoin = () => {
    setJoinDialogOpen(true)
  }

  const handleCloseJoin = () => {
    setJoinDialogOpen(false)
  }

  const handleSubmitJoin = () => {
    console.log(passwordJoin)
    handleCloseJoin()
  }

  const handleSubmitCreate = async() => {
    console.log(teacherName)
    console.log(className)
    console.log(password)
    console.log(description)

    const getId = await supabase.auth.getUser()
    const user_id =  getId.data.user.id;

    const sameName = await supabase
      .from("class")
      .select("class_name")
      .eq("created_by", user_id)
      .match({class_name: className})
      

    if (sameName.data.length > 0) {
      alert(`${className} already exists`)
    }
  
    if (!sameName) {
      const {error} = await supabase
        .from("class")
        .insert([
          {class_name: className, teacher_name: teacherName, password: password, class_description: description}
        ])
      if (error) {
        console.log(error)
      }
    }
    handleCloseCreate();
  };
  

  return (
    <Box sx={{ position:'fixed', bottom: 0, right: 0 }}>


      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
      >
        
          <SpeedDialAction
            key="add"
            icon={<AddBoxRounded/>}
            tooltipTitle="Create Class"
            onClick={handleOpenCreate}
          />

          <SpeedDialAction
            key="Join"
            icon={<PeopleSharp/>}
            tooltipTitle="Join Class"
            onClick={handleOpenJoin}
          />
      </SpeedDial>

      <Dialog open={joinDialogOpen} onClose={handleCloseJoin}>
        <DialogTitle>Join Class via PassCode</DialogTitle>
        <DialogContent>
          <TextField
            label="Password"
            type="password"
            value={passwordJoin}
            sx={{marginBottom: '2px'}}
            onChange={(event) => setPasswordJoin(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleCloseJoin} color="primary">
            <CloseRounded sx={{ backgroundColor: "ButtonHighlight", width: "30px", height: "30px"}}/>
          </IconButton>
          <Button variant="contained" onClick={handleSubmitJoin} color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
      


      <Dialog open={createDialogOpen} onClose={handleCloseCreate}>
        <DialogTitle >Create Class</DialogTitle><br></br>
        <DialogContent sx={{height: "300px", width: "280px"}}>
          <TextField
            label="Teacher Name"
            value={teacherName}
            sx={{marginBottom: '10px'}}
            onChange={(event)=>setTeacherName(event.target.value)}
          /><br></br>
          <TextField
            label="Class Name"
            value={className}
            sx={{marginBottom: '10px'}}
            onChange={(event)=>setClassName(event.target.value)}
          /><br></br>
          <TextField
            label="Course Description"
            value={description}
            sx={{marginBottom: '10px'}}
            onChange={(event)=>setDescription(event.target.value)}
          /><br></br>
          <TextField
            type='password'
            label="Password"
            value={password}
            sx={{marginBottom: '10px'}}
            onChange={(event)=>setPassword(event.target.value)}
          />
          
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleCloseCreate} color="primary">
            <CloseRounded sx={{ backgroundColor: "ButtonHighlight", width: "30px", height: "30px"}}/>
          </IconButton>
          <Button variant="contained" onClick={handleSubmitCreate} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}