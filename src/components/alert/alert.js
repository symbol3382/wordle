import {Alert, Slide, Snackbar} from "@mui/material";
import React from "react";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const AlertContainer = props => {
    const {errors, setErrors} = props

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To close the alert dialog
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param index
     * @returns {(function(*, *): void)|*}
     */
    const handleClose = index => (event, reason) => {
        let newErrors = [...errors];
        newErrors.splice(index);
        setErrors(newErrors)
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To prepare the action for the alert box and add the close button to close the alert
     * this will take input as index so on closing it only remove the selected index of errors,
     *
     * As this alert container is responsible for displaying multiple errors so on closing the single error its index
     * will be removed
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param index
     * @returns {JSX.Element}
     */
    const getAction = index => (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose(index)}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>
        </React.Fragment>
    );

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * @description To provide the sliding effect to alert component
     * -----------------------------------------------------------------------------------------------------------------
     *
     * @param props
     * @returns {JSX.Element}
     * @constructor
     */
    function SlideTransition(props) {
        return <Slide {...props} direction="up"/>;
    }

    return <>
        {
            errors && errors.map((error, index) => {
                // return <> {error} {index}</>;
                return <Snackbar
                    open={true}
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                    autoHideDuration={1500}
                    onClose={handleClose(index)}
                    TransitionComponent={SlideTransition}
                    message={error}
                    action={getAction(index)}
                >
                    <Alert onClose={handleClose(index)} severity="error" sx={{width: '100%'}}>
                        {error}
                    </Alert>
                </Snackbar>
            })
        }
    </>
}


export default AlertContainer;
