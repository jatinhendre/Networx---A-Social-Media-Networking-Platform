import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getAboutUser,
  getAllUsers,
  getConnectionRequests,
  getMyConnections,
  acceptConnectionRequest,
} from "@/config/redux/action/AuthAction";

const initialState = {
  isLoading: false,
  loggedIn: false,
  message: "",
  token:null,
  isError: false,
  isSuccess: false,
  profileFetched: false,
  user: null,
  isTokenThere: false,
  connections: [],
  connectionRequests: [],
  allUsers: [],
  all_profile_fetched: false,
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
      state.token=  localStorage.getItem("token");
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

      // GET USER PROFILE
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

      // GET ALL USERS
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.all_profile_fetched = true;
      })

      // GET CONNECTION REQUESTS
      .addCase(getConnectionRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConnectionRequests.fulfilled, (state, action) => {
        state.connectionRequests = action.payload;
        state.isLoading = false;
      })
      .addCase(getConnectionRequests.rejected, (state, action) => {
        state.connectionRequests = [];
        state.isLoading = false;
      })

      // GET MY CONNECTIONS
      .addCase(getMyConnections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
        state.isLoading = false;
      })
      .addCase(getMyConnections.rejected, (state, action) => {
        state.connections = [];
        state.isLoading = false;
      })

      // ACCEPT/REJECT CONNECTION REQUEST
      .addCase(acceptConnectionRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message || "Request processed successfully";
        state.isSuccess = true;
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.message =
          (typeof payload === "string"
            ? payload
            : payload?.message) || "Failed to process request";
        state.isError = true;
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