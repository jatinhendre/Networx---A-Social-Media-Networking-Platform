import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getAboutUser,
  getAllUsers,
  getConnectionRequests,
  getMyConnections,
} from "@/config/redux/action/AuthAction";

const initialState = {
  isLoading: false,
  loggedIn: false,
  message: "",
  isError: false,
  isSuccess: false,
  profileFetched: false,
  user: null,
  isTokenThere: false,
  connections: [],
  connectionRequests: [],
  allUsers:[],
  all_profile_fetched:false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => ({ ...initialState }),

    handleLoginUser: (state) => {
      state.message = "hello";
    },

    emptyMessage: (state) => {
      state.message = "";
    },

    setIsTokenThere: (state) => {
      state.isTokenThere = true;
    },

    setIsTokenNotThere: (state) => {
      state.isTokenThere = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Wait while we log you in......";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.loggedIn = true;
        state.message = "Login Successful";
        state.isSuccess = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loggedIn = false;

        const payload = action.payload;
        state.message =
          (typeof payload === "string"
            ? payload
            : payload?.message) || "Login Failed";

        state.isError = true;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering User......";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.message = "Registration Successful";
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loggedIn = false;

        const payload = action.payload;
        state.message =
          (typeof payload === "string"
            ? payload
            : payload?.message) || "Registration Failed";

        state.isError = true;
      })
      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching User Profile......";
        state.profileFetched = false;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.user = action.payload.userId;
        state.profileFetched = true;
        state.isLoading = false;
      })
      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.profileFetched = false;

        const payload = action.payload;
        state.message =
          (typeof payload === "string"
            ? payload
            : payload?.message) ||
          "Fetching User Profile Failed";

        state.isError = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.all_profile_fetched = true;
      })
      .addCase(getConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequests = action.payload;
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(getMyConnections.rejected, (state, action) => {
        state.connections = [];
      }) 
      .addCase(getConnectionRequests.rejected, (state, action) => {
        state.connectionRequests = [];
      });
  },
});

export const {
  reset,
  handleLoginUser,
  emptyMessage,
  setIsTokenThere,
  setIsTokenNotThere,
} = authSlice.actions;

export default authSlice.reducer;
