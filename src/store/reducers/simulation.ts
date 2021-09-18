import { Result, Config, SimulationActions, ActionTypes } from '../actions';

interface Stub {
  id: string;
  final: Result;
  ruined: number | null;
  runs: { min: number[]; avg: number[]; max: number[] };
  history: Result[];
  config: Config;
}

export interface SimulationState {
  current: Stub | null;
  config: Config | null;
}

let INITIAL_STATE = {
  current: null,
  config: null,
};

export default function reducer(
  state: SimulationState = INITIAL_STATE,
  action: SimulationActions
) {
  switch (action.type) {
    case ActionTypes.CREATE_SIMULATION:
      return {
        ...state,
        current: action.payload,
      };
    case ActionTypes.CLEAR_CURRENT:
      return { ...state, current: null, config: action.payload };
    default:
      return state;
  }
}
