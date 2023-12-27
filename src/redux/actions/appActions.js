import actionTypes from "../types";

export const setCurrentRow = row => ({
    type: actionTypes.APP.SET_CURRENT_ROW,
    payload: row,
})

export const setWordLength = row => ({
    type: actionTypes.APP.SET_WORD_LENGTH,
    payload: row,
})

export const setSubmittedWords = words => ({
    type: actionTypes.APP.SET_SUBMITTED_WORDS,
    payload: words,
})

export const setKeyWords = words => ({
    type: actionTypes.APP.SET_KEY_STATUS,
    payload: words,
})

export const setAttemptCount = attempts => ({
    type: actionTypes.APP.SET_ATTEMPT_COUNT,
    payload: attempts,
})