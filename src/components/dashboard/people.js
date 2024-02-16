import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import supabase from '../../supabaseClient';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';
import Chip from '@mui/joy/Chip';
/* import "./people.css" */





export function People({ classId }) {
    //creator
    const [creatorName, setCreatorName] = React.useState()
    //all joined students.

    async function creator() {
        const { data, error } = await supabase
            .from("class_duplicate")
            .select("created_by")
            .eq("class_id", classId)
        if (data) {
            const { data: nameFound, error: e } = await supabase
                .from("users")
                .select("user_name")
                .eq("user_id", data[0].created_by)
            if (nameFound) {
                setCreatorName(nameFound[0].user_name)
            }
            if (e) {
                console.log(e)
            }
        }
        if (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        creator()
    })

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: 320 }}>
                <Typography
                    id="ellipsis-list-demo"
                    level="body-xs"
                    textTransform="uppercase"
                    sx={{ letterSpacing: '0.15rem', textAlign: "center" }}
                    fontSize="30px"
                >
                    All Members
                </Typography>
                <List
                    aria-labelledby="ellipsis-list-demo"
                    sx={{ '--ListItemDecorator-size': '56px' }}
                >
                    <ListItem>
                        <ListItemDecorator>
                            <Avatar src="/static/images/avatar/1.jpg" />
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography level="title-sm">{creatorName}</Typography>
                            <Typography level="body-sm" noWrap>
                                Teacher
                            </Typography>
                        </ListItemContent>
                    </ListItem>
                    <Divider orientation="horizontal" sx={{ marginTop: "30px"}} >
                        <Chip variant="soft" color="danger" size="lg">
                            Students
                        </Chip>
                    </Divider>
                </List>
               
            </Box>
        </div>
    )
}