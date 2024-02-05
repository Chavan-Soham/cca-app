import { Navbar } from "./navbar";
import "./create_or_join.css"
import OpenIconSpeedDial from "./plusButton";
import React from "react";
import { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import "./create_or_join.css"
import { Button } from "@mui/material";
import { DeleteForever, UTurnRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import $ from "jquery"
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import IconButton from '@mui/joy/IconButton';
import { Link } from "@mui/joy";
import Edit from "@mui/icons-material/Edit";




export function CreateOrJoin() {
    const [user, setUser] = useState();
    const navigate = useNavigate()
    const [userName, setUserName] = useState()
    const [classes, setClasses] = useState([]);
    const [clickedClass, setClickedClass] = useState();

    async function fetchClasses() {
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;

        const { data, error } = await supabase
            .from("class_duplicate")
            .select("class_name, class_description, class_image")
            .eq("created_by", user_id)

        if (data) {
            console.log(data)
            setClasses(data);
        }
        if (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUser();
        fetchUserName();
        fetchClasses();
    }, [])

    async function deleteClass(class_name, index) {
        const getId = await supabase.auth.getUser()
        const created_by = getId.data.user.id;

        const { error } = await supabase
            .from("class_duplicate")
            .delete()
            .eq("class_name", class_name)
            .eq("created_by", created_by)

        if (error) {
            console.log(error)
        }

        $(`#card-${index}`).hide();
        console.log(`${class_name} deleted successfully`);

    }

    function navigateToDashboard() {
        console.log(clickedClass)
        if (clickedClass) {
            navigate("/dashboard", { state: { clickedClass } });
        }
    }


    function displayClass() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                {classes.map((classItem, index) => (
                    <Card key={index} id={`card-${index}`} sx={{ width: 320, backgroundColor: "wheat", margin: 2 }}>
                        <CardOverflow>
                            <AspectRatio ratio="2">
                                <img
                                    src={classItem.class_image}
                                    loading="lazy"
                                    alt={classItem.class_name}
                                />
                            </AspectRatio>
                            <IconButton
                                aria-label="Delete class"
                                size="md"
                                variant="solid"
                                color="danger"
                                sx={{
                                    position: 'absolute',
                                    zIndex: 2,
                                    borderRadius: '50%',
                                    right: '4rem',
                                    bottom: '0rem',
                                    transform: 'translateY(50%)',
                                }}
                                onClick={() => deleteClass(classItem.class_name, index)}
                            >
                                <DeleteForever />
                            </IconButton>
                            <IconButton
                                aria-label="Edit class"
                                size="md"
                                variant="solid"
                                color="warning"
                                sx={{
                                    position: 'absolute',
                                    zIndex: 2,
                                    borderRadius: '50%',
                                    right: '1rem',
                                    bottom: '0rem',
                                    transform: 'translateY(50%)',
                                }}
                            >
                                <Edit />
                            </IconButton>
                        </CardOverflow>
                        <CardContent>
                            <Typography level="title-md">
                                <Link overlay underline="none" href="/dashboard" onClick={async () => { setClickedClass(classItem.class_name); }} {...navigateToDashboard()}>
                                    {classItem.class_name}
                                </Link>
                            </Typography>
                            <Typography level="body-sm">
                                {classItem.class_description}
                            </Typography>
                        </CardContent>
                        <CardOverflow variant="soft">
                            <Divider inset="context" />
                            <CardContent orientation="horizontal">
                                <Typography level="body-xs">6.3K views</Typography>
                                <Divider orientation="vertical" />
                                <Typography level="body-xs">1 hour ago</Typography>
                            </CardContent>
                        </CardOverflow>
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
            <br />
            <h1>{userName} your created classes</h1>
            {displayClass()}
            <br />
            <OpenIconSpeedDial />
        </div>
    );
}