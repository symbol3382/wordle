import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Slide,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import wordService from "../../services/wordService";

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * @description To provide the sliding effect to dialog box
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<unknown>>}
 */
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * @description To hold the all three status of the game
 * @note add the title and content as well when adding a new game status
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @type {{inGame: number, gameOver: number, win: number}}
 */
const GAME_STATUS = {
    win: 1,
    inGame: 2,
    gameOver: 3,
}

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * @description As with each game status there will be specific title for the dialog box
 * @note for any game status there should be a title
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @type {{[p: number]: string}}
 */
const titles = {
    [GAME_STATUS.win]: `Congratulations ! You've won the round`,
    [GAME_STATUS.inGame]: `Continue, Where You Left ?`,
    [GAME_STATUS.gameOver]: `Oops ! You've ran out of moves`,
}

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * @description As there will be specific content message of dialog to show for each type of game status so this
 * variable will hold the content for dialog with respect to game status
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @type {{[p: number]: string}}
 */
const contents = {
    [GAME_STATUS.win]: `Great ! You have guessed the word, 
                        let's explore the more area here and find more challenges for you`,
    [GAME_STATUS.inGame]: `Seems like last time you have left the game in middle of, Would you like to continue where you left the game or start a new game ?`,
    [GAME_STATUS.gameOver]: `Oops ! You've ran out of moves`,
}

const AskContinueOrReset = props => {
    const {ask} = props;

    const [open, setOpen] = useState(false);
    const [gameStatus, setGameStatus] = useState(GAME_STATUS.inGame);
    const [answer, setAnswer] = useState(null);

    useEffect(() => {
        refreshGameStatus();
        setOpen(ask);
        let answerSubmit = props.submittedWords.find(submit => submit.match);
        setAnswer(answerSubmit ? answerSubmit.word : null);

    }, [ask])

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To Refresh the game status state
     * -----------------------------------------------------------------------------------------------------------------
     */
    const refreshGameStatus = () => {
        if (props.submittedWords.length === props.attemptsCount) {
            setGameStatus(GAME_STATUS.gameOver)
        } else if (wordService.checkWin(props.submittedWords)) {
            setGameStatus(GAME_STATUS.win);
        } else {
            setGameStatus(GAME_STATUS.inGame);
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description to close the dialog box
     * if the user has clicked outside the dialog box it should not get closed so it will check
     * if reason is `backdropClick` or not
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param event
     * @param reason
     */
    const handleClose = (event = null, reason = null) => {
        if (reason !== 'backdropClick') {
            props.onClose({reset: false});
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To reset the game and close the dialog
     * -----------------------------------------------------------------------------------------------------------------
     */
    const resetGame = () => {
        props.onClose({reset: true});
    }

    return (<>
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            disableEscapeKeyDown={true}
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{titles[gameStatus]}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {contents[gameStatus]}
                    {gameStatus === GAME_STATUS.win && answer &&
                        <>
                            <br/>
                            Your answer is
                            <Grid container justifyContent={"center"} alignItems={"center"}>
                                <Typography content={"h1"} sx={{fontSize: "3rem"}}>
                                    {answer}
                                </Typography>
                            </Grid>
                        </>
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {gameStatus === GAME_STATUS.inGame && <Button onClick={handleClose}>Continue</Button>}
                {gameStatus === GAME_STATUS.win && <Button onClick={handleClose}>Close</Button>}
                <Button onClick={resetGame}>Reset</Button>
            </DialogActions>
        </Dialog>
    </>);
}

export default AskContinueOrReset;
