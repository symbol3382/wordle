import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import errorHandlingService from "../services/errorHandlingService";
import _ from 'lodash';
import SyncWord from "./syncWord";
import GameStatistics from "./gameStatistics";

const AdminPanel = () => {
    const [errors, setErrors] = useState([]);

    const [totalGuessCount, setTotalGuessCount] = useState({});
    const [guessCount, setGuessCount] = useState({});

    useEffect(() => {
        let totalGuessCountNew = 0;
        for(let key in guessCount) {
            totalGuessCountNew += (guessCount[key].guessCount || 0)
        }
        setTotalGuessCount(totalGuessCountNew)
    }, [guessCount]);

    useEffect(() => {
        adminApi.getGameStatistics()
            .then((res) => {
                setGuessCount(res.data.today_words);
            })
            .catch(e => {
                console.error('Error in checking word', e);
                if (e?.response?.data?.message) {
                    setErrors(errorHandlingService.mapErrorsFromResponse(e.response));
                } else if (e?.message) {
                    setErrors([e.message]);
                }
            })
    }, []);

    if(_.isEmpty(guessCount)) {
        return <SyncWord/>
    }

    return <>
        <GameStatistics guesses={guessCount}/>
    </>
}

export default AdminPanel;