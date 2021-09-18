import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classes from './InputPage.module.css';
import { runSimulations } from '../../store/actions';
import { useHistory } from 'react-router-dom';
import { StoreState } from '../../store/reducers';

const INITIAL_FORM = {
  balance: '',
  risk: '',
  rrr: '',
  winRate: '',
  maxDrawdown: '',
  daysLimit: 50,
  simulationRounds: 50,
};

const InputPage: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { config } = useSelector((state: StoreState) => state.simulation);
  const [formValues, setFormValues] = useState<any>(
    config
      ? { ...config, maxDrawdown: config.maxDrawdown ? config.maxDrawdown : '' }
      : INITIAL_FORM
  );
  const {
    balance,
    risk,
    rrr,
    winRate,
    maxDrawdown,
    daysLimit,
    simulationRounds,
  } = formValues;

  const handleFormValChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues({ ...formValues, [e.target.name]: parseInt(e.target.value) });
  };

  const checkForm = () => {
    const { daysLimit, simulationRounds, maxDrawdown, ...rest } = formValues;

    const parsedValues: any = {};

    for (let key in rest) {
      parsedValues[key] = parseFloat(rest[key]);
    }

    const isValid = Object.keys(rest).every((o) => Boolean(parsedValues[o]));

    parsedValues.maxDrawdown = Boolean(parseFloat(maxDrawdown))
      ? parseFloat(maxDrawdown)
      : null;

    return {
      parsedValues,
      isValid,
    };
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { parsedValues, isValid } = checkForm();
    if (!isValid) return;
    dispatch(runSimulations({ ...parsedValues, daysLimit, simulationRounds }));
    history.push('/results');
  };

  return (
    <main className={classes.bg}>
      <form className={classes.container} onSubmit={handleFormSubmit}>
        <div className={classes.area}>
          <label>Balance</label>
          <input
            type="number"
            name="balance"
            value={balance}
            onChange={handleFormValChange}
          />
        </div>
        <div className={classes.area}>
          <label>Risk (%)</label>
          <input
            type="number"
            name="risk"
            value={risk}
            onChange={handleFormValChange}
          />
        </div>
        <div className={classes.area}>
          <label>RRR</label>
          <input
            type="number"
            name="rrr"
            value={rrr}
            onChange={handleFormValChange}
          />
        </div>
        <div className={classes.area}>
          <label>Win rate (%)</label>
          <input
            type="number"
            name="winRate"
            value={winRate}
            onChange={handleFormValChange}
          />
        </div>
        <div className={classes.area}>
          <label>Max DD %</label>
          <input
            type="number"
            placeholder="optional*"
            name="maxDrawdown"
            value={maxDrawdown}
            onChange={handleFormValChange}
          />
        </div>
        <div style={{ display: 'flex' }}>
          <div className={classes.area}>
            <label>Trades</label>
            <select
              onChange={handleSelectChange}
              value={daysLimit}
              name="daysLimit"
            >
              {[10, 20, 50, 100, 200].map((o) => (
                <option value={o} key={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className={classes.area}>
            <label>Simulations</label>
            <select
              onChange={handleSelectChange}
              value={simulationRounds}
              name="simulationRounds"
            >
              {[10, 20, 50, 100, 1000].map((o) => (
                <option value={o} key={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className={classes.submit_btn} type="submit">
          Simulate
        </button>
      </form>
    </main>
  );
};

export default InputPage;
