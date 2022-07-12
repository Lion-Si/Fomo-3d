import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import Fetch from "../../src/utils/Fetch";

import styles from "../../styles/components/Vault.module.css";

import { switch_to_bsc } from "../../src/utils/Common";
import ABI from "../../public/abi.json";

const Address = "0x9B66816Bb69a17aCDeD442522d8495DFf01497C1";
const usFormatterSix = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
});
const Vault = (props) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const isConnect = useSelector((state) => state.isConnect);
  const user_address = useSelector((state) => state.user_address);
  const invite_code = useSelector((state) => state.invite_code);

  const [count, setCount] = useState(0);
  const [type, setType] = useState(0);

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
    let yourkey = await myContract.methods.UserKey(game_round, addr[0]).call();
    if (user_info.hasInvite == true) {
      dispatch({
        type: "SET_INVITE_CODE",
        data: user_info.invite,
      });
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
    dispatch({
      type: "SET_USER_INFO",
      data: {
        ...userInfo,
        claimed_return: parseInt(user_info.claimed) / 10 ** 18,
        total_return: parseInt(total_return) / 10 ** 18,
        key: parseInt(yourkey),
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getBnbPrice();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBnbPrice = () => {
    // Fetch(`/api/v3/ticker/price?symbol=BNBUSDT`, {
    //   method: "GET",
    // })
    //   .then((res) => {
    //     console.log(res);
    //     setBnbPrice(res?.price);
    //   })
    //   .catch((error) => {});
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
            Unclaimed
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
            {userInfo?.total_return - userInfo?.claimed_return} BNB
          </Grid>
          <Grid
            item
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.item}
          >
            Claimed
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
            {userInfo.claimed_return} BNB
          </Grid>
          <Grid
            item
            lg={5.5}
            md={5.5}
            sm={5.5}
            xs={5.5}
            className={styles.item}
          >
            Invited Reward
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
            {userInfo?.referral_return} BNB
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
            Active Total Earnings
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
            {userInfo.total_return} BNB
          </Grid>

          <Button className={styles.btn} onClick={settle}>
            Confirm
          </Button>
          <Button className={styles.btn} onClick={claim}>
            Withdraw
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Vault;
