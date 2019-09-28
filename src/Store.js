import React from 'react';
import io from 'socket.io-client';

export const CTX = React.createContext();

const initialState = {
    Topic_1: [
        {from: 'alan', msg: 'hello'},
        {from: 'arnold', msg: 'hello'},
        {from: 'archer', msg: 'hello'},
    ],
    Topic_2: [
        {from: 'dave', msg: 'bye'},
        {from: 'danny', msg: 'bye'},
        {from: 'don', msg: 'bye'},
    ]
}

function reducer(state, action) {
    const { from, msg, topic } = action.payload;
    switch(action.type) {
        case 'RECEIVE_MESSAGE' :
            return {
                ...state,
                [topic]: [
                    ...state[topic],
                    {from, msg}
                ]
            }
            default:
                return state;
    }
}

let socket;

function sendChatAction(value) {
    socket.emit('chat message', value);
}

export default function Store(props) {

    const [allChats, dispatch] = React.useReducer(reducer, initialState);

    if (!socket) {
        socket = io(':3001');
        socket.on('chat message', function(msg){
            dispatch({type: 'RECEIVE_MESSAGE', payload: msg});
          });
    }

    const user = 'User ' + Math.floor(Math.random() * Math.floor(100));

    return (
        <CTX.Provider value={{allChats, sendChatAction, user}}>
            {props.children}
        </CTX.Provider>
    )
}