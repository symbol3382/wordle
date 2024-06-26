import React from "react";
import {Grid} from "@mui/material";

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * @description To hold the box background for each type
 * 0 hold for text is not correct -> gray
 * -1 hold for text is correct but on wrong position -> yellow
 * 1 hold for text is correct and on correct position -> green
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @type {{"0": string, "1": string, "-1": string}}
 */
const boxBG = {
    '0': "#424949",
    "-1": "#B7950B",
    "1": "#186A3B"
}
const SubmittedRow = props => {
    const {submittedWords} = props;
    const {word, result} = submittedWords || {word: '', result: ''};

    return (
        <Grid container justifyContent={"space-between"} alignItems={"center"}
              sx={{ gap: "5px", height: "60px"}}>
            {Array.from(word).map((character, index) => {
                return <Grid
                    item
                    container
                    justifyContent={"center"}
                    alignItems={"center"}
                    className={"charBox"}
                    sx={{background: boxBG[result[index]], fontSize: "1.3rem", fontWeight: "bold"}}
                    key={`submittedRow${index}`}
                >
                    {character}
                </Grid>
            })}
        </Grid>
    )
}

export default SubmittedRow;
