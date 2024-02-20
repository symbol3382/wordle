import { Grid } from "@mui/material";

const Key = ({ char, keyValue }) => {
    let classes = {
        '-1': 'charSpan-yellowBG',
        '1': 'charSpan-greenBg',
        '0': 'charSpan-null'
    }
    return <span className={`${classes[keyValue]} charSpan`}> {char} 
    </span>
}

const Keyboard = ({keyData}) => {
    let rows = [
        'QWERTYUIOP',
        'ASDFGHJKL',
        'ZXCVBNM',
    ];

    return rows.map(row => {
        return <Grid item container key={`${row}-charRow`} justifyContent={"center"}>
            {row.split('').map(char => {
                return <Key keyValue={keyData[char]} char={char} />
            })}
        </Grid>
    })
}

export default Keyboard;