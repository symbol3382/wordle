import axios from "axios";

const basePath = `${process.env.REACT_APP_API_PROTOCOL}${process.env.REACT_APP_API_BASE_PATH}`;

/**
 * ---------------------------------------------------------------------------------------------------------------------
 * @description To check the word is correct or not, and get the word each char status from API
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param word
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
const checkWord = (word, roomId) => {
    let endpoint = `http://localhost:3500/guess`;
    return axios.post(endpoint, {
        word,
        roomId
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

const wordApi = {
    checkWord: checkWord,
}

export default wordApi;
