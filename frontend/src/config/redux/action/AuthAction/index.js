import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";



export const loginUser = createAsyncThunk(
    "user/login",
    async (userAgent, thunkAPI) => {
        try {
            const response = await clientServer.post("/login", {
                email:userAgent.email,
                password:userAgent.password
            });
            if(response.data.token){
                localStorage.setItem("token", response.data.token);
            }else{
                return thunkAPI.rejectWithValue("Login failed");
            }
            return thunkAPI.fulfillWithValue(response.data.token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (userAgent, thunkAPI) => {
        try{
            const response  =await clientServer.post("/register",{
                email:userAgent.email,
                password:userAgent.password,
                username:userAgent.username,
                name:userAgent.name
            });
            // if(response.data.token){
            //     localStorage.setItem("token", response.data.token);
            // }else{
            //     return thunkAPI.rejectWithValue("Registration failed");
            // }
            // return thunkAPI.fulfillWithValue(response.data.token);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/about",
    async (user, thunkAPI) => {
        try{
            console.log(user)
            const response = await clientServer.get("/get_user_profile",{
                params:{
                    token:user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkAPI) => {
        try{
            const response  =await clientServer.get("/user/getAllProfiles");
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);
// ... other imports and actions ...

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/sendConnectionRequest", {
        token: user.token,
        connectionId: user.connectionId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getConnectionRequests = createAsyncThunk(
  "user/getConnectionRequests",
  async (user, thunkAPI) => {
    try {
      // Fixed: Using correct endpoint from backend
      const response = await clientServer.get("/user/myConnectionRequest", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getMyConnections = createAsyncThunk(
  "user/getMyConnections",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get("/user/getMyConnections", {
        params: {
          token: user.token,
        },
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  "user/acceptConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/user/acceptConnectionRequest", {
        token: user.token,
        requestId: user.requestId,
        action_type: user.action_type,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);