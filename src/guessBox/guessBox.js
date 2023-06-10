import React, {useEffect, useState} from "react";
import GuessRow from "./guessRow/guessRow";
import {Card, CardContent, Grid} from "@mui/material";
import './guessBox.css';
import SubmittedRow from "./submittedRow/submittedRow";
import moment from "moment";
import AskContinueOrReset from "./askContinueOrReset/askContinueOrReset";
import wordService from "../services/wordService";

const GuessBox = props => {

    let [attemptsCount, setAttemptsCount] = useState(6);
    let [currentGuessRowNumber, setCurrentGuessRowNumber] = useState(0);
    let [wordLength, setWordLength] = useState(5);
    const [submittedWords, setSubmittedWords] = useState([]);
    const [askContinueOrReset, setAskContinueOrReset] = useState(false);

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
        setCurrentGuessRowNumber(submittedWords.length);
        if (wordService.checkWin(submittedWords)) {
            setAskContinueOrReset(true);
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
            localStorage.removeItem('submittedWords');
            setSubmittedWords([]);
        }
        setAskContinueOrReset(false);
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To handle when the user submit a word and a sucessfull response is returned from API
     * if user has won the round then it will trigger the dialog box opening
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param options
     */
    const handleWordSubmit = (options) => {
        if (options.win) {
            setAskContinueOrReset(true);
        }
    }

    return (
        <>

            <AskContinueOrReset
                ask={askContinueOrReset && submittedWords.length}
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
                    <Card>
                        <CardContent>
                            {Array.from(Array(attemptsCount).keys()).map(guessRowNumber => {
                                return submittedWords[guessRowNumber]
                                    ? <SubmittedRow submittedWords={submittedWords[guessRowNumber]}/>
                                    : <GuessRow
                                        disableInput={guessRowNumber !== currentGuessRowNumber}
                                        key={Math.random()}
                                        onSubmit={handleWordSubmit}
                                        submitGuess={(value) => submitGuess(guessRowNumber, value)}
                                        wordLength={wordLength}
                                    />
                            })}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default GuessBox;
