import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import { AddBoxRounded, PeopleSharp } from '@mui/icons-material';
import "./create_or_join.css"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import supabase from "../../supabaseClient"




export default function OpenIconSpeedDial() {
  const [open, setOpen] = useState(false)
  const [className, setClassName] = useState('')
  const [password, setPassword] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null);
  const [joinOpen, setJoinOpen] = useState(false)
  const [joinPassword, setJoinPassword] = useState('')
  const [memberName, setMemberName] = useState()


  const handleJoinOpen = () => {
    setJoinOpen(true)
  }

  const handleJoinClose = () => {
    setJoinOpen(false)
    setJoinPassword('')
  }

  async function member() {
    const getId = await supabase.auth.getUser()
    const user_id = getId.data.user.id

    const { data, error } = await supabase
      .from("users")
      .select("user_name")
      .eq("user_id", user_id)
    if (data) {
      setMemberName(data[0].user_name)
    }
    if (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    member()
  }, [])

  const handleJoinSubmit = async () => {
    const { data, error } = await supabase
      .from("class_duplicate")
      .select("class_id")
      .eq("password", joinPassword)
      .match({ password: joinPassword })

    if (data) {
      const class_id = data[0].class_id
      const getId = await supabase.auth.getUser()
      const member_id = getId.data.user.id;


      const { data: checkMember, error: e } = await supabase
        .from("class_members_duplicate")
        .select("classId, memberId, member_name")
        .match({ classId: class_id, memberId: member_id, member_name: memberName })
      
      if (checkMember.length > 0) {
        console.log(checkMember)
        alert(`You have already joined this classroom`)
      }
      else{
        const { error: fault } = await supabase
          .from("class_members_duplicate")
          .insert([
            { memberId: member_id, classId: class_id, member_name: memberName },
          ])
          .select()

        if (fault) {
          console.log(fault)
        }
      }
      if (e) {
        console.log(e)
      }


    }
    if (error) {
      console.log(error)
    }
    handleJoinClose()
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false)
    setClassName('')
    setDescription('')
    setPassword('')
  }

  const handleSubmit = async () => {
    console.log(className)

    const getId = await supabase.auth.getUser()
    const user_id = getId.data.user.id;
    const { data } = await supabase
      .from("class_duplicate")
      .select("class_name")
      .eq("created_by", user_id)
      .match({ class_name: className })

    if (data && data.length > 0) {
      console.log(data)
      alert(`${className} already exists`)
    }
    else {
      const { data, error: e } = await supabase.storage
        .from('class-images')
        .upload(`images/${file.name}`, file, { public: true });

      if (data) {
        console.log(data)
      }
      const imageUrl = data.path;

      if (e) {
        console.error('Error uploading image:', e.message);
      }

      const { data: getImage, error: errorMsg } = await supabase.storage.from("class-images").getPublicUrl(imageUrl)
      console.log(getImage.publicUrl)
      const publicUrl = getImage.publicUrl
      if (errorMsg) {
        console.log(errorMsg)
      }

      const { error } = await supabase
        .from('class_duplicate')
        .insert([
          { created_at: new Date().toISOString(), class_name: className, password: password, class_description: description, created_by: user_id, class_image: publicUrl }
        ])
      if (error) {
        console.log(error)
      }
    }


    handleClose();
  }


  return (
    <Box sx={{ position: 'fixed', bottom: 0, right: 0 }}>


      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon openIcon={<EditIcon />} />}
      >

        <SpeedDialAction
          key="add"
          icon={<AddBoxRounded />}
          tooltipTitle="Create Class"
          onClick={handleOpen}
        />

        <SpeedDialAction
          key="Join"
          icon={<PeopleSharp />}
          tooltipTitle="Join Class"
          onClick={handleJoinOpen}
        />
      </SpeedDial>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Class</DialogTitle>
        <DialogContent sx={{ margin: "10px" }}>
          <TextField
            label="Class Name"
            sx={{ marginTop: "8px" }}
            value={className}
            onChange={(event) => setClassName(event.target.value)}
          /><br></br>
          <TextField
            label="Course Description"
            sx={{ marginTop: "8px" }}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          /><br></br>
          <TextField
            sx={{ marginTop: "8px", height: "auto" }}
            type='file'
            onChange={handleFileChange}
          /><br></br>
          <TextField
            type='password'
            label="Password"
            sx={{ marginTop: "8px" }}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          /><br></br>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='warning' variant="contained">Close</Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={joinOpen} onClose={handleJoinClose}>
        <DialogTitle>Join Class</DialogTitle>
        <DialogContent sx={{ margin: "10px" }}>
          <TextField
            label="Password"
            sx={{ marginTop: "8px" }}
            type="password"
            value={joinPassword}
            onChange={(event) => setJoinPassword(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleJoinClose} color='warning' variant="contained">Cancel</Button>
          <Button variant="contained" onClick={handleJoinSubmit} color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
