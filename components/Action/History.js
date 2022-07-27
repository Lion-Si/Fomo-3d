import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Box, Typography, Button } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";

import styles from "../../styles/components/Round.module.css";

import { switch_to_bsc } from "../../src/utils/Common";
import ABI from "../../public/abi.json";

const Address = "0x9B66816Bb69a17aCDeD442522d8495DFf01497C1";
const Url = "https://data-seed-prebsc-1-s1.binance.org:8545";
const usFormatterSix = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
});

const History = (props) => {
  const gameInfo = useSelector((state) => state.gameInfo);
  const userInfo = useSelector((state) => state.userInfo);
  const [winHistory, setWinHistory] = useState([]);
  const [count, setCount] = useState(1);
  const [type, setType] = useState(1);

  useEffect(() => {
    getWinHistory();
  }, []);

  const getWinHistory = async () => {
    let winHistoryList = [];
    const web3 = new Web3(new Web3.providers.HttpProvider(Url))
    let myContract = new web3.eth.Contract(ABI, Address);
    let game_round = await myContract.methods.GameRound().call();
    for (let i = 1; i < parseInt(game_round) + 1; i++) {
      winHistoryList.push({
        round: i,
        ...(await myContract.methods.RoundInfo(i).call()),
      });
    }
    setWinHistory(winHistoryList);
    return () => setWinHistory([]);
  };

  const fresh_key_return = async () => {
    const web3 = new Web3(window.ethereum);
    let myContract = new web3.eth.Contract(ABI, Address);
    let addr = await ethereum.request({ method: "eth_requestAccounts" });
    let game_round = await myContract.methods.GameRound().call();
    let user_info = await myContract.methods.UserInfo(addr[0]).call();
    let yourkey = await myContract.methods.UserKey(game_round, addr[0]).call();
    var total_return = user_info.total;
    if (user_info.setRnd != game_round) {
      for (var i = user_info.setRnd; i <= game_round; i++) {
        let round_info = await myContract.methods.RoundInfo(i).call();
        if (round_info.keys == 0) {
          continue;
        }
        let keys_ = await myContract.methods.UserKey(i, addr[0]).call();
        total_return += (round_info.bnb * keys_) / round_info.keys;
      }
    }
    dispatch({
      type: "SET_USER_INFO",
      data: {
        ...userInfo,
        referral_return: parseInt(user_info.invIncome) / 10 ** 18,
        claimed_return: parseInt(user_info.claimed) / 10 ** 18,
        total_return: parseInt(total_return) / 10 ** 18,
        key: parseInt(yourkey),
      },
    });
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container>
        <Typography className={styles.thin}>History Winner</Typography>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Button
          className={`${styles.btnGold} ${styles.btnSize}`}
          sx={{
            marginBottom: "40px",
            fontFamily: "Comic Sans MS",
          }}
          onClick={getWinHistory}
        >
          Research Winner History
          <KeyIcon style={{ transform: "rotate(135deg)" }} />
        </Button>
        <Grid container className={styles.showInfo}>
          {winHistory.map((item) => {
            return (
              <Fragment>
                <p>
                  Round #{item.round}{" "}
                  {item.plyr?.slice(0, 7) +
                    "...." +
                    item.plyr?.substring(item.plyr?.length - 5)}{" "}
                  exit scamming with {parseInt(item.pot) / 10 ** 18} BNB
                </p>
              </Fragment>
            );
          })}
        </Grid>
      </Grid>
    </Box>
  );
};

export default History;
