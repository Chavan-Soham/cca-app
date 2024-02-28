import React from 'react';
import Textarea from '@mui/joy/Textarea';
import { IconButton } from '@mui/joy';
import { Send } from '@mui/icons-material';
import Box from '@mui/joy/Box';
import { Avatar, Typography } from '@mui/joy';

export function GroupForum({ classId }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "darkgrey"}}>
            <Box
                height="70vh" // Set height to 80% of the viewport height
                width="80vw" // Set width to 80% of the viewport width
                my={4}
                mx="auto"
                //display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={4}
                p={2}
                sx={{ border: '2px solid grey', borderRadius: '10px', overflowY: 'auto'}}
            >
                
            </Box>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '80%', position: 'relative', display: 'flex' }}>
                    <Textarea
                        placeholder="Looks like I'm focused but no"
                        sx={{
                            width: 'calc(100% - 48px)', // Set the width of the Textarea to 100% of its container
                            borderColor: 'red', // Default border color
                            borderRadius: '10px', // Default border radius
                        }}
                    />
                    <div style={{ backgroundColor: "goldenrod", position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)'}}>
                        <IconButton >
                            <Send />
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
