import { Dispatch } from 'redux';
import { ActionTypes } from './types';
import uniqid from 'uniqid';

export interface Config {
  balance: number;
  winRate: number;
  risk: number;
  rrr: number;
  daysLimit: number;
  simulationRounds: number;
  maxDrawdown?: number;
}

export interface Result {
  p: number;
  b: number;
}

export interface CreateSimulationAction {
  type: ActionTypes.CREATE_SIMULATION;
  payload: {
    id: string;
    final: Result;
    ruined: number | null;
    runs: { min: number[]; avg: number[]; max: number[] };
    history: Result[];
    config: Config;
  };
}

export interface SetCurrentAction {
  type: ActionTypes.SET_CURRENT;
  payload: string;
}

export interface ClearCurrentAction {
  type: ActionTypes.CLEAR_CURRENT;
  payload: Config;
}

export const runSimulations = (config: Config) => {
  return (dispatch: Dispatch) => {
    const { winRate, rrr, simulationRounds, daysLimit, maxDrawdown } = config;
    const risk = config.risk / 100;
    const { balance: initialBalance } = config;
    const maxLoss = maxDrawdown ? -(initialBalance * maxDrawdown) / 100 : null;
    let simulations: Result[] = [];
    let minRun: { v: number; history: number[] } = { v: 0, history: [] };
    let avgRun: { v: number; history: number[] } = { v: 0, history: [] };
    let maxRun: { v: number; history: number[] } = { v: 0, history: [] };

    let profitSums = 0;
    let ruinedSum = 0;

    for (let i = 0; i < simulationRounds; ++i) {
      let balance = initialBalance;
      let runHistory = [];
      let isRuined = false;
      for (let j = 0; j < daysLimit; ++j) {
        const r = balance * risk;
        const profit = Math.random() * 100 <= winRate ? r * rrr : -r;
        const roundedProfit = Math.round(profit);
        balance = Math.round(balance + roundedProfit);
        const currentProfit = balance - initialBalance;
        runHistory.push(balance);
        if (maxLoss && !isRuined && currentProfit <= maxLoss) isRuined = true;
      }
      const totalProfit = Math.round(balance - initialBalance);
      isRuined && ruinedSum++;
      profitSums += totalProfit;
      if (i === 0) {
        minRun.v = totalProfit;
        minRun.history = runHistory;
        maxRun.v = totalProfit;
        maxRun.history = runHistory;
        avgRun.v = totalProfit;
        avgRun.history = runHistory;
      } else if (totalProfit < minRun.v) {
        minRun.v = totalProfit;
        minRun.history = runHistory;
      } else if (totalProfit > maxRun.v) {
        maxRun.v = totalProfit;
        maxRun.history = runHistory;
      } else {
        const meanProfit = profitSums / (i + 1);
        const isCloserToAvg =
          Math.abs(meanProfit - totalProfit) < Math.abs(meanProfit - avgRun.v);
        if (isCloserToAvg) {
          avgRun.v = totalProfit;
          avgRun.history = runHistory;
        }
      }

      simulations.push({ p: totalProfit, b: balance });
    }

    const p = {
      id: uniqid(),
      final: {
        p: Math.round(profitSums / simulationRounds),
        b: 0,
      },
      ruined: maxDrawdown ? ruinedSum / simulationRounds : null,
      runs: {
        min: minRun.history,
        avg: avgRun.history,
        max: maxRun.history,
      },
      history: simulations,
      config,
    };

    dispatch<CreateSimulationAction>({
      type: ActionTypes.CREATE_SIMULATION,
      payload: p,
    });
  };
};

export const setCurrent = (id: string): SetCurrentAction => {
  return {
    type: ActionTypes.SET_CURRENT,
    payload: id,
  };
};

export const clearCurrent = (config: Config): ClearCurrentAction => ({
  type: ActionTypes.CLEAR_CURRENT,
  payload: config,
});

export const deleteAllHistoric = () => {};
