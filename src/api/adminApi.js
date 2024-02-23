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
const getGameStatistics = () => {
    let endpoint = `${basePath}/admin/statistics`;
    return axios.get(endpoint, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

const syncWords = () => {
    let endpoint = `${basePath}/admin/sync-word`
    return axios.post(endpoint, {}, {
        headers: {
            "Content-type": "application/json",
        }
    })
}

const adminApi = {
    getGameStatistics: getGameStatistics,
    syncWords: syncWords,
}

export default adminApi;
