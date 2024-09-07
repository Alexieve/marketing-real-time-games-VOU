import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OwnedVouchersState {
    ownedVouchers: any[];
}

const initialState: OwnedVouchersState = {
  ownedVouchers: [],
};

const ownedVoucherSlice = createSlice({
  name: "ownedVouchers",
  initialState,
  reducers: {
    setOwned: (state, action: PayloadAction<any[]>) => {
      state.ownedVouchers = action.payload;
    },
  },
});

export const ownedVouchersActions = ownedVoucherSlice.actions;
export default ownedVoucherSlice.reducer;
