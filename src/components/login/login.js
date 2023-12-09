import React from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient"
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import "./login.css"

export default function Login(){
    const navigate = useNavigate()
    supabase.auth.onAuthStateChange(async(event)=>{
        if (event==="SIGNED_IN") {
            navigate("/create_or_join")
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