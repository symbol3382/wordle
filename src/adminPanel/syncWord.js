import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import adminApi from "../api/adminApi";

const SyncWord = () => {

    const syncWord = () => {
        adminApi.syncWords()
            .then(res => {
                console.log(res);
            })
            .catch(e => {
                console.log('e', e);
            });
    }

    return <Grid containerwidth={"100%"} spacing={3}>
        <Grid item container justifyContent={"center"} >
        <Typography variant={"h4"}>No Word Found</Typography>
        </Grid>
        <Grid item container justifyContent={"center"}>
            <Button onClick={syncWord} variant={"outlined"}>Sync Words</Button>
        </Grid>
    </Grid>
}

export default SyncWord;