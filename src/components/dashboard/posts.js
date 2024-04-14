import React, { useEffect, useState } from "react";
import { Button } from "@mui/joy"
import supabase from "../../supabaseClient";
import { get } from "jquery";


export function Posts({ classId }){
    const [userIsTeacher, setUserAsTeacher] = useState()
    

    async function checkUserIsCreator(){
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;

        const { data, error} = await supabase
            .from("class_duplicate")
            .select("created_by")
            .eq("class_id", classId)

        if (data[0].created_by === user_id) {
            setUserAsTeacher(true)
        }
        if (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        checkUserIsCreator()
    }, [])
    return(
        <div>
            {checkUserIsCreator && (
                <div>
                    <Button>Create a post</Button>
                </div>
            )}
        </div>
    )
}