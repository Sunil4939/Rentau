import { LOADING,  All_CAR_LIST, DEVICE_TOKEN } from "../types";

const initialState = {
    loading: false,
    allCarList: null,
    device_token: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case All_CAR_LIST:
            return {
                ...state,
                allCarList: action.payload
            }
            case DEVICE_TOKEN:
                return {
                    ...state,
                    device_token: action.payload
                }
            case LOADING:
                return {
                    ...state,
                    loading: action.payload
                }
        default:
            return state;
    }
}