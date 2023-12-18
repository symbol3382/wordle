import React, {useEffect, useRef, useState} from "react";
import GuessRow from "./guessRow/guessRow";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Card,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Slide,
    Snackbar,
    Zoom
} from "@mui/material";
import './guessBox.css';
import SubmittedRow from "./submittedRow/submittedRow";
import moment from "moment";
import AskContinueOrReset from "./askContinueOrReset/askContinueOrReset";
import wordService from "../services/wordService";
import Button from "@mui/material/Button";
import RoomDialog from "../components/alert/roomDialog";
import webSocketService from "../services/socketService";
import ChatBox from "../roomBox/chatBox";
/**
 * ---------------------------------------------------------------------------------------------------------------------
 * @description To provide the sliding effect to alert component
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SlideTransition(props) {
    return <Slide {...props} direction="up"/>;
}

const GuessBox = props => {

    let [attemptsCount, setAttemptsCount] = useState(5);
    let [currentGuessRowNumber, setCurrentGuessRowNumber] = useState(0);
    let [wordLength, setWordLength] = useState(5);
    const [openDialog, setOpenDialog] = useState(false)
    const [submittedWords, setSubmittedWords] = useState([]);
    const [askContinueOrReset, setAskContinueOrReset] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const submitRef = useRef();
    const navigate = useNavigate()
    const { userType } = props
    const [disableInput, setDisableInput] = useState(false)
    const [roomInput, setRoomInput] = useState('')

    useEffect(() => {
        let localStWords = localStorage.getItem('submittedWords');
        if (localStWords && JSON.parse(localStWords)) {
            localStWords = JSON.parse(localStWords);
            if (localStWords.submittedWords && localStWords.date === moment().format('L')) {
                if (localStWords.submittedWords.length && localStWords.submittedWords[0].word.length === wordLength) {
                    setSubmittedWords(localStWords.submittedWords);
                    setCurrentGuessRowNumber(localStWords.submittedWords.length)
                    setAskContinueOrReset(true);
                } else {
                    alert(`word length not same ${wordLength} ${localStWords.submittedWords[0].word}`)

                }
            } else {
                localStorage.removeItem('submittedWords');
            }
        }

        if(props.room) {
            if(props.userType === 'admin') {
                setDisableInput(false)
            }
            else{
                setDisableInput(true)
                    const messageListener = (message) => {
                        setCurrentGuessRowNumber(message.key)
                        setRoomInput(message.input);
                    };
                    webSocketService.addMessageListener(messageListener);
            }
        }

    }, [props, wordLength])

    useEffect(() => {
        if (wordService.checkWin(submittedWords)) {
            // after winning user should not be able to input in any box
            setCurrentGuessRowNumber(-1);
            setIsWon(true);
        } else {
            setCurrentGuessRowNumber(submittedWords.length);
        }
    }, [submittedWords])

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To update the submitted words array
     * it will update the state variable for submitted word and the local storage
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param index
     * @param value
     */
    const onSubmitGuess = (index, value) => {
        let newSubmits = [...submittedWords];
        newSubmits[index] = value;
        setSubmittedWords(newSubmits);
        localStorage.setItem('submittedWords', JSON.stringify({
                date: moment().format('L'),
                submittedWords: newSubmits,
            })
        )
        if (value.match) {
            setIsWon(true);
        } else if (newSubmits.length === attemptsCount) {
            setIsOver(true);
        }
        props.room && setRoomInput('')
    }


    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To handle the input when user click on the dialog box when user resume the game and a dialog appear
     * if user has chosen the reset option it will remove the submitted words
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param options
     */
    const handleAskSubmit = (options) => {
        if (options.reset) {
            reset();
        }
        setAskContinueOrReset(false);
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To reset the game and make the board clean
     * -----------------------------------------------------------------------------------------------------------------
     */
    const reset = () => {
        localStorage.removeItem('submittedWords');
        setSubmittedWords([]);
        setIsWon(false);
        setIsOver(false);
    }

    const submitWordManually = () => {
        console.log('dddddd submitting', submitRef.current);
        if (submitRef.current) {
            submitRef.current.click();
        }
    }

    const onWordLengthSelect = (event) => {
        reset();
        setWordLength(event.target.value);
    };

    const createRoom = () => {
        setOpenDialog(true)
    }

    const onCancel = () => {
        setOpenDialog(false)
    }


    const handleToClose = (data) => {
        setOpenDialog(false);
        const id = makeid(8)
        localStorage.setItem('roomid', id)
        navigate(`/${id}`, {state: {type: 'admin'}})
    
    };

    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }

    return (
        <>
            <Snackbar
                open={isWon || isOver}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                autoHideDuration={1500}
                TransitionComponent={SlideTransition}
            >
                <Alert severity={isWon ? 'success' : 'warning'} sx={{width: '100%'}}>
                    {isWon ? `Congratulations! You've Won` : `You ran out of moves now`}
                </Alert>
            </Snackbar>


            <AskContinueOrReset
                ask={askContinueOrReset}
                onClose={handleAskSubmit}
                submittedWords={submittedWords}
                attemptsCount={attemptsCount}
            />
            <Grid container alignItems={"center"} justifyContent={"end"} sx={{padding: "30px"}}>
                <Grid item lg={2}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Word Length</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={wordLength}
                            label="Word Length"
                            onChange={onWordLengthSelect}
                        >
                            <MenuItem value={3}>3 Letters</MenuItem>
                            <MenuItem value={4}>4 Letters</MenuItem>
                            <MenuItem value={5}>5 Letters</MenuItem>
                            <MenuItem value={6}>6 Letters</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <div style={{display: 'flex'}}>
            <Grid
                container
                justifyContent={"center"}
                alignItems={"center"}
                sx={{height: "80vh"}}
            >
                <Grid item>
                    <Button variant={"contained"} color={"success"} onClick={submitWordManually}
                            sx={{width: "100%", display: {xs: 'flex', sm: 'none'}}} disabled={isOver}> Submit </Button>
                    <Card>
                        <CardContent sx={{padding: "20px !important"}}>
                            {Array.from(Array(attemptsCount).keys()).map(guessRowNumber => {
                                return <>
                                    <Zoom in={submittedWords[guessRowNumber]}
                                          className={submittedWords[guessRowNumber] ? "" : 'hidden'}

                                        // orientation="vertical"
                                        // sx={{display: submittedWords[guessRowNumber] ? "block" : "none"}}
                                    >
                                        <div>
                                            <SubmittedRow submittedWords={submittedWords[guessRowNumber]}
                                                          key={Math.random()}></SubmittedRow>
                                        </div>

                                    </Zoom>
                                    <Zoom in={!submittedWords[guessRowNumber]}
                                          className={!submittedWords[guessRowNumber] ? "" : 'hidden'}
                                    >
                                        <div>
                                            <GuessRow
                                                key={guessRowNumber}
                                                disableInput={disableInput || isWon || guessRowNumber !== currentGuessRowNumber}
                                                submitGuess={(value) => onSubmitGuess(guessRowNumber, value)}
                                                wordLength={wordLength}
                                                submitRef={submitRef}
                                                value={guessRowNumber === currentGuessRowNumber && props.room && disableInput ? roomInput : false}
                                                row={currentGuessRowNumber}
                                                guessRowNumber={guessRowNumber}
                                            ></GuessRow>
                                        </div>

                                    </Zoom>
                                </>
                            })}
                        </CardContent>
                        {(isWon || isOver) && <CardActions>
                            <Grid container justifyContent={"center"} alignItems={"center"}>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Button variant={"contained"}
                                            onClick={reset}
                                            sx={{width: '100%'}}
                                            color={"success"}>
                                        Reset
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardActions>}
                    </Card>
                </Grid>
            </Grid>
            {userType && <Grid container alignItems={"center"} justifyContent={"end"} sx={{padding: "20px"}} marginBottom={"10px"} width={'20%'}>
                <ChatBox/>
            </Grid>}
            </div>

            {!props.room && <Button onClick={createRoom} justifyContent={"end"} variant="outlined">Create Room</Button>  }
            {openDialog && <RoomDialog onClose={handleToClose} onCancel={onCancel} userType='admin' />}


            <Grid float='right'>
                
            </Grid>
        </>
    )
}

export default GuessBox;
