import { useLocation } from "react-router-dom";
import { Navbar } from "./dashNavbar";


export function ClassDashboard(){
    const location = useLocation()
    const getClassName = location.state.clickedClass;
    console.log(getClassName)
    return(
        <div>
            <Navbar/>
             <h1>{getClassName}</h1>
        </div>
    );
}