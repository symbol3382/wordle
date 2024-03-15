import { CircularProgress, Grid, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import adminApi from "../api/adminApi";
import { useEffect, useState } from "react";
import moment from "moment";

const SyncWord = ({ statisticsDate, onSync }) => {

    const [allowSync, setAllowSync] = useState(false);
    const [loadingSync, setLoadingSync] = useState(false);

    useEffect(() => {
        setAllowSync(moment().isSameOrBefore(statisticsDate, 'date') && moment().add(30, 'd').isSameOrAfter(statisticsDate, 'date'))
    }, [statisticsDate]);

    const syncWord = () => {
        setLoadingSync(true);
        adminApi.syncWords()
            .then(() => {
                onSync();
                setLoadingSync(false);
            })
            .catch(e => {
                console.log('e', e);
            });
    }

    return <Grid container width={"100%"} height={"100%"} spacing={3}>
        <Grid item container justifyContent={"center"} >
            <Typography variant={"h4"}>No Word Found</Typography>
        </Grid>
        <Grid item container justifyContent={"center"}>
            <Tooltip title={allowSync ? "" : "You can only sync 30 days from today"}>
                <span>
                    {loadingSync ?
                        <CircularProgress size={30} /> :
                        <Button onClick={syncWord} variant={"outlined"} disabled={!allowSync}>
                            Sync Words
                        </Button>
                    }
                </span>
            </Tooltip>
        </Grid>
    </Grid>
}

export default SyncWord;