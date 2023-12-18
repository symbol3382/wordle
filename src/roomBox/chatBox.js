import { Button, TextField, IconButton, InputAdornment } from "@mui/material"
import { useEffect, useState } from "react"
import webSocketService from "../services/socketService"
import React from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
// import { makeStyles } from '@mui/styles'



const ChatBox = (props) => {
    const [message, setMessage] = useState('')
    const [chats, updateChat] = useState([])
    const [isChatListenerAdded, setIsChatListenerAdded] = useState(false)
    // const useStyles = makeStyles()

    useEffect(()=> {
        console.log('inside the use effect.')
        if(!isChatListenerAdded){
            console.log('inside the first if')
            const chatListener = (chat) => {
                console.log('inside the second if')
                console.log('here is the response baby',chat)
                updateChat((previousChats) => [...previousChats, chat])
            }
            webSocketService.addChatListener(chatListener)
            setIsChatListenerAdded(true)
        }



        return () => {
            // webSocketService.socket.off('wordle-chat')
        }
    }, [isChatListenerAdded])

    const handleChange = (event) => {
        setMessage(event.target.value)
        
    }

    const sendMessage = () => {
        console.log('message is being sent')
        updateChat((previousChats) => [...previousChats, {username: localStorage.getItem('username'), chat: message}])
        webSocketService.sendChatMessage(message)
        setMessage('')
    }

    return (
        <div>
      <h2>Chat Box</h2>
      <Paper elevation={3} style={{ height: "500px", padding: "20px", overflowY: "auto", width: '316px' }}>
        <List>
          {chats.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${msg.username}: ${msg.chat}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <div>
      <TextField
        label="Message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton color="primary" onClick={sendMessage}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
    </div>
    )
}

export default ChatBox