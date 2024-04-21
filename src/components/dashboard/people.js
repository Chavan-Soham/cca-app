import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Typography from '@mui/joy/Typography';
import supabase from '../../supabaseClient';
import Divider from '@mui/joy/Divider';
import Chip from '@mui/joy/Chip';
import Button from "@mui/joy/Button"
import $ from "jquery"






export function People({ classId }) {
    //creator
    const [creatorName, setCreatorName] = React.useState()
    const [members, setMembers] = React.useState([])
    const [teacherPic, setTeacherPic] = React.useState()
    const [prof, setProf ] = React.useState([])
    //all joined students.

    async function creator() {
        const { data, error } = await supabase
            .from("class_duplicate")
            .select("created_by")
            .eq("class_id", classId)
        if (data) {
            const { data: nameFound, error: e } = await supabase
                .from("users")
                .select("user_name, user_profile_img")
                .eq("user_id", data[0].created_by)
            if (nameFound) {
                setCreatorName(nameFound[0].user_name)
                setTeacherPic(nameFound[0].user_profile_img)
            }
            if (e) {
                console.log(e)
            }
        }
        if (error) {
            console.log(error)
        }

        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;
        if (user_id !== data[0].created_by) {
            $(`.remove-button`).hide()
        }
    }

    async function getMembers() {
        try {
            const { data, error } = await supabase
                .from("class_members_duplicate")
                .select("member_name")
                .eq("classId", classId)
            if (data) {
                setMembers(data)
            }
            if (error) {
                console.log(error)
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    React.useEffect(() => {
        creator()
        getMembers()
        membersDp()
    }, [members])

    async function removeMember(memberName, index){
        const {error} = await supabase
            .from("class_members_duplicate")
            .delete()
            .eq("member_name", memberName)
            .eq("classId", classId)
        if (error) {
            console.log(error)
        }
        $(`#list-item-${index}`).hide()
    }

    async function membersDp() {
        const memberData = [];
    
        // Loop through members array
        for (const memberName of members) {
            const membername = memberName.member_name;
            // Fetch user data for each member
            const { data, error } = await supabase
                .from("users")
                .select("user_name, user_profile_img")
                .eq("user_name", membername);
    
            if (data && data.length > 0) {
                // Add member data to memberData array
                memberData.push({
                    name: data[0].user_name,
                    profileImg: data[0].user_profile_img
                });
            } else {
                console.log(`No data found for member: ${memberName}`);
            }
    
            if (error) {
                console.error(`Error fetching data for member: ${memberName}`, error);
            }
        }
    
        // Use memberData for further processing or set state
        
        setProf(memberData)
        // setMemberData(memberData);
    }
    

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
                            <Avatar src={teacherPic} />
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography level="title-sm">{creatorName}</Typography>
                            <Typography level="body-sm" noWrap>
                                Teacher
                            </Typography>
                        </ListItemContent>
                    </ListItem>
                    <Divider orientation="horizontal" sx={{ marginTop: "28px" }} >
                        <Chip variant="soft" color="danger" size="lg">
                            Students
                        </Chip>
                    </Divider>
                    {prof.map((student, index) => (
                    <ListItem key={index} id={`list-item-${index}`} sx={{marginTop: "8px"}}>
                        <ListItemDecorator>
                            <Avatar src={student.profileImg} />
                        </ListItemDecorator>
                        <ListItemContent>
                            <Typography level="title-sm">{student.name}</Typography>
                            <Typography level="body-sm" noWrap>
                                Student
                            </Typography>
                        </ListItemContent>
                        <Button className="remove-button" id={`remove-button-${index}`} onClick={()=> removeMember(student.name, index)} color="danger" size="sm">Remove</Button>
                    </ListItem>
                ))}
                </List>
            </Box>
        </div>
    )
}