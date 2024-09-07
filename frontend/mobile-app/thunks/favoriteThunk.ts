import { createAsyncThunk } from "@reduxjs/toolkit";
import { favoriteActions } from "../slices/favoriteSlice"; // Import the actions from your slice
import { request } from "../utils/request";
import localhost from "../url.config";

export const fetchFavorites = createAsyncThunk(
  'favorite/fetchFavorites',
  async ({ id }: { id: any }, { dispatch }) => {
    try {
      let res = await request(
        `/api/event_query/get_events_user_favorite/${id}`,
        'get'
      );
      // console.log("Thunk: ", res);
      if (res.length === undefined) {
        dispatch(favoriteActions.setFavorite([]))
        return;
      }
      res = res.map((event: any) => {
        event.imageUrl = `${localhost}${event.imageUrl}`;
        return event;
      });
      dispatch(favoriteActions.setFavorite(res)); // Dispatch an action to set the point
    } catch (error: any) {
      console.error("Error fetching Favorites: ", error);
    }
  }
);