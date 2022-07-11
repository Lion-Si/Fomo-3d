import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
} from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";

import { AccountCircle, Scale } from "@mui/icons-material";
import Bnb from "../../public/assets/bnb.png";
import Bear from "../../public/assets/tbear.png";
import Bull from "../../public/assets/tbull.png";
import Snek from "../../public/assets/tsnek.png";
import Whale from "../../public/assets/twhale.png";
import styles from "../../styles/components/Buy.module.css";

import { switch_to_bsc } from "../../src/utils/Common";
import ABI from "../../public/abi.json";

const radio_data = [
  {
    name: "Balance",
    src: Bear,
    description: "Balance may important",
  },
  {
    name: "Generous",
    src: Bull,
    description: "Generous may important",
  },
  {
    name: "Greedy",
    src: Snek,
    description: "Greedy may important",
  },
  {
    name: "Cooperate",
    src: Whale,
    description: "Cooperate may important",
  },
];

const Address = "0xcEE9f25B0443513abCD609B4BD50a4F8315E640b";

const Buy = (props) => {
  // 获取中央仓库中的数据(需要的时候在引入)
  const userInfo = useSelector((state) => state.userInfo);
  // 通信必备
  const dispatch = useDispatch();

  const [count, setCount] = useState(0);
  const [type, setType] = useState(0);

  const handleChangeCount = (e) => {
    setCount(e.target.value);
  };

  const checkRadio = () => {
    let obj = document.getElementsByName("check_radio");
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].checked) {
        setType(obj[i].value);
      }
    }
  };

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

  return (
    <Box sx={{ p: 1 }}>
      <Grid container>
        <Typography className={styles.thin}>
          {"A new round of games"}
        </Typography>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Grid item sx={{ width: "100%", textAlign: "center" }}>
          至少支付0.002 TBNB（1 key） 来开启一轮游戏
        </Grid>
        <Box sx={{ height: "1rem", width: "100%" }}></Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            backgroundColor: "white",
            textAlign: "center",
            width: "100%",
          }}
        >
          <img
            src={Bnb?.src}
            style={{
              width: "2rem",
              color: "action.active",
              transform: "scale(0.75)",
            }}
            alt=""
          />
          <TextField
            variant="standard"
            value={count}
            fullWidth
            id="fullWidth"
            onChange={handleChangeCount}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" paddingRight="10px">
                  Key
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: "8px",
              "& .MuiInputAdornment-root": {
                marginRight: "5px",
              },
              "& .MuiInputBase-colorPrimary": {
                borderBottom: "none",
                "&:focus,&:active,&:hover": {
                  borderBottom: "none",
                },
                "&:before,&:after": {
                  borderBottom: "none",
                },
                "& .MuiInput-root:hover:not(.Mui-disabled):before": {
                  borderBottom: "none",
                },
              },
              "& .MuiInputBase-input": {
                textAlign: "center",
              },
            }}
          />
        </Box>
        <Grid
          container
          sx={{ justifyContent: "space-between", paddingTop: "1rem" }}
        >
          <Grid item align="center" lg={5.5} md={5.5} sm={5.5} xs={5.5}>
            <Button
              className={`${styles.btnGold} ${styles.btnSize}`}
              onClick={buy}
            >
              <img src={Bnb?.src} style={{ height: "1.5rem" }} alt="" />
              {"Send BNB"}
            </Button>
          </Grid>
          <Grid item align="center" lg={5.5} md={5.5} sm={5.5} xs={5.5}>
            <Button className={`${styles.btnGold} ${styles.btnSize}`}>
              <SavingsIcon />
              Use vault
            </Button>
          </Grid>
          <p lg={12} md={12} sm={12} xs={12} className={styles.text}>
            send BNB, or use the income in your vault!
          </p>
        </Grid>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Typography>{"Select Your Team"}</Typography>
        <Grid
          container
          sx={{ justifyContent: "space-between", paddingTop: "1rem" }}
        >
          {radio_data.map((item, index) => {
            return (
              <Grid
                item
                align="center"
                key={index}
                lg={12 / radio_data.length}
                md={12 / radio_data.length}
                sm={12 / radio_data.length}
                xs={12 / radio_data.length}
                sx={{ borderRight: "2px #565656 solid" }}
              >
                <label className={styles.label}>
                  <input
                    type="radio"
                    id={item.name}
                    name={"check_radio"}
                    value={index}
                    onChange={checkRadio}
                    className={styles.radio}
                  />
                  <img
                    src={item.src?.src}
                    alt=""
                    className={type == index ? styles.checked : ""}
                  />
                  <h5>{item.name}</h5>
                  <p>{item.description}</p>
                </label>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Buy;
