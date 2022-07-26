/*eslint-disable*/
import React from "react";
import { useSelector, useDispatch } from "react-redux";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components

// @material-ui/icons
import styles from "../../styles/components/Footer.module.css";

const Footer = (props) => {
  // 通信必备
  const dispatch = useDispatch();

  const handleChangeImg = () => {
    console.log("Change");
    dispatch({
      type: "SET_SCAMMING_STATUS",
      data: true,
    });
    setTimeout(() => {
      dispatch({
        type: "SET_SCAMMING_STATUS",
        data: false,
      });
    }, 5000);
  };

  return (
    <footer>
      <div
        className={styles.container}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          backgroundColor: "#343a40",
        }}
      >
        <div>
          <div className={styles.copyright}>
            JUST for helping those who want to exit crypto{" "}
            <a onClick={handleChangeImg}>scamming</a> &copy;{" "}
            {/* {2021}-{1900 + new Date().getYear()} N. All rights reserved{" "} */}
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  whiteFont: PropTypes.bool,
};

export default Footer;
