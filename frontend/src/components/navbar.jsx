import { Link } from "react-router-dom"
import "./navbar.css"

export default function NavBar(){

    return(
        <div className="nav-bar">
            <Link to="/home"><span>Home</span></Link>
            <Link to="/posts"><span>EvenNewerSchoolers</span></Link>
        </div>
    )
}