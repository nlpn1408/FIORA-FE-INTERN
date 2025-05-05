import landingSlices from '@/features/landing/slices';
import landingSettingSlice from '@/features/setting/module/landing/landing/slices';
import { combineReducers } from '@reduxjs/toolkit';
import dialogSlices from './slices/dialog.slice';
import moduleReducer from './slices/moduleSlice';
import settingSlices from './slices/setting.slice';

const reducer = {
  settings: settingSlices,
  dialog: dialogSlices,
  landing: landingSlices,
  landingSettings: landingSettingSlice,
  module: moduleReducer,
};

const rootReducer = combineReducers(reducer);

export default rootReducer;
