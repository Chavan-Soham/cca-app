import { useLocation } from "react-router-dom";


export function ClassDashboard(){
    const location = useLocation()
    const getClassName = location.state;
    console.log(getClassName)
    return(
        <div>
{/*             <h1>{getClassName}</h1> */}
        </div>
    );
}