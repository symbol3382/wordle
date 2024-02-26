import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import errorHandlingService from "../services/errorHandlingService";
import _ from 'lodash';
import SyncWord from "./syncWord";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import GameStatistics from "./gameStatistics";
import { Grid, Paper } from "@mui/material";
import moment from "moment";
import Loader from "../components/loader/loader";
import { useSearchParams } from "react-router-dom";


const AdminPanel = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const newQueryParameters = new URLSearchParams();

    const [errors, setErrors] = useState([]);
    const [loader, setLoader] = useState(true);
    const [statisticsDate, setStatisticsDate] = useState(moment());

    const [totalGuessCount, setTotalGuessCount] = useState({});
    const [guessCount, setGuessCount] = useState({});

    useEffect(() => {
        let date = searchParams.date || moment().format('YYYY-MM-DD') 
        updateStatistics(date);   
    }, []);

    const updateStatistics = (date) => {
        setLoader(true);
        date = moment(date);
        let dateStr = date.format("YYYY-MM-DD")
        adminApi.getGameStatistics(dateStr)
            .then((res) => {
                setLoader(false);
                setGuessCount(res.data.today_words);
                setStatisticsDate(date);
                setSearchParams({'date': dateStr});
                newQueryParameters.set('date', dateStr); 
            })
            .catch(e => {
                setLoader(false);
                console.error('Error in checking word', e);
                if (e?.response?.data?.message) {
                    setErrors(errorHandlingService.mapErrorsFromResponse(e.response));
                } else if (e?.message) {
                    setErrors([e.message]);
                }
            })
    }

    useEffect(() => {
        let totalGuessCountNew = 0;
        for (let key in guessCount) {
            totalGuessCountNew += (guessCount[key].guessCount || 0)
        }
        setTotalGuessCount(totalGuessCountNew)
    }, [guessCount]);

    


    if (loader) {
        return <Grid container
            sx={{ width: "100vw", height: "100vh" }}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Loader showLoader={true} />
        </Grid>
    }

    if (_.isEmpty(guessCount)) {
        return <SyncWord />
    }

    return <>
        <Paper elevation={4} sx={{ padding: 3 }}>
            <DatePicker value={statisticsDate} onChange={updateStatistics} format={"DD-MM-YYYY"} />
            <GameStatistics guesses={guessCount} />
        </Paper>
    </>
}

export default AdminPanel;