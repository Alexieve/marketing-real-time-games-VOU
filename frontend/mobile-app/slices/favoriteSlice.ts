import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoriteState {
  favorite: any[];
}

const initialState: FavoriteState = {
  favorite: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    setFavorite: (state, action: PayloadAction<any[]>) => {
      state.favorite = action.payload;
    },
  },
});

export const favoriteActions = favoriteSlice.actions;
export default favoriteSlice.reducer;
