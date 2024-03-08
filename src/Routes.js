import { CreateOrJoin } from "./components/create_or_join/CreateOrJoin";
import { ClassDashboard } from "./components/dashboard/dashboard";
import Login from "./components/login/login";
import { WelcomeUser } from "./components/login/welcomeUser";
import UserImage from "./components/userDp/userDp";
const { createBrowserRouter } = require("react-router-dom");


const routes = createBrowserRouter(
    [
        {
            path:"/",
            element:<Login/>,
            index: true
        },
        {
            path:"/create_or_join",
            element:<CreateOrJoin/>
        },
        {
            path: "/welcomeUser",
            element: <WelcomeUser/>
        },
        {
            path: "/dashboard",
            element: <ClassDashboard/>
        },
        {
            path: "/profileImage",
            element: <UserImage/>
        }
    ]
)

export default routes