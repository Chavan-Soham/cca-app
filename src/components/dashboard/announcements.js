import { useEffect, useRef, useState } from "react";
import supabase from "../../supabaseClient";

import Textarea from '@mui/joy/Textarea';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import { Avatar, Card, Typography } from "@mui/joy";



export function Announcements({ classId }) {
    const [userIsCreator, setUserIsCreator] = useState(false);
    const [teacherId, setTeacherId] = useState()
    const [announcements, setAnnouncements] = useState([])
    const [showAnnouncement, setFetchAnnouncement] = useState([])
    const [pic, setPic] = useState()
    const [name,setName] = useState()
    const announcementsRef = useRef(null);

   

    async function checkUserIsCreator() {
        try {
            const { data } = await supabase
                .from("class_duplicate")
                .select("created_by")
                .eq("class_id", classId);

            const getId = await supabase.auth.getUser();
            const userId = getId.data.user.id;

            if (data && data.length > 0) {
                const creatorId = data[0].created_by;
                setUserIsCreator(userId === creatorId);
                setTeacherId(creatorId)
            }
        } catch (error) {
            console.error("Error checking user creator status:", error);
        }
    }

    

    async function handleAnnouncementSend() {
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id
        try {
            const { error } = await supabase
                .from("announcements_duplicate")
                .insert([
                    { created_by: user_id, class_id: classId, content: announcements, created_at: new Date().toISOString() }
                ])
            if (error) {
                console.log(error)
            }
            else{
                setAnnouncements('')
            }
        } catch (error) {
            console.log(error)
        }
    }


    async function fetchAnnouncements() {
        try {
            const { data, error } = await supabase
                .from("announcements_duplicate")
                .select("content")
                .eq("class_id", classId)
            if (data) {
                setFetchAnnouncement(data)
            }
            if (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function getTeacherDetails(){
        
        const {data, error} = await supabase    
            .from("users")
            .select("user_name, user_profile_img")
            .eq("user_id", teacherId)
        if (data) {
            setName(data[0].user_name)
            setPic(data[0].user_profile_img)
        }
        else{
            console.log(error)
        }
    }


    async function subscribeToChanges() {
        try {

            const channels = supabase.channel('custom-all-channel')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'announcements_duplicate' },
                    (payload) => {
                        console.log('Change received!', payload)
                        fetchAnnouncements()
                    }
                )
                .subscribe()
            console.log(channels)
        } catch (error) {
            console.error("Error subscribing to changes:", error.message);
        }
    }

    useEffect(() => {
        checkUserIsCreator();
        fetchAnnouncements();
        subscribeToChanges();
        getTeacherDetails();
    }, [teacherId]);

    return (
        <div>
            {userIsCreator && (
                <div>
                    <Textarea
                        minRows={2}
                        placeholder="Announce here..."
                        variant="soft"
                        value={announcements}
                        onChange={(event) => setAnnouncements(event.target.value)}
                        sx={{
                            borderBottom: '2px solid',
                            borderColor: 'neutral.outlinedBorder',
                            borderRadius: 0,
                            width: '100%',
                            maxWidth: '750px',
                            margin: '30px auto',
                            '&:hover': {
                                borderColor: 'neutral.outlinedHoverBorder',
                            },
                            '&::before': {
                                border: '1px solid var(--Textarea-focusedHighlight)',
                                transform: 'scaleX(0)',
                                left: 0,
                                right: 0,
                                bottom: '-2px',
                                top: 'unset',
                                transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                borderRadius: 0,
                            },
                            '&:focus-within::before': {
                                transform: 'scaleX(1)',
                            },
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 'var(--Textarea-paddingBlock)',
                            pt: 'var(--Textarea-paddingBlock)',
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            flex: 'auto',
                        }}
                    >
                        <Button variant="solid" color="primary" onClick={handleAnnouncementSend} sx={{ ml: 'auto' }}>Send</Button>
                    </Box>
                    <div ref={announcementsRef} style={{ paddingTop: '30px', maxHeight: '80vh', overflowY: 'auto' }}>
                        {showAnnouncement.slice(0).reverse().map((announcement, index) => (
                            <Card key={index} style={{ marginBottom: '10px' }}>
                                <Avatar src={pic} /><Typography level="title-lg">{name}</Typography>
                                <Typography level="title-md">{announcement.content}</Typography>
                            </Card>
                        ))}
                    </div>

                </div>
            )}

            {!userIsCreator && (
                <div ref={announcementsRef} style={{ paddingTop: '30px', maxHeight: '80vh', overflowY: 'auto' }}>
                {showAnnouncement.slice(0).reverse().map((announcement, index) => (
                    <Card key={index} style={{ marginBottom: '10px' }}>
                        <Avatar src={pic} /><Typography level="title-lg">{name}</Typography>
                        <Typography level="title-md">{announcement.content}</Typography>
                    </Card>
                ))}
            </div>
            )}
        </div>
    );
}