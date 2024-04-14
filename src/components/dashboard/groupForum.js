import React, { useEffect, useState } from 'react';
import Textarea from '@mui/joy/Textarea';
import { IconButton } from '@mui/joy';
import { Send } from '@mui/icons-material';
import Box from '@mui/joy/Box';
import { Avatar, Typography } from '@mui/joy';
import supabase from '../../supabaseClient';

// Custom component for received messages
const ReceivedMessage = ({ name, message }) => (
    <Box
        display="flex"
        justifyContent="flex-start" // Align to the left
        mb={2} // Add margin bottom
        sx={{ position: 'relative' }} // To position the name relative to the message box
    >
        <Avatar />
        <Box
            maxWidth="70%" // Limit message width to 70% of container
            borderRadius={10} // Rounded corners
            bgcolor="lightblue" // Light blue background
            p={1} // Padding
            ml={1} // Add margin to separate avatar and message box
        >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{name}</Typography>
            <hr style={{ margin: '4px 0', border: 'none', borderBottom: '1px solid grey' }} /> {/* Horizontal line */}
            <Typography variant="body1">{message}</Typography>
        </Box>
    </Box>
);

// Custom component for sent messages
const SentMessage = ({ name, message, isCurrentUser }) => (
    <Box
        display="flex"
        justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'} // Align to the right if the current user sent the message
        mb={2} // Add margin bottom
        sx={{ position: 'relative' }} // To position the name relative to the message box
    >
        {!isCurrentUser && <Avatar />} {/* Render avatar only if the message is not sent by the current user */}
        <Box
            maxWidth="70%" // Limit message width to 70% of container
            borderRadius={10} // Rounded corners
            bgcolor={isCurrentUser ? "lightgreen" : "lightblue"} // Light green background if sent by current user, light blue otherwise
            p={1} // Padding
            ml={isCurrentUser ? 1 : 0} // Add margin to separate avatar and message box if current user sent the message
            mr={!isCurrentUser ? 1 : 0} // Add margin to separate message box and avatar if current user didn't send the message
        >
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{name}</Typography>
            <hr style={{ margin: '4px 0', border: 'none', borderBottom: '1px solid grey' }} /> {/* Horizontal line */}
            <Typography variant="body1">{message}</Typography>
        </Box>
        {isCurrentUser && <Avatar />} {/* Render avatar only if the message is sent by the current user */}
    </Box>
);

export function GroupForum({ classId }) {
    const [sendMessage, setSend] = useState('');
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState('');

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
    }

    async function retrieveMessages() {
        const getId = await supabase.auth.getUser();
        const user_id = getId.data.user.id;
        setUserId(user_id);

        const { data, error } = await supabase
            .from("messages_duplicate")
            .select("message, sent_by")
            .eq("class_id", classId);

        if (data && data.length > 0) {
            // Sort messages by timestamp in ascending order
            const sortedMessages = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            setMessages(sortedMessages);
        }
    }

    useEffect(() => {
        retrieveMessages();
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
                {messages.map((msg, index) => (
                    msg.sent_by === userId ? (
                        <SentMessage key={index} name="You" message={msg.message} isCurrentUser={true} />
                    ) : (
                        <ReceivedMessage key={index} name="Other User" message={msg.message} />
                    )
                ))}
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
