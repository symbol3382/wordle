import { Button, Card, CardActions, CardContent, Fade, Grid, IconButton, Paper, Slide, Typography } from "@mui/material";
import React, { useState } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DatePicker } from "@mui/x-date-pickers";
import { Refresh, Restore } from "@mui/icons-material";


const DateHandler = ({ statisticsDate, updateStatistics}) => {


    return <>
    <DatePicker value={statisticsDate} onChange={updateStatistics} format={"DD-MM-YYYY"} />
    <IconButton >
        <Refresh/>
    </IconButton>
    </>
}

export default DateHandler;