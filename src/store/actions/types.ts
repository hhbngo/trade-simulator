import { CreateSimulationAction, ClearCurrentAction } from './simulation';

export enum ActionTypes {
  CREATE_SIMULATION,
  SET_CURRENT,
  CLEAR_CURRENT,
}

export type SimulationActions = CreateSimulationAction | ClearCurrentAction;
