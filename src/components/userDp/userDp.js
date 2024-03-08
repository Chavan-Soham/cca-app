import React, { useState, useEffect } from "react";
import supabase from "../../supabaseClient";
import { Button } from "@mui/joy";
import { Upload } from "@mui/icons-material";
import { TextField } from "@mui/material";
import "../userDp/fileSelector.css"

const emptyImage = require('../userDp/profile.png')

export default function UserImage() {
    const [file, setFile] = useState(null);
    const [profPic, setProfPic] = useState('')

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    useEffect(() => {
        ProfPicLink(); // Fetch profile picture link when the component mounts

        // Subscribe to real-time changes in the users table
        const channels = supabase.channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'users' },
                (payload) => {
                    // When a change occurs, fetch the updated profile picture link
                    ProfPicLink();
                }
            )
            .subscribe();

        // Clean up subscription when the component unmounts
        return () => {
            channels.unsubscribe();
        };
    }, []);

    async function checkPicExists() {
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;

        const { data, error } = await supabase
            .from("users")
            .select("user_profile_img")
            .eq("user_id", user_id)
        if (data[0].user_profile_img !== null) {
            deleteExistingPic()
            uploadNewProfilePic()
        }
        if (data[0].user_profile_img === null) {
            uploadNewProfilePic()
        }
        if (error) {
            console.log(error)
        }
    }

    async function profPathDelete() {
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;

        const {data: getImagePath, error: noImgPath} = await supabase
            .from("users")
            .select("user_profile_pic_path")
            .eq("user_id", user_id)
        
        
        return getImagePath[0].user_profile_pic_path;

    }

    async function deleteExistingPic(){
        const imageUserPath = await profPathDelete()
        console.log(imageUserPath)
        const { error } = await supabase
        .storage
        .from('user-profile-images')
        .remove([`${imageUserPath}`])

        if (error) {
            console.log(error)
        }
        
    }

    async function ProfPicLink() {
        const getId = await supabase.auth.getUser();
        const user_id = getId.data.user.id;

        const { data, error } = await supabase
            .from("users")
            .select("user_profile_img")
            .eq("user_id", user_id);

        if (data) {
            setProfPic(data[0].user_profile_img);
        } else if (error) {
            console.error("Error fetching profile picture:", error.message);
        }
    }

    async function uploadNewProfilePic() {
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;

        const { data, error } = await supabase.storage
            .from('user-profile-images')
            .upload(`images/${file.name}`, file, { public: true });

        const imagePath = data.path;

        const { data: getPublicUrl, error: e } = await supabase.storage.from("user-profile-images").getPublicUrl(imagePath);

        const publicUrl = getPublicUrl.publicUrl;

        const { error: errorUserImage } = await supabase
            .from("users")
            .update({
                user_profile_img: publicUrl,
                user_profile_pic_path: imagePath
            })
            .eq("user_id", user_id)
            .select()

        if (errorUserImage) {
            console.log(errorUserImage)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Add your profile image!</h1>
            <div
                style={{
                    width: '330px',
                    height: '330px',
                    borderStyle: 'solid',
                    borderColor: 'red',
                    borderRadius: '50%',
                    backgroundImage: `url(${profPic ? profPic : emptyImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            ></div>
            <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}>
                <input
                    className="hideMe"
                    type="file"
                    accept="images/*"
                    onChange={handleFileChange}
                />
                <Button onClick={checkPicExists} style={{marginLeft: '10px'}}><Upload />Upload</Button>
            </div>
        </div>
    );
}