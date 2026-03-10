import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

const getAuthHeader = (getState) => {
  const { auth } = getState();
  const token = auth.userInfo?.access;
  return { Authorization: `Bearer ${token}` };
};

export const fetchConversations = createAsyncThunk(
  "conversations/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/conversations/`, {
        headers: getAuthHeader(getState),
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to load conversations.",
      );
    }
  },
);

export const fetchConversationDetail = createAsyncThunk(
  "conversations/fetchDetail",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/conversations/${id}/`, {
        headers: getAuthHeader(getState),
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to load conversation.",
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "conversations/sendMessage",
  async ({ message, conversationId }, { getState, rejectWithValue }) => {
    try {
      const body = { message };
      if (conversationId) body.conversation_id = conversationId;
      const { data } = await axios.post(`${BASE_URL}/conversation/`, body, {
        headers: getAuthHeader(getState),
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to send message.",
      );
    }
  },
);

const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    list: [],
    activeConversation: null,
    messages: [],
    loading: false,
    sendingMessage: false,
    error: null,
  },
  reducers: {
    clearActiveConversation(state) {
      state.activeConversation = null;
      state.messages = [];
    },
    clearConversationError(state) {
      state.error = null;
    },
    addOptimisticMessage(state, action) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchConversationDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.messages = [];
      })
      .addCase(fetchConversationDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.activeConversation = action.payload;
        state.messages = action.payload.messages || [];
      })
      .addCase(fetchConversationDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessage.pending, (state) => {
        state.sendingMessage = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendingMessage = false;
        const { reply, conversation_id, is_new_conversation } = action.payload;
        state.messages = state.messages.filter(
          (m) => m.role !== "__thinking__",
        );
        state.messages.push({
          role: "assistant",
          content: reply,
          id: Date.now(),
        });
        if (is_new_conversation) {
          state.activeConversation = { _id: conversation_id };
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendingMessage = false;
        state.messages = state.messages.filter(
          (m) => m.role !== "__thinking__",
        );
        state.error = action.payload;
      });
  },
});

export const {
  clearActiveConversation,
  clearConversationError,
  addOptimisticMessage,
} = conversationSlice.actions;
export default conversationSlice.reducer;
