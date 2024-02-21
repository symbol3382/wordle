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
const getGameStatistics = (word) => {
    let endpoint = `${basePath}/admin/statistics`;
    return axios.get(endpoint, {
        word,
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

const adminApi = {
    getGameStatistics: getGameStatistics,
}

export default adminApi;
