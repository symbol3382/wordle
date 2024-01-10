import React, { useEffect, useRef, useState } from "react";
import GuessRow from "./guessRow/guessRow";
import {
    Alert,
    ButtonGroup,
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
import Keyboard from "./keyboard/keyboard";
import { connect } from "react-redux";
import { setAttemptCount, setCurrentRow, setKeyWords, setSubmittedWords, setWordLength } from "../redux/actions/appActions";
import BoardResetButton from "./boardResetButton";

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
    return <Slide {...props} direction="up" />;
}

let GuessBox = props => {

    const {
        attemptsCount, setAttemptCount,
        currentRow, setCurrentRow,
        wordLength, setWordLength,
        submittedWords, setSubmittedWords,
        keyWords, setKeyWords,
    } = props;

    let keyData = keyWords[wordLength] || {};

    const maxAttempts = 6;

    const [askContinueOrReset, setAskContinueOrReset] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const submitRef = useRef();
    const [] = useState([]);

    console.log('state', props.state);

    useEffect(() => {
        let localStWords = localStorage.getItem('submittedWords');
        if (localStWords && JSON.parse(localStWords)) {
            localStWords = JSON.parse(localStWords);
            if (localStWords.submittedWords && localStWords.date === moment().format('L')) {
                if (localStWords.submittedWords.length && localStWords.submittedWords[0].word.length === wordLength) {
                    setSubmittedWords(localStWords.submittedWords);
                    setCurrentRow(localStWords.submittedWords.length)
                    if (localStWords.submittedWords.length === attemptsCount) {
                        setIsOver(true);
                        setAskContinueOrReset(true);
                    }
                } else {
                    console.error(`word length not same ${wordLength} ${localStWords.submittedWords[0].word}`)
                }
            } else {
                localStorage.removeItem('submittedWords');
            }
        }
        updateKeyStatusFromLocal()
    }, [])

    useEffect(() => {
        if (wordService.checkWin(submittedWords)) {
            // after winning user should not be able to input in any box
            setCurrentRow(-1);
            setIsWon(true);
        } else {
            setCurrentRow(submittedWords.length);
        }
        submittedWords.forEach(submitWord => {
            parseKeyboard(submitWord);
        })
    }, [submittedWords])

    useEffect(() => {
        setAttemptCount(wordLength + 1 > maxAttempts ? maxAttempts : wordLength + 1)
    }, [wordLength]);

    const parseKeyboard = (submitWord) => {
        let newKeyData = { ...keyData };
        submitWord.word.split('').forEach((char, index) => {
            if (newKeyData[char] === 1) {
                return;
            }
            if (submitWord.result[index] === 1) {
                newKeyData[char] = 1;
            } else if (submitWord.result[index] === -1) {
                newKeyData[char] = -1;
            } else {
                newKeyData[char] = 0;
            }
        })
        setKeyWords({
            ...keyWords,
            [wordLength]: newKeyData,
        });
        syncKeyStatusFromLocal(newKeyData);
    }

    const syncKeyStatusFromLocal = newKeyData => {
        let localKeyData = localStorage.getItem('keyStatus') || '{}';
        localKeyData = JSON.parse(localKeyData);
        localKeyData[moment().format('YYYY-MM-DD')] = localKeyData[moment().format('YYYY-MM-DD')] || {}
        localKeyData[moment().format('YYYY-MM-DD')][wordLength] = newKeyData;
        console.log('updating local with', localKeyData);
        localStorage.setItem('keyStatus', JSON.stringify(localKeyData));
    }

    const updateKeyStatusFromLocal = () => {
        let localKeyData = localStorage.getItem('keyStatus');
        if (!localKeyData) {
            return;
        }

        localKeyData = JSON.parse(localKeyData);
        if (localKeyData[moment().format('YYYY-MM-DD')]) {
            setKeyWords({
                ...keyWords,
                [wordLength]: localKeyData[moment().format('YYYY-MM-DD')][wordLength],
            })
        }
    }

    const resetKeyboard = () => {
        localStorage.removeItem('keyStatus');
        setKeyWords({})
    }

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
        console.log('submite', index, value);
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
        resetKeyboard();
        console.log('new word length', event.target.value);
        localStorage.setItem('wordLength', event.target.value);
        setWordLength(event.target.value);
    };

    return (
        <Grid container>
            <Snackbar
                open={isWon || isOver}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={1500}
                TransitionComponent={SlideTransition}
            >
                <Alert severity={isWon ? 'success' : 'warning'} sx={{ width: '100%' }}>
                    {isWon ? `Congratulations! You've Won` : `You ran out of moves now`}
                </Alert>
            </Snackbar>

            <Grid container alignItems={"center"} justifyContent={"end"} sx={{ padding: "30px" }}>
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
                            <MenuItem value={7}>7 Letters</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid
                container
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Grid item>
                    <Button variant={"contained"} color={"success"} onClick={submitWordManually}
                        sx={{ width: "100%", display: { xs: 'flex', sm: 'none' } }} disabled={isOver}> Submit </Button>
                    <Card style={{ background: "#121212" }}>
                        <CardContent sx={{ padding: "20px !important" }}>
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
                                                disableInput={isWon || guessRowNumber !== currentRow}
                                                submitGuess={(value) => onSubmitGuess(guessRowNumber, value)}
                                                wordLength={wordLength}
                                                submitRef={submitRef}
                                            ></GuessRow>
                                        </div>

                                    </Zoom>
                                </>
                            })}
                        </CardContent>

                    </Card>
                </Grid>
            </Grid>
            {
                (isWon || isOver) && <Grid container sx={{ mb: 3 }} justifyContent={"center"} alignItems={"center"}>
                    <Grid item lg={12} md={12} sm={12} xs={12} container justifyContent={"center"}>
                        <BoardResetButton
                            reset={reset}
                            resetKeyboard={resetKeyboard}
                            color={"success"}
                            isWon={isWon}
                        />
                    </Grid>
                </Grid>

            }
            <Grid container justifyContent={"center"}>
                <Keyboard keyData={keyData} />
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => ({
    attemptsCount: state.appReducer.game.attemptsCount,
    currentRow: state.appReducer.game.guess.currentRow,
    wordLength: state.appReducer.game.guess.wordLength,
    submittedWords: state.appReducer.game.submittedWords,
    keyWords: state.appReducer.game.keyboard.keyStatus,
    state: state,
})

const mapDispatchToProps = {
    setCurrentRow: setCurrentRow,
    setWordLength: setWordLength,
    setSubmittedWords: setSubmittedWords,
    setKeyWords: setKeyWords,
    setAttemptCount: setAttemptCount,
}

GuessBox = connect(mapStateToProps, mapDispatchToProps)(GuessBox);


export default GuessBox;
