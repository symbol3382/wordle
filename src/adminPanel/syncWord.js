import {Grid, Typography} from "@mui/material";
import Button from "@mui/material/Button";

const SyncWord = () => {

    const syncWords = () => {

    }

    return <Grid containerwidth={"100%"} spacing={3}>
        <Grid item container justifyContent={"center"} >
        <Typography variant={"h4"}>No Word Found</Typography>
        </Grid>
        <Grid item container justifyContent={"center"}>
            <Button variant={"outlined"}>Sync Words</Button>
        </Grid>
    </Grid>
}

export default SyncWord;