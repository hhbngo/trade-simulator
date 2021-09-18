import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState } from '../../store/reducers';
import { runSimulations, clearCurrent } from '../../store/actions';
import classes from './Results.module.css';
import ResultCard from '../../components/ResultCard/ResultCard';
import Chart from '../../components/Chart/Chart';
import { useHistory } from 'react-router-dom';
import { parseDataForChart } from '../../util/chart';
import { ReactComponent as RepeatArrow } from '../../assets/arrow-repeat.svg';

const Results: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { current } = useSelector((state: StoreState) => state.simulation);

  const graph = useMemo(() => {
    if (!current) return null;
    const data = parseDataForChart(current.runs);
    return (
      <Chart
        data={data}
        DD={
          current.config.maxDrawdown &&
          ((100 - current.config.maxDrawdown) * current.config.balance) / 100
        }
      />
    );
  }, [current]);

  const getPercentProfit = () => {
    return current ? (current.final.p / current.config.balance) * 100 : 0;
  };

  const handleBack = () => {
    if (current) {
      dispatch(clearCurrent(current.config));
      history.push('/');
    }
  };

  const handleRerun = () => {
    current && dispatch(runSimulations(current.config));
  };

  useEffect(() => {
    if (!current) history.push('/');
    window.scrollTo(0, 0);
  }, [current]);

  return current ? (
    <main className={classes.bg}>
      <div className={classes.input_area}></div>
      <div className={classes.container}>
        <div className={classes.viewLeft}>
          <button className={classes.back_btn} onClick={handleBack}>
            « Go back
          </button>
          <button className={classes.reload_btn} onClick={handleRerun}>
            Rerun Simulations <RepeatArrow style={{ marginLeft: 8 }} />
          </button>
          {graph}
          <p style={{ marginTop: 0, marginLeft: 45, color: 'rgb(82, 82, 82)' }}>
            Trade #
          </p>
          <div className={classes.info}>
            <div className={classes.block}>
              <h3>Initial balance</h3>
              <p>{current.config.balance.toLocaleString()}</p>
            </div>
            <div className={classes.block}>
              <h3>Trades/sim.</h3>
              <p>{current.config.daysLimit}</p>
            </div>
            <div className={classes.block}>
              <h3>Win rate %</h3>
              <p>{current.config.winRate}%</p>
            </div>
            <div className={classes.block}>
              <h3>RRR</h3>
              <p>
                1:{current.config.rrr} (risking {current.config.risk}%)
              </p>
            </div>
          </div>
          <div className={classes.info}>
            <div className={classes.block}>
              <h3># of Simulations</h3>
              <p>{current.config.simulationRounds}</p>
            </div>
            <div className={classes.block}>
              <h3>Avg. Profit</h3>
              <p>
                {current.final.p.toLocaleString()} (
                <span
                  className={current.final.p > 0 ? classes.win : classes.loss}
                >
                  {getPercentProfit().toFixed(2)}%
                </span>
                )
              </p>
            </div>
            <div className={classes.block}>
              <h3>Avg. return / trade</h3>
              <p>
                {(getPercentProfit() / current.config.daysLimit).toFixed(2)}%
              </p>
            </div>
          </div>
          {current.config.maxDrawdown && (
            <div className={classes.info} style={{ maxWidth: '500px' }}>
              <div className={classes.block}>
                <h3>Max DD %</h3>
                <p>{current.config.maxDrawdown}%</p>
              </div>
              <div className={classes.block}>
                <h3>Risk of ruin</h3>
                {current.ruined ? (
                  <p>{(current.ruined * 100).toFixed(1)}%</p>
                ) : (
                  <p>0%</p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={classes.viewRight}>
          <>
            <div className={classes.label}>
              <p style={{ flex: 2 }}>Sim.</p>
              <p style={{ flex: 2 }}>Profit</p>
              <p style={{ flex: 1, paddingRight: 5 }}>Growth(%)</p>
            </div>
            <div className={classes.results}>
              {current.history.map((r, i) => (
                <ResultCard
                  key={i}
                  index={i}
                  p={r.p}
                  b={((r.b / current.config.balance) * 100).toFixed(2)}
                />
              ))}
            </div>
          </>
        </div>
      </div>
    </main>
  ) : null;
};

export default Results;

// {!current && (
//   <form className={classes.form}>
//     <div>
//       <label>Balance</label>
//       <input name="balance" type="number" />
//     </div>
//     <div>
//       <label>Risk (%)</label>
//       <input type="number" />
//     </div>
//     <div>
//       <label>Reward:Risk</label>
//       <input type="number" />
//     </div>
//     <div>
//       <label>Win rate (%)</label>
//       <input type="number" />
//     </div>
//     <button type="submit">Simulate</button>
//   </form>
// )}
