import { Link } from "react-router-dom"

export default function Footer(){

    return(
        <div style = {{display:'flex', flexDirection:'column', alignItems: 'center', alignSelf:'center', backgroundColor:'beige', padding:5, position:'absolute', bottom:0}}>
            <span style={{color:'black', fontSize:10}}>This is where your supposed to put copyright bullshit.  idk about any of that.  steal it if you want i guess</span>
            <span style={{color:'black', fontSize:10}}>BTC: 0x9d1Ad7FD6b5f70eE7aFa378A52B72DE45E729A7e any money given to me will go straight to Stake.com</span>
        </div>
    )
}