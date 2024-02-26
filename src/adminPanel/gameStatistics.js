import { Button, Card, CardActions, CardContent, Fade, Grid, IconButton, Paper, Slide, Typography } from "@mui/material";
import React, { useState } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * 
 * @param {{ guesses: {
 * word_length: number, 
 * word_name: string,
 * guess_count: number,
 * }[] }} param0 
 * @returns 
 */
const GameStatistics = ({ guesses }) => {

    const [wordVisible, setWordVisible] = useState(null);

    const toggleWordVisibility = (wordLength) => {
        return () => setWordVisible(wordVisible === wordLength ? null : wordLength);
    }

    return <Grid container spacing={2}>
        {
            guesses.map((guess) => {
                return <Grid item lg={3} md={4} sm={6} xs={12}>
                    <Card variant="outlined">
                        <React.Fragment>
                            <CardContent>
                                <Grid container>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Typography color="text.secondary" gutterBottom>
                                            Word Length
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                            {guess.word_length}
                                        </Typography>
                                        <Typography sx={{ mt: 3 }} color="text.secondary">
                                            Guessed By
                                        </Typography>
                                        <Typography variant="h5" component="div">
                                            {guess.guess_count}
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6} container justifyContent={"center"} alignItems={"center"} >
                                        {wordVisible === guess.word_length && <Fade in={wordVisible === guess.word_length}>
                                            <Paper sx={{ background: "none" }}>
                                                <Grid item lg={12}>
                                                    <Typography
                                                        sx={{ mt: 3, textAlign: "center", fontFamily: 'Monospace' }}
                                                        color="text.secondary"
                                                        variant="h4"
                                                    >
                                                        {guess.word_name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item sx={{ textAlign: "center" }}>
                                                    <IconButton onClick={toggleWordVisibility(guess.word_length)}>
                                                        <VisibilityOffIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Paper>
                                        </Fade>}
                                        {wordVisible !== guess.word_length && <Fade in={wordVisible !== guess.word_length}>
                                            <Paper sx={{ background: "none" }}>
                                                <Grid item lg={12}>
                                                    <Typography sx={{ mt: 3, textAlign: "center" }} color="text.secondary">
                                                        Show Word
                                                    </Typography>
                                                </Grid>
                                                <Grid item sx={{ textAlign: "center", mt: 2 }}>
                                                    <IconButton onClick={toggleWordVisibility(guess.word_length)}>
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Grid>
                                            </Paper>
                                        </Fade>}


                                    </Grid>
                                </Grid>

                            </CardContent>
                            <CardActions>
                                {/* <Button size="small">Learn More</Button> */}
                            </CardActions>
                        </React.Fragment>

                    </Card>

                </Grid>
            })
        }
    </Grid>
}

export default GameStatistics;