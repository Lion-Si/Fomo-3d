import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, Box, Typography, Button } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";

import styles from "../../styles/components/Round.module.css";

import { switch_to_bsc } from "../../src/utils/Common";
import ABI from "../../public/abi.json";

const Address = "0x9B66816Bb69a17aCDeD442522d8495DFf01497C1";
const usFormatterSix = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
});

const Round = (props) => {
  const gameInfo = useSelector((state) => state.gameInfo);
  const userInfo = useSelector((state) => state.userInfo);
  const [count, setCount] = useState(0);
  const [type, setType] = useState(0);

  const buy = async () => {
    if (window.ethereum) {
      let addr = await ethereum.request({ method: "eth_requestAccounts" });
      if (ethereum.networkVersion != "97") {
        await switch_to_bsc();
        return;
      }
      const web3 = new Web3(window.ethereum);
      let myContract = new web3.eth.Contract(ABI, Address);
      await myContract.methods
        .BuyKey(type, count)
        .send({ from: addr[0], value: 2 * 10 ** 15 });
      await fresh_key_return();
    } else {
      alert("please install MetaMask");
    }
  };

  const fresh_key_return = async () => {
    const web3 = new Web3(window.ethereum);
    let myContract = new web3.eth.Contract(ABI, Address);
    let addr = await ethereum.request({ method: "eth_requestAccounts" });
    let game_round = await myContract.methods.GameRound().call();
    let user_info = await myContract.methods.UserInfo(addr[0]).call();
    let yourkey = await myContract.methods.UserKey(game_round, addr[0]).call();
    document.getElementById("key").innerHTML =
      "Your keys: " + parseInt(yourkey);
    document.getElementById("claimed").innerHTML =
      "Claimed return: " + parseInt(user_info.claimed) / 10 ** 18 + "BNB";
    if (user_info.hasInvite == true) {
      document.getElementById("invcode").innerHTML =
        "Your invite code: " + user_info.invite;
    }

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
    document.getElementById("total").innerHTML =
      "Total return: " + parseInt(total_return) / 10 ** 18 + "BNB";
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container>
        <Typography className={styles.thin}>Round #{gameInfo.round}</Typography>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Grid
          item
          sx={{ width: "100%", textAlign: "center", marginBottom: "1rem" }}
        >
          奖池中有这么多BNB，你 还在等什么？
        </Grid>
        <Button
          className={`${styles.btnGold} ${styles.btnSize}`}
          sx={{
            marginBottom: "40px",
          }}
          onClick={buy}
        >
          Round will drain in
          <KeyIcon style={{ transform: "rotate(135deg)" }} />
        </Button>
        <Grid container className={styles.showInfo}>
          <Grid
            item
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.item}
          >
            Active Pot
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6} className={styles.text}>
            <Grid container sx={{ justifyContent: "flex-end" }}>
              <Grid item className={styles.small}>
                <span className={styles.glow}>
                  {usFormatterSix.format(gameInfo.total_pot)}
                </span>
                &nbsp;BNB
              </Grid>
              <Grid item sx={{ fontSize: "1rem" }}>
                ≙ 0.21511 USDT
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.item}
          >
            Your Keys
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6} className={styles.text}>
            <Grid container sx={{ justifyContent: "flex-end" }}>
              <Grid item className={styles.small}>
                <span className={styles.glow}>{userInfo?.key}</span>&nbsp;
                <KeyIcon style={{ transform: "rotate(135deg)",fontSize:"2.25rem" }} />
              </Grid>
              <Grid item sx={{ fontSize: "1rem" }}>
                Total { gameInfo.key } keys
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.item}
          >
            Your Earnings
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={6} className={styles.text}>
            <Grid container sx={{ justifyContent: "flex-end" }}>
              <Grid item className={styles.small}>
                <span className={styles.glow}>{usFormatterSix.format(userInfo?.total_return)}</span>&nbsp;BNB
              </Grid>
              <Grid item sx={{ fontSize: "1rem" }}>
                ≙ USDT
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Round;
