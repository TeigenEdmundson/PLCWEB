import { Link } from "react-router-dom"
import "./navbar.css"

export default function NavBar(){

    return(
        <div className="nav-bar">
            <Link to="/home"><span>Home</span></Link>
            <span>EvenNewerSchoolers - OOPS THIS IS GONE</span>
        </div>
    )
}