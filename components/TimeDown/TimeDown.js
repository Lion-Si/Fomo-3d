import { Fragment, useEffect, useState } from "react";
import countdown from "countdown";
import styles from "../../styles/components/TimeDown.module.css";

const TimeDown = () => {
  const init = () => {
    let twoDaysFromNow = new Date().getTime() / 1000 + 86400 * 2 + 1;
    console.log(countdown(new Date(2000, 0, 1)).toString());
    var timerId = countdown(new Date(), function (ts) {
      document.getElementById("pageTimer").innerHTML = ts.toHTML("strong");
    });

    // later on this timer may be stopped
    window.clearInterval(timerId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.example}>
        <div id="pageTimer" className={styles.flipdown} onClick={init}></div>
      </div>
    </div>
  );
};

export default TimeDown;
