import { Link, useLocation, useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient"
import { useEffect, useState } from "react";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import AnnouncementsIcon from '@mui/icons-material/Announcement';
import PostsIcon from '@mui/icons-material/Description';
import AssignmentsIcon from '@mui/icons-material/Assignment';
import AboutIcon from '@mui/icons-material/Info';
import Chat from '@mui/icons-material/Chat';
import { Paper, Grid, Icon } from "@mui/material";
import { People } from "./people";
import { Announcements } from "./announcements";
import { GroupForum } from "./groupForum";
import About from "./about";
import { Posts } from "./posts";
import { Assignments } from "./assignments";
import { AssignmentTurnedIn, Logout, Update, AssignmentLate } from "@mui/icons-material";
import "./dashboard.css"


export function ClassDashboard() {
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState();
    const [class_id, setClassId] = useState()
    const location = useLocation()
    const [profPic, setProfPic] = useState()
    const [teacherQuotes, setTeacherQuotes] = useState([])
    const [teacher, setTeacher] = useState()
    const [randomQuote, setRandomQuote] = useState({});
    const [members, setMembers] = useState([])
    const [assignName, setAssignName] = useState([])
    const [studQuotes, setStudQuotes] = useState([])
    const [notSubmitted, setNotSubmitted] = useState([])
    const [assignments, setAssignments] = useState([]);
    const [assignmentsWithNonSubmitters, setAssignmentsWithNonSubmitters] = useState([]);



    const handleDrawerClick = (drawerString) => {
        setDrawerData(drawerString)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerOptions = [
        { text: 'People', icon: <PeopleIcon />, onClick: () => handleDrawerClick('People') },
        { text: 'Announcements', icon: <AnnouncementsIcon />, onClick: () => handleDrawerClick('Announcements') },
        { text: 'Posts', icon: <PostsIcon />, onClick: () => handleDrawerClick('Posts') },
        { text: 'Assignments', icon: <AssignmentsIcon />, onClick: () => handleDrawerClick('Assignments') },
        { text: 'Group Forum', icon: <Chat />, onClick: () => handleDrawerClick('Group Forum') },
        { text: 'About', icon: <AboutIcon />, onClick: () => handleDrawerClick('About') },
    ];

    useEffect(() => {
        getClassId()
        userProfPic()
    }, [])

    async function userProfPic() {
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;

        const { data, error } = await supabase
            .from("users")
            .select("user_profile_img")
            .eq("user_id", user_id)
        if (data) {
            setProfPic(data[0].user_profile_img)
        }
        if (error) {
            console.log(error)
        }
    }
    function displayDrawerData() {
        switch (drawerData) {
            case 'People':
                return <People classId={class_id} />
            case 'Announcements':
                return <Announcements classId={class_id} />
            case 'Group Forum':
                return <GroupForum classId={class_id} />
            case 'About':
                return <About classId={class_id} />
            case 'Posts':
                return <Posts classId={class_id} />
            case 'Assignments':
                return <Assignments classId={class_id} />
            default:
                break;
        }
    }

    async function getClassId() {

        const { data, error } = await supabase
            .from('class_duplicate')
            .select('created_by')
            .eq('class_name', location.state.clickedClass)
        if (data) {
            const { data: classIdData, error: e } = await supabase
                .from("class_duplicate")
                .select("class_id")
                .eq("created_by", data[0].created_by)
                .eq("class_name", location.state.clickedClass)
            if (classIdData) {
                setClassId(classIdData[0].class_id)
            }
            if (e) {
                console.log(e)
            }
        }
        if (error) {
            console.log(error)
        }
    }

    function className() {

        const getClassName = location.state.clickedClass;
        return (
            <div>
                <div>{getClassName}</div>
            </div>
        );
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.log(error)
        }
    }

    function logout() {
        signOut()
    }

    function navbar() {
        return (
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {className()}
                        </Typography>

                        {/* Profile Button */}
                        <Tooltip title="Account settings">
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleClick}
                                sx={{ mr: 2 }}
                            >
                                <Avatar sx={{ width: '49px', height: '49px' }} src={profPic}></Avatar>
                            </IconButton>
                        </Tooltip>

                        {/* Profile Menu */}
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => { handleClose(); navigate("/profileImage") }}>
                                <Typography textAlign="center"><Update />Update Profile Pic</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => { handleClose(); logout(); navigate("/"); }}>
                                <Typography textAlign="center"><Logout />Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                {/* Drawer */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer}
                >
                    <List>
                        {drawerOptions.map((item, index) => (
                            <ListItem button key={item.text} onClick={() => { item.onClick(); toggleDrawer(); }}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>
        );
    }

    async function retClassId() {

        const { data, error } = await supabase
            .from('class_duplicate')
            .select('created_by')
            .eq('class_name', location.state.clickedClass)
        if (data) {
            const { data: classIdData, error: e } = await supabase
                .from("class_duplicate")
                .select("class_id")
                .eq("created_by", data[0].created_by)
                .eq("class_name", location.state.clickedClass)
            if (classIdData) {
                return classIdData[0].class_id
            }
            if (e) {
                console.log(e)
            }
        }
        if (error) {
            console.log(error)
        }
    }

    async function userIsTeacher() {
        const getId = await supabase.auth.getUser();
        const user_id = getId.data.user.id;
        const classId = await retClassId()

        const { data, error } = await supabase
            .from("class_duplicate")
            .select("created_by")
            .eq("class_id", classId);

        if (user_id === data[0].created_by) {
            setTeacher(true);

        } else {
            setTeacher(false);
        }
        if (error) {
            console.log(error)
        }
    }

    async function getTeacherQuotes() {
        const { data, error } = await supabase.from("quotes_for_Teachers").select("quote, quote_by")
        if (error) {
            console.log(error)
        }

        const quotes = data.map(quote => ({
            quote: quote.quote,
            quote_by: quote.quote_by
        })).sort(() => Math.random() - 0.5);

        setTeacherQuotes(quotes)
    }

    async function getStudentQuotes() {
        const { data, error } = await supabase.from("quotes_students").select("quotes, quote_by")
        if (error) {
            console.log(error)
        }

        const quotes = data.map(quote => ({
            quote: quote.quotes,
            quote_by: quote.quote_by
        })).sort(() => Math.random() - 0.5);

        setStudQuotes(quotes)
    }

    async function getMembersOfClass() {
        const classId = await retClassId()
        const { data, error } = await supabase
            .from("class_members_duplicate")
            .select("memberId")
            .eq("classId", classId)
        if (data) {
            setMembers(data)
        } else {
            console.log(error)
        }
    }

    async function fetchAssignments() {
        // Fetch all assignments for the class
        const classId = await retClassId()
        const { data, error } = await supabase
            .from("assignments_duplicate")
            .select("assignId, topic")
            .eq("class_id", classId);

        if (data) {
            setAssignments(data);
        } else {
            console.error("Error fetching assignments:", error);
        }
    }

    useEffect(() => {
        if (assignments.length > 0) {
            fetchAssignmentsWithNonSubmitters();
        }
    }, [assignments]);

    async function fetchAssignmentsWithNonSubmitters() {
        // Fetch non-submitters for each assignment
        const assignmentsWithDetails = [];

        for (const assignment of assignments) {
            const { data: submissions, error: subError } = await supabase
                .from("assignment_submit_duplicate")
                .select("submited_by")
                .eq("assignId", assignment.assignId);

            if (submissions) {
                // Fetch all members of the class
                const { data: members, error: memberError } = await supabase
                    .from("class_members_duplicate")
                    .select("memberId")
                    .eq("classId", class_id);

                if (members) {
                    const submittedByIds = submissions.map((s) => s.submited_by);

                    // Find the non-submitters by comparing with members
                    const nonSubmitters = members.filter(
                        (member) => !submittedByIds.includes(member.memberId)
                    );

                    // Fetch user details for non-submitters
                    const userDetailsPromises = nonSubmitters.map(async (nonSubmitter) => {
                        const { data: userData, error: userError } = await supabase
                            .from("users")
                            .select("user_name, user_profile_img")
                            .eq("user_id", nonSubmitter.memberId);

                        if (userData) {
                            return userData[0];
                        } else {
                            console.error("Error fetching user data for member", nonSubmitter.memberId, ":", userError);
                            return null;
                        }
                    });

                    const userDetails = await Promise.all(userDetailsPromises);

                    assignmentsWithDetails.push({
                        assignId: assignment.assignId,
                        topic: assignment.topic,
                        nonSubmitters: userDetails.filter((u) => u !== null),
                    });
                }
            } else {
                console.error("Error fetching submissions:", subError);
            }
        }

        setAssignmentsWithNonSubmitters(assignmentsWithDetails);
    }


    async function getStudentAssignments() {
        const classId = await retClassId();
        const getId = await supabase.auth.getUser();
        const user_id = getId.data.user.id;

        const assignmentsForStudent = [];

        for (const assignment of assignmentsWithNonSubmitters) {
            const nonSubmitters = assignment.nonSubmitters;

            // Check if the current user is a non-submitter
            const isNonSubmitter = nonSubmitters.some(
                (nonSubmitter) => nonSubmitter.user_id === user_id
            );

            if (isNonSubmitter) {
                assignmentsForStudent.push(assignment);
            }
        }

        return assignmentsForStudent;
    }
    async function getNotSub() {
        const studentAssignments = await getStudentAssignments();
        setNotSubmitted(studentAssignments)
    }

    useEffect(() => {
        fetchAssignments()
        getMembersOfClass()
    }, [class_id])

    useEffect(() => {
        fetchAssignmentsWithNonSubmitters();
    }, [members])
    useEffect(() => {
        userIsTeacher()
    }, [teacher])

    useEffect(() => {
        if (teacher) {
            getTeacherQuotes();
        }
    }, [teacher])

    useEffect(() => {
        if (!teacher) {
            getStudentQuotes()
        }
        getNotSub()
    }, [])

    useEffect(() => {
        if (!teacher) {
            if (studQuotes.length > 0) {
                const randomIndex = Math.floor(Math.random() * teacherQuotes.length);
                setRandomQuote(studQuotes[randomIndex]);
            }
        }

    }, [studQuotes]);

    useEffect(() => {
        if (teacherQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * teacherQuotes.length);
            setRandomQuote(teacherQuotes[randomIndex]);
        }
    }, [teacherQuotes]);



    return (
        <div>
            {navbar()}
            <div>
                {drawerData === undefined && teacher &&
                    <center>
                        <div className="box-shadow">
                            <div className="quote--container">
                                {teacher && (
                                    <center>
                                        {teacherQuotes.length > 0 && (
                                            <>
                                                <p className="quote">"{randomQuote.quote}"</p>
                                                <p className="quote--author">-{randomQuote.quote_by}</p>
                                            </>
                                        )}
                                    </center>
                                )}
                            </div>
                        </div>
                    </center>
                }
            </div>
            <div>
                {drawerData === undefined && !teacher &&
                    <center>
                        <div className="box-shadow">
                            <div className="quote--container">
                                {!teacher && (
                                    <center>
                                        {studQuotes.length > 0 && (
                                            <>
                                                <p className="quote">"{randomQuote.quote}"</p>
                                                <p className="quote--author">-{randomQuote.quote_by}</p>
                                            </>
                                        )}
                                    </center>
                                )}
                            </div>
                        </div>
                    </center>
                }
            </div>

            <div style={{ marginTop: 20 }}>
                <Grid>
                    {drawerData === undefined && teacher && assignmentsWithNonSubmitters.map((assignment, index) => (
                        <Grid item xs={12} key={index}>
                            <Paper elevation={3} style={{ padding: "20px" }}>
                                <Typography variant="h6">
                                    Assignment: {assignment.topic}
                                </Typography>
                                <Typography variant="h6">Students who have not submitted this assignment: </Typography>
                                {assignment.nonSubmitters.length > 0 ? (
                                    assignment.nonSubmitters.map((nonSubmitter, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                            <Avatar src={nonSubmitter.user_profile_img} sx={{ width: "40px", height: "40px", marginRight: "10px" }} />
                                            <Typography variant="body1">{nonSubmitter.user_name}</Typography>
                                        </div>
                                    ))
                                ) : (
                                    <Box display="flex" alignItems="center">
                                        <Icon component={AssignmentLate} sx={{ fontSize: 40, color: "primary" }} />
                                        <Typography variant="body1" marginLeft="10px">
                                            All students have submitted.
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
                
                    
                
            </div>
            <Grid container spacing={3}>
                {drawerData === undefined && teacher && assignmentsWithNonSubmitters.map((assignment, index) => (
                    <Grid item xs={12} key={index}>
                        <Paper elevation={3} style={{ padding: "20px" }}>
                            <Typography variant="h6">
                                Assignment: {assignment.topic}
                            </Typography>
                            <Typography variant="h6">Students who have not submitted this assignment: </Typography>
                            {assignment.nonSubmitters.length > 0 ? (
                                assignment.nonSubmitters.map((nonSubmitter, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                                        <Avatar src={nonSubmitter.user_profile_img} sx={{ width: "40px", height: "40px", marginRight: "10px" }} />
                                        <Typography variant="body1">{nonSubmitter.user_name}</Typography>
                                    </div>
                                ))
                            ) : (
                                <Box display="flex" alignItems="center">
                                    <Icon component={AssignmentLate} sx={{ fontSize: 40, color: "primary" }} />
                                    <Typography variant="body1" marginLeft="10px">
                                        All students have submitted.
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <div>
                {drawerData === undefined && assignments.length === 0 && teacher && (
                    <Box textAlign="center" mt={5}>
                        <Icon component={AssignmentTurnedIn} sx={{ fontSize: 80, color: 'primary' }} />
                        <Typography variant="h5" mt={2}>
                            No assignments found
                        </Typography>
                        <Typography variant="body1" mt={1}>
                            You haven't created any assignments yet. To create an assignment, click on <b>three lines</b> on top left corner and go to <b>Assignment</b> section.
                        </Typography>
                    </Box>
                )}
            </div>
            <div>
                {displayDrawerData()}
            </div>

        </div>
    );
}