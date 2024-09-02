import { createAsyncThunk } from "@reduxjs/toolkit";
import { shakeActions } from "../slices/shakeSlice"; // Import the actions from your slice
import { request } from "../utils/request";

export const fetchItems = createAsyncThunk(
  "shake/fetchItems",
  async ({ eventID }: { eventID: string }, { dispatch }) => {
    try {
      const res = await request(`/api/game/game-item/${eventID}`, "get");
      dispatch(shakeActions.setItems(res)); // Dispatch an action to set the items
    } catch (error: any) {
      console.error("Error fetching Items: ", error);
    }
  }
);

export const fetchOwnItems = createAsyncThunk(
  'shake/fetchOwnItems',
  async ({ customerID, eventID }: { customerID: any; eventID: string }, { dispatch }) => {
    try {
      const res = await request(
        `/api/game/customer-item/?customerID=${customerID}&eventID=${eventID}`, 
        'get'
      );
      dispatch(shakeActions.setOwnItems(res)); // Dispatch an action to set the point
    } catch (error: any) {
      console.error("Error fetching Own Items: ", error);
    }
  }
);

export const fetchPlayLog = createAsyncThunk(
    'shake/fetchPlayLog',
    async ({ customerID, eventID }: { customerID: any; eventID: string }, { dispatch }) => {
      try {
        const res = await request(
          `/api/game/play-log/${eventID}/${customerID}`, 
          'get'
        );
        return res;
      } catch (error: any) {
        console.error("Error fetching Playlog: ", error);
      }
    }
);


interface Item {
  itemID: number;
  quantity: number;
}
export const AddItems = createAsyncThunk(
  'shake/AddItems',
  async ({ customerID, eventID, items }: { customerID: any; eventID: string, items: Item[] }, { dispatch }) => {
    try {
      await request(
        `/api/game/customer-item`, 
        'post',
        { customerID, eventID, items }
      );
    } catch (error: any) {
      console.error("Error adding Items: ", error);
    }
  }
);

export const fetchExchangeLog = createAsyncThunk(
  'shake/fetchExchangeLog',
  async ({ customerID, eventID }: { customerID: any; eventID: string }, { dispatch }) => {
    try {
      const res = await request(
        `/api/game/exchange-log/${customerID}/${eventID}`, 
        'get'
      );
      return res;
    } catch (error: any) {
      console.error("Error fetching Exchange Log: ", error);
    }
  }
);

export const fetchPlayTurn = createAsyncThunk(
  'shake/fetchPlayTurn',
  async ({ customerID, eventID }: { customerID: any; eventID: string }, { dispatch }) => {
    try {
      const res = await request(
        `/api/game/check-play-turn/${eventID}/${customerID}`, 
        'get'
      );
      return res;
    } catch (error: any) {
      console.error("Error fetching Play Turn: ", error);
    }
  }
);

export const addPlayLog = createAsyncThunk(
  'shake/addPlayLog',
  async ({ customerID, eventID }: { customerID: any; eventID: string }, { dispatch }) => {
    try {
      await request(
        `/api/game/play-log`, 
        'post',
        { customerID, eventID }
      );
    } catch (error: any) {
      console.error("Error adding Play Log: ", error);
    }
  }
);

export const giftPlayTurn = createAsyncThunk(
  'shake/giftPlayTurn',
  async ({ customerID, eventID, phonenum }: { customerID: any; eventID: string, phonenum: string }, { dispatch }) => {
    try {
      await request(
        `/api/game/add-play-turn/${eventID}/${customerID}/${phonenum}`, 
        'put'
      );
    } catch (error: any) {
      console.error("Error adding Play Log: ", error);
      return error;
    }
  }
);