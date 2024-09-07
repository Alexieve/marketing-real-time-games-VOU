import { createAsyncThunk } from "@reduxjs/toolkit";
import setOwned from "../slices/ownedVoucherSlice";
import { ownedVouchersActions } from "../slices/ownedVoucherSlice";
import { request } from "../utils/request";
import localhost from "../url.config";

export const fetchOwnVouchers = createAsyncThunk(
  'ownVouchers/fetchOwnVouchers',
  async ({ id }: { id: any }, { dispatch }) => {
    try {
      let res = await request(
        `/api/event_query/get_user_vouchers/${id}`, 
        'get'
      );
      if (res.length === 0) {
        dispatch(ownedVouchersActions.setOwned([]))
        return;
      }
      dispatch(ownedVouchersActions.setOwned(res)); // Dispatch an action to set the point
    } catch (error: any) {
      console.error("Error fetching Owned Vouchers: ", error);
    }
  }
);