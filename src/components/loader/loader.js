import { CircularProgress, Grid } from "@mui/material"

const Loader = ({showLoader}) => {
    if(showLoader) {
        return <CircularProgress/>
    }
}

export default Loader;