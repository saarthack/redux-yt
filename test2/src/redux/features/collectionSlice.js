import { createSlice } from '@reduxjs/toolkit'


const loadFromLocal = () => {
    try {
        const raw = localStorage.getItem('collection')
        return raw ? JSON.parse(raw) : []
    } catch (e) {
        return []
    }
}
const saveToLocal = (items) => {
    try { localStorage.setItem('collection', JSON.stringify(items)) } catch (e) {
        console.log('nothing');
        
    }
}


const initialState = { items: loadFromLocal() }


const slice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        addItem(state, action) {
            const exists = state.items.find(it => it.id === action.payload.id)
            if (!exists) state.items.push(action.payload)
            saveToLocal(state.items)
        },
        removeItem(state, action) {
            state.items = state.items.filter(it => it.id !== action.payload)
            saveToLocal(state.items)
        },
        clearCollection(state) {
            state.items = []
            saveToLocal(state.items)
        },
    },
})


export const { addItem, removeItem, clearCollection } = slice.actions
export default slice.reducer

