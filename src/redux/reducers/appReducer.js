import actionTypes from "../types";

let initialState = {
    game: {
        attemptsCount: 4,
        guess: {
            currentRow: 0,
            wordLength: Number.parseInt(localStorage.getItem('wordLength') || 5),
        },
        submittedWords: [],
        won: false,
        over: false,
        keyboard: {
            keyStatus: {},
        }
    }
}

let appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.APP.SET_CURRENT_ROW:
            state = {
                ...state,
                game: {
                    ...state.game,
                    guess: {
                        ...state.game.guess,
                        currentRow: action.payload,
                    }
                }
            }
            break;
        case actionTypes.APP.SET_SUBMITTED_WORDS:
            state = {
                ...state,
                game: {
                    ...state.game,
                    submittedWords: action.payload,
                }
            }
            break;

        case actionTypes.APP.SET_WORD_LENGTH:
            state = {
                ...state,
                game: {
                    ...state.game,
                    guess: {
                        ...state.game.guess,
                        wordLength: action.payload,
                    }
                }
            }
            break;
        case actionTypes.APP.SET_KEY_STATUS:
            state = {
                ...state,
                game: {
                    ...state.game,
                    keyboard: {
                        ...state.game.keyboard,
                        keyStatus: action.payload
                    }
                }
            }
            break;
        case actionTypes.APP.SET_ATTEMPT_COUNT:
            state = {
                ...state,
                game: {
                    ...state.game,
                    attemptsCount: action.payload,
                }
            }
            break;
        default:
            console.log("Unhandled Action triggered", action.type);
            return state;
    }
    return state;
}

export default appReducer;