import { Navbar } from "./navbar";
import "./create_or_join.css"
import OpenIconSpeedDial from "./plusButton";
import React from "react";
import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import "./create_or_join.css"
import { Button } from "@mui/material";
import { UTurnRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';


export function CreateOrJoin() {
    const [user, setUser] = useState();
    const navigate = useNavigate()
    const [userName, setUserName] = useState()
    const [className, setClassName] = useState()
    const [classDescription, setClassDescription] = useState()
    const [classImage, setClassImage] = useState()

    async function fetchClass() {
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;

        const { data, error } = await supabase
            .from("class_duplicate")
            .select("class_name, class_description, class_image")
            .eq("created_by", user_id)

        if (data) {
            setClassName(data[0].class_name)
            setClassDescription(data[0].class_description)
            setClassImage(data[0].class_image)
        }
        if (error) {
            console.log(error)
        }
    }

    function displayClass() {
        fetchClass()
        const classes = [
            {
                class_name: className,
                class_description: classDescription,
                class_image: classImage
            }
        ]

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                {classes.map((classItem, index) => (
                    <Card key={index} sx={{ maxWidth: 345, margin: 2 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="140"
                                // Use the actual URL from your class data
                                image={classItem.class_image}
                                alt={classItem.class_name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {classItem.class_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {classItem.class_description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small" color="primary">
                                Share
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
        );
    }

    async function fetchUserName() {
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;

        const { data, error } = await supabase
            .from("users")
            .select("user_name")
            .eq("user_id", user_id)
        if (data) {
            console.log(data[0].user_name)
            setUserName(data[0].user_name)
        }
        if (error) {
            console.log(error)
        }
    }

    async function fetchUser() {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (data) {
                setUser(data.user);
            }

            if (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser();
        fetchUserName();
    }, [])

    function printName() {
        return <h1 style={{ textAlign: "center", fontFamily: "Bookman Old Style", fontWeight: "normal", opacity: "80%" }}>Welcome {userName}</h1>
    }


    if (!user) {
        return (
            <div className="main-not-logged-in">
                <div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                </div>
                <div className="not-logged-in">
                    <h1 className="h1-not-logged-info">You should login first to proceed</h1>
                    <Button variant="contained" style={{ backgroundColor: "MenuText", color: "AppWorkspace", position: "relative" }} startIcon={<UTurnRight />} onClick={() => navigate("/")}>Go to login page</Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <br />
            {printName()}
            <br/>
            {displayClass()}
            <br />
            <OpenIconSpeedDial />
        </div>
    );
}