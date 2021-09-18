import React from 'react';
import classes from './ResultCard.module.css';

interface Props {
  index: number;
  p: number;
  b: string;
}

const ResultCard: React.FC<Props> = ({ index, p, b }) => {
  return (
    <div className={classes.container}>
      <div className={classes.idx}>{index + 1}</div>
      <div className={p >= 0 ? classes.win : classes.loss}>
        {p.toLocaleString()}
      </div>
      <div className={classes.balance}>{b}%</div>
    </div>
  );
};

export default ResultCard;
