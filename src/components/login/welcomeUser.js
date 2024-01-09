import { useState } from "react";
import supabase from "../../supabaseClient";
import Textarea from '@mui/joy/Textarea';
import { Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";

export function WelcomeUser(){
    const [getUserName, setUserName] = useState();
    const navigate = useNavigate()

    async function setUser(){
        const getId = await supabase.auth.getUser();
        const user_id = getId.data.user.id;

        const {error} = await supabase
            .from('users')
            .insert([
                {user_name: getUserName, user_id: user_id}
            ])

        if (error) {
            console.log(error)
        }
    }

    async function getNameOfUser(){
        setUser()
        navigate("/create_or_join")
    }

    return (
        <div>
            <div>
                <h1 style={{
                    position: 'absolute',
                    left: '50%',
                    top: '36%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '30px',
                    textAlign: 'center', // Center text
                }}>Welcome. Let's get started with your name</h1>
            </div>
            <div>
                <Textarea
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '53%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%', // Adjusted width for responsiveness
                        maxWidth: '400px', // Limit maximum width
                        height: '50px',
                        fontSize: '24px',
                        textAlign: 'center', // Center text
                    }}
                    value={getUserName}
                    onChange={(event)=> setUserName(event.target.value)}
                    name="Warning"
                    placeholder="Type in here…"
                    variant="soft"
                    color="warning"
                />
            </div>
            <div>
                <Button sx={{
                    position: 'absolute',
                    top: '59%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'brown',
                    color: 'aquamarine',
                    fontSize: '20px',
                    textAlign: 'center',
                    width: '80%', // Adjusted width for responsiveness
                    maxWidth: '300px', // Limit maximum width
                }} onClick={getNameOfUser}>Submit</Button>
            </div>
        </div>
    );
}