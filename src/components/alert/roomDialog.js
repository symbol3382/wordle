import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React from 'react';

const RoomDialog = (props) => {
    const { userType } = props
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    const handleSubscribe = () => {
        localStorage.setItem('username', value)
        props.onClose(value)
    }


    return(
        <div>
        <Dialog  open={true}>
            <DialogTitle>{userType == 'admin' ? 'Create Room' : 'Join Room'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your username. 
                    </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Username"
                            type="text"
                            fullWidth
                            variant="standard"
                            onChange={handleChange}
                        />
                     </DialogContent>
            <DialogActions>
            <Button onClick={props.onCancel}>Cancel</Button>
            <Button onClick={handleSubscribe}>Subscribe</Button>
            </DialogActions>

        </Dialog>
        </div>

    )


}

export default RoomDialog