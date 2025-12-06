
import type { User } from "@/types/User";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
   user: User | null;
   loading: boolean;
   error: string | null;
}

const initialState: UserState = {
   user: JSON.parse(localStorage.getItem('user') || 'null'),
   loading: false,
   error: null,
};

const UserSlice = createSlice({
   name: "account",
   initialState,
   reducers: {
      setUser: (state, action: PayloadAction<User>) => {
         state.user = action.payload;
         localStorage.setItem('user', JSON.stringify(action.payload));
      },
      logout: (state) => {
         state.user = null;
         localStorage.removeItem('user');
         state.error = null;
      },
   },
});

export const { setUser, logout } = UserSlice.actions;
export default UserSlice.reducer;