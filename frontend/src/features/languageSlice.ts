import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../../store'

// Define a type for the slice state
export interface LanguageState {
  language: string
  language_id:string
}

// Define the initial state using that type
const initialState: LanguageState = {
  language: "",
  language_id:""
}

export const languageSlice = createSlice({
  name: 'language',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<{ language: string; language_id: string }>) => {
      state.language = action.payload.language;
      state.language_id = action.payload.language_id
    }

  }
})

export const { setLanguage } = languageSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default languageSlice.reducer