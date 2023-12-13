import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import supabase from "../../supabaseClient"

export default function ClassCards() {
  const [classNames,setClassNames]=useState();
  
  async function fetchClassNames(){
    const getId = await supabase.auth.getUser()
    const teacher_id=getId.data.user.id;

    try {
      const {data,error}= await supabase
       .from('Course')
       .select('course_name, teacher_id')
       .eq('teacher_id', teacher_id)

      if (data) {
        setClassNames(data);
      }
      if (error ) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    {/*<Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="https://images8.alphacoders.com/133/1337140.png"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Edit
        </Button>
        <Button size="small" color="primary">
          Delete
        </Button>
      </CardActions>
  </Card>*/}
  );
}
