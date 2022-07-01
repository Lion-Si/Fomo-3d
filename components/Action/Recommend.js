import React, { useState } from "react";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import styles from "../../styles/components/Recommend.module.css";

import { switch_to_bsc } from "../../src/utils/Common";
import ABI from "../../public/abi.json";

const Address = "0xcEE9f25B0443513abCD609B4BD50a4F8315E640b";

const Recommend = (props) => {
  const [keys, setKeys] = useState("");
  const [code, setCode] = useState("");

  const apply = async () => {
    var code = $('input:text[name="code"]').val();
    if (window.ethereum) {
      let addr = await ethereum.request({ method: "eth_requestAccounts" });
      if (ethereum.networkVersion != "97") {
        await switch_to_bsc();
        return;
      }
      const web3 = new Web3(window.ethereum);
      let myContract = new web3.eth.Contract(
        ABI,
        "0xcEE9f25B0443513abCD609B4BD50a4F8315E640b"
      );
      await myContract.methods
        .GenerateInviteCode(code)
        .send({ from: addr[0], value: 0 });
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
    setKeys(parseInt(yourkey));
    if (user_info.hasInvite == true) {
      setCode(user_info.invite);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container>
        <Typography className={styles.thin}>{"让更多人参与梭哈"}</Typography>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Grid container className={styles.showInfo}>
          <Grid item className={styles.item}>
            购买一个代号来生成推广链接，并直接分享高达20%的佣金
          </Grid>
          <Button className={styles.btnGold} onClick={apply}>
            <CheckIcon />
            注册一个专属的推广代号
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Recommend;
