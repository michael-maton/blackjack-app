import { ButtonType } from '../types';
import classes from '../styles/Button.module.css';
export const Button = ({ title, action }: ButtonType) => {
  return (
    <div className={classes['button-div']}>
      <button onClick={action}>{title}</button>
    </div>
  );
};
