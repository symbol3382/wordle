import React, {useState} from "react";
import {MuiOtpInput} from "mui-one-time-password-input";
import {Controller, useForm} from "react-hook-form";
import {Box} from "@mui/material";
import Button from "@mui/material/Button";
import './guessRow.module.css';
import wordApi from "../../api/wordApi";
import AlertContainer from "../../components/alert/alert";
import errorHandlingService from "../../services/errorHandlingService";

const GuessRow = props => {
    const {disableInput, wordLength} = props;
    const [text, setText] = useState('');
    const [errors, setErrors] = useState([]);

    const {control, handleSubmit} = useForm({
        defaultValues: {
            word: ""
        }
    });

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To update the `text` state when user type something on boxes
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param value
     */
    const handleOnUserType = (value) => {
        setText(value.toUpperCase());
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
        wordApi.checkWord(values.word.toUpperCase()).then(response => {
            props.submitGuess(response.data.data);
        }).catch(e => {
            if (e.response.data.messages) {
                setErrors(errorHandlingService.mapErrorsFromResponse(e.response));
            }
        });
    }

    return <>

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
                            sx={{marginBottom: 2, marginTop: 2, fontSize: "3rem", fontWeight: "bold"}}
                            validateChar={validateChar}
                            TextFieldsProps={{
                                disabled: disableInput || errors.length,
                                fontWeight: "bold",
                                fontSize: "80px",
                                sx: {fontSize: "xx-large", fontWeight: "bold"}
                            }}
                        />
                    </Box>
                )}
            />
            <Button type="submit" variant="contained" sx={{display: "none"}}>
                Submit
            </Button>
        </form>
    </>

}

export default GuessRow;
