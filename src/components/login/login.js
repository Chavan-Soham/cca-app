import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient"
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import "./login.css"

export default function Login(){
    const navigate = useNavigate()

    async function IfNameExists(){
        const getId = await supabase.auth.getUser()
        const user_id = getId.data.user.id;

        const {data, error} = await supabase    
            .from("users")
            .select("user_name")
            .eq("user_id", user_id)
            if (data && data.length > 0 && data[0].user_name) {
                // User_name exists, navigate to create_or_join
                console.log("User name found!")
                navigate("/create_or_join");
            } else {
                // User_name doesn't exist, navigate to welcomeUser
                navigate("/welcomeUser");
            }
            if (error) {
                console.log(error);
            }
    }
    supabase.auth.onAuthStateChange(async(event)=>{
        if (event==="SIGNED_IN") {
            console.log("successfully signed in")
            IfNameExists()
        }
    })

    return(
        <div className="main">
        <div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
        </div>
        <div className="authen">
            <Auth
                supabaseClient={supabase}
                appearance={{theme: ThemeSupa}}
                theme="light"
                providers={['github','google']}
            />
        </div>
        </div>
    );
}