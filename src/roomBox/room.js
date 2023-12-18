import { useLocation, useParams } from "react-router-dom";
import GuessBox from "../guessBox/guessBox";
import { useEffect, useState } from "react";
import webSocketService from "../services/socketService";
import roomAPI from "../api/roomAPI";
import ChatBox from "./chatBox";
import { Grid } from "@mui/material";

const  Room = () => {
    const location = useLocation()
    const [userType, setUserType] = useState('')
    const params = useParams()

    useEffect( ()=> {
        localStorage.setItem('roomid', params.id)

        if(location.state && location.state.type === 'admin') {
            webSocketService.initializeSocket()
            setUserType('admin')
        }
        else{
            roomAPI.checkIfRoomExists(params.id).then(response => {
                if(response.data.roomExists) {
                    webSocketService.initializeSocket()
                    setUserType('default')
                }
                else{
                    console.log('YOYOYOYOYOYOY NO ROOM FOR YOU BROTHER')
                }
            })
            .catch(err => {
                console.log(err)
            })

            
        }



    }, [location.state]



    )

    return (
      <div> 
        {/* <div display> */}
       {userType && <GuessBox userType={userType} room={true} showBubbles={true} bubblesPosition = {{left: '50%', top: '50%'}} />}
       {/* <Grid container alignItems={"center"} justifyContent={"end"} sx={{padding: "30px"}} marginBottom={"20px"}>
       {userType && <ChatBox/>}
       </Grid>
       </div>
    {!userType && <h1>Sorry, nikal  be lau**</h1>}*/}
    </div> 
    )

}


export default Room