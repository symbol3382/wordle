import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import errorHandlingService from "../services/errorHandlingService";

const AdminPanel = () => {
    const [errors, setErrors] = useState([]);

    const [totalGuessCount, setTotalGuessCount] = useState({});
    const [guessCount, setGuessCount] = useState({});

    useEffect(() => {
        totalGuessCount = 0;
        for(let key in guessCount) {
            totalGuessCount += guessCount[key].guessCount || 
        }
    }, [guessCount]);


    useEffect(() => {
        adminApi.getGameStatistics()
            .then((res) => {
                console.log(res.data)
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

    return <>
    </>
}

export default AdminPanel;