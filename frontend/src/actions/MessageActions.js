import {
    MESSAGE_CREATE_REQUEST,
    MESSAGE_CREATE_SUCCESS,
    MESSAGE_CREATE_FAIL
} from '../constants/MessageConstants'

import axios from 'axios'

export const createMessage = (content) => async (dispatch, getState) => {
    try {
        dispatch({ type: MESSAGE_CREATE_REQUEST })
        const { userLogin: { userInfo } } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.post('http://127.0.0.1:8000/api/v1/messages/', { 'content': content }, config)
        dispatch({ type: MESSAGE_CREATE_SUCCESS, payload: data })
    } catch (error) {
        dispatch({
            type: MESSAGE_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
            }