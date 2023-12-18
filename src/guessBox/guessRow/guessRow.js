import React, {useEffect, useState} from "react";
import {MuiOtpInput} from "mui-one-time-password-input";
import {Controller, useForm} from "react-hook-form";
import {Box, Grid} from "@mui/material";
import Button from "@mui/material/Button";
import './guessRow.module.css';
import wordApi from "../../api/wordApi";
import AlertContainer from "../../components/alert/alert";
import errorHandlingService from "../../services/errorHandlingService";
import webSocketService from "../../services/socketService";
import { useParams } from "react-router-dom";


const GuessRow = props => {
    const {row, disableInput, wordLength, submitRef, value, guessRowNumber} = props;
    const [text, setText] = useState('');
    const [errors, setErrors] = useState([]);
    const [roomId, setRoomId] = useState('')
    const params = useParams()

    const {control, handleSubmit} = useForm({
        defaultValues: {
            word: ""
        }
    });

    useEffect(() => {

        if(params.id){
            setRoomId(params.id)
        }

        
        if(value && guessRowNumber === row) {
            let updatedValu = value.toUpperCase()
            setText(updatedValu)
        }

        if(disableInput && !value) {
           setText("");
        }

       if(roomId){
            const responseListener = (response) => {
                if(disableInput && guessRowNumber === row ){
                    props.submitGuess(response.data)
                }
            }
            // Add the responseListener only once when the component mounts
            webSocketService.addResponseListener(responseListener);
        }


    }, [disableInput, value, params])

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To update the `text` state when user type something on boxes
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param value
     */
    const handleOnUserType = (value) => {
        setText(value.toUpperCase());
        if(!disableInput && roomId){
            webSocketService.sendMessage({input: value, key: row})
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To validate the each character, user input before updating the `text` state so only character keep
     * it will check the input should be valid alphabet only
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param value
     * @param index
     * @returns {boolean|*}
     */
    const validateChar = (value, index) => {
        return !value || value.match(/^[A-Za-z]$/);
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To handle the submit of one row from the user
     * Here the API will be triggered with the user input text value and on success of api response
     * it will update the user submited rows.
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param values
     */
    const handleWordGuessSubmit = (values) => {
        wordApi.checkWord(values.word.toUpperCase(), roomId).then(response => {
            props.submitGuess(response.data.data);
        }).catch(e => {
            if (e.response.data.messages) {
                setErrors(errorHandlingService.mapErrorsFromResponse(e.response));
            }
        });
    }

    return <>
        <Grid container justifyContent={"space-between"} alignItems={"center"}
              sx={{ gap: "10px"}}>
        <AlertContainer errors={errors} setErrors={setErrors}/>
        <form onSubmit={handleSubmit(handleWordGuessSubmit)}>
            <Controller
                name="word"
                control={control}
                rules={{validate: (value) => value.length === props.wordLength}}
                render={({field, fieldState}) => (
                    <Box>
                        <MuiOtpInput
                            length={wordLength}
                            {...field}
                            onChange={(value) => {
                                handleOnUserType(value);
                                field.onChange(value);
                            }}
                            value={text}
                            sx={{gap: "5px", marginTop: "5px", marginBottom: "5px"}}
                            validateChar={validateChar}
                            TextFieldsProps={{
                                disabled: !!(disableInput || errors.length),
                                fontWeight: "bold",
                                fontSize: "80px",
                                sx: {fontSize: "xx-large", fontWeight: "bold"}
                            }}
                        />
                    </Box>
                )}
            />
            {
                disableInput ?
                    <Button type="submit" variant="contained" sx={{display: "none"}}>
                        Submit
                    </Button>
                    :
                    <Button type="submit" ref={submitRef} variant="contained" sx={{display: "none"}}>
                        Submit Ref
                    </Button>
            }

        </form>
        </Grid>
    </>

}

export default GuessRow;
