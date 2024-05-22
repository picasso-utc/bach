import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export enum typeConnexion {
  PENDING,
  SUCCESSFULL,
  ERROR,
  LOGOUT,
}

// Define a type for the slice state
interface connectionState {
  type: typeConnexion;
  connect: {
    pending?: boolean;
    logged?: null | boolean;
    user: {
      sessionId?: string;
      username?: string;
    };
  };
}

const initialState: connectionState = {
  type: typeConnexion.LOGOUT,
  connect: {
    user: {},
  },
};

export const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    logInPending: (
        state,
        action: PayloadAction<string>
    ) => {
      state.type = typeConnexion.PENDING;
      state.connect = {
        pending: true,
        logged: null,
        user: {
          username: action.payload,
        },
      };
    },
    logInSuccess: (
      state,
      action: PayloadAction<{ sessionId: string; username: string }>,
    ) => {
      state.type = typeConnexion.SUCCESSFULL;
      state.connect = {
        pending: false,
        logged: true,
        user: {
          sessionId: action.payload.sessionId,
          username: action.payload.username,
        },
      };
    },
    logInFailed: (state) => {
      state.type = typeConnexion.ERROR;
      state.connect = {
        pending: false,
        logged: false,
        user: {},
      };
    },
    logOut: (state) => {
      state.type = typeConnexion.LOGOUT;
      state.connect = {
        user: {},
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { logInPending, logInSuccess, logInFailed, logOut } =
  connectionSlice.actions;

export default connectionSlice.reducer;
