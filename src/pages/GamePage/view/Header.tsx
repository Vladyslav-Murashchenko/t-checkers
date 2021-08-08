import { FC } from "react";
import { Side, Status } from "../model";

import styles from "./Header.module.css";

type HeaderProps = {
  status: Status;
  turn: Side;
};

const Header: FC<HeaderProps> = ({ turn, status }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.heading}>{deriveMessage(status, turn)}</h1>
      <button className={styles.button} type="button" onClick={() => {}}>
        restart
      </button>
    </header>
  );
};

export default Header;

function deriveMessage(status: Status, side: Side) {
  if (status === Status.finished) {
    return `game finished, ${side} won!`;
  }

  return `${side} turn to move!`;
}
