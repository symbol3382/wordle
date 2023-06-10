import React, {useEffect, useState} from "react";
import GuessRow from "./guessRow/guessRow";
import {Alert, Card, CardActions, CardContent, Grid, Slide, Snackbar} from "@mui/material";
import './guessBox.css';
import SubmittedRow from "./submittedRow/submittedRow";
import moment from "moment";
import AskContinueOrReset from "./askContinueOrReset/askContinueOrReset";
import wordService from "../services/wordService";
import Button from "@mui/material/Button";

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

    let [attemptsCount, setAttemptsCount] = useState(6);
    let [currentGuessRowNumber, setCurrentGuessRowNumber] = useState(0);
    let [wordLength, setWordLength] = useState(5);
    const [submittedWords, setSubmittedWords] = useState([]);
    const [askContinueOrReset, setAskContinueOrReset] = useState(false);
    const [isWon, setIsWon] = useState(false);

    useEffect(() => {
        let localStWords = localStorage.getItem('submittedWords');
        if (localStWords && JSON.parse(localStWords)) {
            localStWords = JSON.parse(localStWords);
            if (localStWords.submittedWords && localStWords.date === moment().format('L')) {
                setSubmittedWords(localStWords.submittedWords);
                setCurrentGuessRowNumber(localStWords.submittedWords.length)
                setAskContinueOrReset(true);
            } else {
                alert('removing word');
                localStorage.removeItem('submittedWords');
            }
        }
    }, [])

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
    const submitGuess = (index, value) => {
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
        }
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
    }

    return (
        <>
            <Snackbar
                open={isWon}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                autoHideDuration={1500}
                TransitionComponent={SlideTransition}
            >
                <Alert severity="success" sx={{width: '100%'}}>
                    Congratulations You've Won
                </Alert>
            </Snackbar>

            <AskContinueOrReset
                ask={askContinueOrReset}
                onClose={handleAskSubmit}
                submittedWords={submittedWords}
                attemptsCount={attemptsCount}
            />

            <Grid
                container
                justifyContent={"center"}
                alignItems={"center"}
                sx={{height: "100vh"}}
            >
                <Grid item>
                    <Card sx={{paddingBottom: 2}}>
                        <CardContent>
                            {Array.from(Array(attemptsCount).keys()).map(guessRowNumber => {
                                return submittedWords[guessRowNumber]
                                    ? <SubmittedRow submittedWords={submittedWords[guessRowNumber]}/>
                                    : <GuessRow
                                        disableInput={isWon || guessRowNumber !== currentGuessRowNumber}
                                        key={Math.random()}
                                        submitGuess={(value) => submitGuess(guessRowNumber, value)}
                                        wordLength={wordLength}
                                    />
                            })}
                        </CardContent>
                        {isWon && <CardActions>
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
        </>
    )
}

export default GuessBox;
