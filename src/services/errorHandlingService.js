/**
 * ---------------------------------------------------------------------------------------------------------------------
 * @description To handle the error messages from the API
 * here all the input variable errors will be merged to a single array and returned
 *
 * @note it will remove the error keys and only error messages will be collected
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param response
 * @returns {*[]}
 */
const mapErrorsFromResponse = (response) => {
    let newErrors = [];
    if (response.data.messages) {
        Object.values(response.data.messages).forEach(errors => {
            newErrors = [...newErrors, ...errors]
        })
    }
    return newErrors;
}

const errorHandlingService = {
    mapErrorsFromResponse: mapErrorsFromResponse,
}

export default errorHandlingService;
