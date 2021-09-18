import { combineReducers } from 'redux';
import simulationReducer, { SimulationState } from './simulation';

export interface StoreState {
  simulation: SimulationState;
}

export default combineReducers<StoreState>({
  simulation: simulationReducer,
});
