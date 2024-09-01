import { createAsyncThunk } from "@reduxjs/toolkit";
import { quizActions } from "../slices/quizSlice"; // Import the actions from your slice
import { request } from "../utils/request";

export const fetchPoints = createAsyncThunk(
  'quiz/fetchPoints',
  async ({ customerID, eventID }: { customerID: any; eventID: string }, { dispatch }) => {
    try {
      const res = await request(
        `/api/game/customer-item/?customerID=${customerID}&eventID=${eventID}`, 
        'get'
      );
      dispatch(quizActions.setPoint(res[0].quantity)); // Dispatch an action to set the point
    } catch (error: any) {
      console.error("Error fetching Points: ", error);
    }
  }
);

export const fetchPlayLog = createAsyncThunk(
    'quiz/fetchPlayLog',
    async ({ customerID, eventID }: { customerID: any; eventID: string }, { dispatch }) => {
      try {
        const res = await request(
          `/api/game/play-log/${eventID}/${customerID}`, 
          'get'
        );
        return res;
      } catch (error: any) {
        console.error("Error fetching Points: ", error);
      }
    }
);


interface Item {
  itemID: number;
  quantity: number;
}
export const AddPointsDB = createAsyncThunk(
  'quiz/AddPointsDB',
  async ({ customerID, eventID, items }: { customerID: any; eventID: string, items: Item[] }, { dispatch }) => {
    try {
      await request(
        `/api/game/customer-item`, 
        'post',
        { customerID, eventID, items }
      );
    } catch (error: any) {
      console.error("Error adding Points: ", error);
    }
  }
);

export const fetchExchangeLog = createAsyncThunk(
  'quiz/fetchExchangeLog',
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
  'quiz/fetchPlayTurn',
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
  'quiz/addPlayLog',
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