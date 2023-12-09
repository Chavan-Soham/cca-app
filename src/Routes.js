import { CreateOrJoin } from "./components/create_or_join/CreateOrJoin";
import Login from "./components/login/login";
const { createBrowserRouter } = require("react-router-dom");


const routes = createBrowserRouter(
    [
        {
            path:"/",
            element:<Login/>
        },
        {
            path:"/create_or_join",
            element:<CreateOrJoin/>
        }
    ]
)

export default routes