import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface webSocketState {
    connected: boolean;
    cardReader: boolean;
    reconnectAttempts: number
}

const initialState: webSocketState = {
    connected: false,
    cardReader: false,
    reconnectAttempts: 20
};

export const webSocketSlice = createSlice({
    name: "webSocket",
    initialState,
    reducers: {
        changeConnectedState: (
            state,
            action: PayloadAction<boolean>,
        ) => {
            state.connected=action.payload
        },
        changeCardReaderState: (
            state,
            action: PayloadAction<boolean>,
        ) => {
            state.cardReader=action.payload
        },
        addReconnectAttempts:(
            state,
        )=> {
            state.reconnectAttempts += 20
        }
    },
});

// Action creators are generated for each case reducer function
export const { changeConnectedState,changeCardReaderState, addReconnectAttempts} =
    webSocketSlice.actions;

export default webSocketSlice.reducer;
