import React, { useEffect, useState } from 'react';
import Textarea from '@mui/joy/Textarea';
import { IconButton } from '@mui/joy';
import { Send } from '@mui/icons-material';
import Box from '@mui/joy/Box';
import { Avatar, Typography } from '@mui/joy';
import supabase from '../../supabaseClient';

// Custom component for received messages
const ReceivedMessage = ({ name, message, profileImg, timestamp}) => (
    <Box
        display="flex"
        justifyContent="flex-start" // Align to the left
        mb={2} // Add margin bottom
        sx={{ position: 'relative' }} // To position the name relative to the message box
    >
        <Avatar src={profileImg}/>
        <Box
            maxWidth="70%" // Limit message width to 70% of container
            borderRadius={10} // Rounded corners
            bgcolor="lightblue" // Light blue background
            p={1} // Padding
            ml={1}
            sx={{ paddingRight: '24px', justifyContent: 'space-between' }} // Add margin to separate avatar and message box
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}> {/* Container for avatar and name */}
                 {/* Render avatar only if the message is not sent by the current user */}
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{name}</Typography>
                <Typography variant="body2" sx={{  fontWeight: 'light', fontSize: "10px", marginLeft: 4 }}>{timestamp}</Typography> {/* Add margin to separate avatar and name */}
            </Box>
            <hr style={{ margin: '4px 0', border: 'none', borderBottom: '1px solid grey' }} /> {/* Horizontal line */}
            <Typography variant="body1">{message}</Typography>
        </Box>
    </Box>
);


const SentMessage = ({ name, message, profileImg, isCurrentUser, timestamp }) => (
    <Box
        display="flex"
        justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'} 
        sx={{ position: 'relative' }} 
    >
        {!isCurrentUser && <Avatar/>} 
        <Box
            display="flex" 
            flexDirection="column" 
            maxWidth="70%" 
            borderRadius={10} 
            bgcolor={isCurrentUser ? "lightgreen" : "lightblue"} 
            p={1} // Padding
            ml={isCurrentUser ? 1 : 0} 
            mr={!isCurrentUser ? 1 : 0} 
            position="relative" 
            sx={{ paddingRight: '24px', justifyContent: 'space-between' }} 
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}> 
                {!isCurrentUser && <Avatar src={profileImg} />} 
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: "auto" }}>{name}</Typography>
                <Typography variant="body2" sx={{  fontWeight: 'light', fontSize: "10px", marginLeft: 5 }}>{timestamp}</Typography> 
            </Box>
            <hr style={{ margin: '4px 0', border: 'none', borderBottom: '1px solid grey' }} /> 
            <Typography variant="body1">{message}</Typography>
            
        </Box>
        {isCurrentUser && <Avatar src={profileImg}/>} 
    </Box>
);


export function GroupForum({ classId }) {
    const [sendMessage, setSend] = useState('');
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState('');
    const [userDetails, setUserDetails] = useState({});

    async function sendMessageNow() {
        const getId = await supabase.auth.getUser();
        const sent_by = getId.data.user.id;

        const { error } = await supabase
            .from("messages_duplicate")
            .insert([
                { class_id: classId, message: sendMessage, sent_by: sent_by, created_at: new Date().toISOString() }
            ]);
        if (error) {
            console.log(error);
        }
        setSend('')
    }

    async function retrieveMessages() {
        const getId = await supabase.auth.getUser();
        const user_id = getId.data.user.id;
        setUserId(user_id);

        const { data, error } = await supabase
            .from("messages_duplicate")
            .select("message, sent_by, created_at")
            .eq("class_id", classId);

            if (data && data.length > 0) {
                
                const sortedMessages = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                setMessages(sortedMessages);
    
                
                const senderIds = new Set(data.map(msg => msg.sent_by));
                await fetchUserDetails([...senderIds]);
            }
    }

    async function fetchUserDetails(userIds) {
        const userDetailsPromises = userIds.map(async userId => {
            const { data, error } = await supabase
                .from("users")
                .select("user_name, user_profile_img")
                .eq("user_id", userId)
                .single();

            if (data) {
                return { userId, userDetails: data };
            }
            if (error) {
                console.log(error);
                return null;
            }
        });

        const userDetailsMap = {};
        await Promise.all(userDetailsPromises.map(async promise => {
            const result = await promise;
            if (result) {
                userDetailsMap[result.userId] = result.userDetails;
            }
        }));

        setUserDetails(userDetailsMap);
    }

    useEffect(() => {
        retrieveMessages();
        const channels = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'messages_duplicate' },
                (payload) => {
                    
                    console.log(payload)
                    retrieveMessages();
                }
            )
            .subscribe();

        return () => {
            
            channels.unsubscribe();
        };
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "darkgrey" }}>
            <Box
                height="71vh" // Set height to 80% of the viewport height
                width="80vw" // Set width to 80% of the viewport width
                my={4}
                mx="auto"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={4}
                p={2}
                sx={{ border: '2px solid grey', borderRadius: '10px', overflowY: 'auto' }}
            >
                {/* Render messages */}
                {messages.map((msg, index) => {
                    const sender = msg.sent_by === userId ? "You" : userDetails[msg.sent_by]?.user_name || "Unknown User";
                    const profileImg = userDetails[msg.sent_by]?.user_profile_img;
                    const timestamp = new Date(msg.created_at).toLocaleString('en-US', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    });
                    return msg.sent_by === userId ? (
                        <SentMessage key={index} name={sender} message={msg.message} profileImg={profileImg} isCurrentUser={true} timestamp={timestamp} />
                    ) : (
                        <ReceivedMessage key={index} name={sender} message={msg.message} profileImg={profileImg} timestamp={timestamp}/>
                    );
                })}
            </Box>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '80%', position: 'relative', display: 'flex' }}>
                    <Textarea
                        placeholder="Type your message here..."
                        value={sendMessage}
                        onChange={(e) => setSend(e.target.value)}
                        sx={{
                            width: 'calc(100% - 48px)', // Set the width of the Textarea to 100% of its container
                            borderColor: 'red', // Default border color
                            borderRadius: '10px', // Default border radius
                        }}
                    />
                    <div style={{ backgroundColor: "goldenrod", position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                        <IconButton onClick={sendMessageNow}>
                            <Send />
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
