import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";

import styles from "../../styles/components/Vault.module.css";

import { switch_to_bsc } from "../../src/utils/Common";
import ABI from "../../public/abi.json";

const Address = "0xcEE9f25B0443513abCD609B4BD50a4F8315E640b";

const Vault = (props) => {
  const [count, setCount] = useState(0);
  const [type, setType] = useState(0);

  const [claimReturn, setClaimReturn] = useState("");
  const [totalReturn, setTotalReturn] = useState("");

  const settle = async () => {
    if (window.ethereum) {
      let addr = await ethereum.request({ method: "eth_requestAccounts" });
      if (ethereum.networkVersion != "97") {
        await switch_to_bsc();
        return;
      }
      const web3 = new Web3(window.ethereum);
      let myContract = new web3.eth.Contract(ABI, Address);
      await myContract.methods.Settle().send({ from: addr[0], value: 0 });
      await fresh_key_return();
    } else {
      alert("please install MetaMask");
    }
  };

  const claim = async () => {
    if (window.ethereum) {
      let addr = await ethereum.request({ method: "eth_requestAccounts" });
      if (ethereum.networkVersion != "97") {
        await switch_to_bsc();
        return;
      }
      const web3 = new Web3(window.ethereum);
      let myContract = new web3.eth.Contract(ABI, Address);
      await myContract.methods.Claim().send({ from: addr[0], value: 0 });
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
    setClaimReturn(parseInt(user_info.claimed) / 10 ** 18);
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
    setTotalReturn(parseInt(total_return) / 10 ** 18);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container>
        <Typography className={styles.thin}>{"金库"}</Typography>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Grid container className={styles.showInfo}>
          <Grid
            item
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.item}
          >
            锁定部分
          </Grid>
          <Grid
            item
            align="right"
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.text}
          >
            0.0000 BNB
          </Grid>
          <Grid
            item
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.item}
          >
            已提现
          </Grid>
          <Grid
            item
            align="right"
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.text}
          >
            {claimReturn} BNB
          </Grid>
          <Grid
            item
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.item}
          >
            推荐奖励
          </Grid>
          <Grid
            item
            align="right"
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.text}
          >
            0.0000 BNB
          </Grid>
          <Box sx={{ height: "2rem", width: "100%" }}></Box>
          <Grid
            item
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.item}
          >
            暂时总收入
          </Grid>
          <Grid
            item
            align="right"
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={`${styles.text} ${styles.glow}`}
          >
            {totalReturn} BNB
          </Grid>

          <Button className={styles.btn} onClick={settle}>
            确认
          </Button>
          <Button className={styles.btn} onClick={claim}>
            提现
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Vault;
