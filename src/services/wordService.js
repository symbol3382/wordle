/**
 * ---------------------------------------------------------------------------------------------------------------------
 * @description To check if user has won or not, by iterating through the submitted words list
 * ---------------------------------------------------------------------------------------------------------------------
 *
 * @param submittedWords
 * @returns {boolean}
 */
const checkWin = (submittedWords) => {
    let checkIsWin = false;
    submittedWords.forEach(submit => {
        if (submit.match) {
            checkIsWin = true;
        }
    })
    return checkIsWin;
}

const wordService = {
    checkWin: checkWin,
}

export default wordService;
