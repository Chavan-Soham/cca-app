import React, { useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import { AddBoxRounded, CloseRounded, PeopleSharp } from '@mui/icons-material';
import "./create_or_join.css"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input, TextField } from '@mui/material';
import supabase from "../../supabaseClient"




export default function OpenIconSpeedDial() {
  const [open, setOpen] = useState(false)
  const [teacherName, setTeacherName] = useState('')
  const [className, setClassName] = useState('')
  const [password, setPassword] = useState('')
  const [description, setDescription] = useState('')

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false)
    setTeacherName('')
    setClassName('')
    setDescription('')
    setPassword('')
  }


  const handleSubmit = async() => {
    const getId = await supabase.auth.getUser()
    const user_id = getId.data.user.id;
    try {
      const {error} = await supabase
        .from('class')
        .insert([
          {teacher_name: teacherName, created_at: new Date().toISOString(), class_name: className, password: password, created_by: user_id} 
        ])
        if (error) {
          console.log(error)
        }
    } catch (error) {
      console.log(error)
    }
    
    handleClose();
  }
  

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
            onClick={handleOpen}
          />

          <SpeedDialAction
            key="Join"
            icon={<PeopleSharp/>}
            tooltipTitle="Join Class"
          />
      </SpeedDial>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Class</DialogTitle>
        <DialogContent sx={{marginTop: "5px"}}>
          <Input
            label="Teacher Name"
            value={teacherName}
            onChange={(event)=>setTeacherName(event.target.value)}
          />
          <TextField
            label="Class Name"
            value={className}
            onChange={(event)=>setClassName(event.target.value)}
          />
          <TextField
            label="Course Description"
            value={description}
            onChange={(event)=>setDescription(event.target.value)}
          />
          <TextField
            type='password'
            label="Password"
            value={password}
            onChange={(event)=>setPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} color="primary">
            <CloseRounded sx={{ backgroundColor: "ButtonHighlight", width: "30px", height: "30px"}}/>
          </IconButton>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>    
      </Box>
  );
}
