import './decorheader.css'
import {GiCigarette} from "react-icons/gi";
import { Link } from 'react-router-dom';

export default function DecorHeader(){
    return(
        <div className="decor-header">
            <div className='decor-header-title'>
                <GiCigarette style={{marginRight:"10px"}} size={20}/>
                <span style={{fontSize:"20"}}>ParkingLotChronicles</span>
            </div>
            <Link to="error/404" className="decor-header-options">
                <span className="not-last-one">6</span>
                <span className="not-last-one">6</span>
                <span className="last-one">6</span>
            </Link>
        </div>
    )
}