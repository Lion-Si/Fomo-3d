import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";

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
    name: "Snek",
    src: Snek,
    description: "Trickle down Divinomics",
  },
  {
    name: "Whale",
    src: Whale,
    description: "Feed on greed of others",
  },
  {
    name: "Bull",
    src: Bull,
    description: "Break upwards, never stagnate",
  },
  {
    name: "Bear",
    src: Bear,
    description: "Stand alone, fight alone",
  },
];

const change_data = [
  {
    name: "Stepm",
    src: Snek,
    description: "Trickle down Divinomics",
  },
  {
    name: "Runa",
    src: Whale,
    description: "Feed on greed of others",
  },
  {
    name: "BAZC",
    src: Bull,
    description: "Break upwards, never stagnate",
  },
  {
    name: "Bxie",
    src: Bear,
    description: "Stand alone, fight alone",
  },
];

const usFormatterSix = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
});

const Address = "0x9B66816Bb69a17aCDeD442522d8495DFf01497C1";

const Buy = (props) => {
  // 获取中央仓库中的数据(需要的时候在引入)
  const { code } = props;
  const status = useSelector((state) => state.scamming_status);
  const userInfo = useSelector((state) => state.userInfo);
  const gameInfo = useSelector((state) => state.gameInfo);
  const roundTime = useSelector((state) => state.round_time);
  // 通信必备
  const dispatch = useDispatch();

  const [count, setCount] = useState(1);
  const [type, setType] = useState(0);
  const [currentBnb, setCurrentBnb] = useState(0);
  const [alignment, setAlignment] = useState("1");
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    if (code) {
      setInviteCode(code);
    }
  }, []);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleChangeCount = (e) => {
    setCount(e.target.value);
  };

  useEffect(() => {
    // 实例化web3
    if (typeof Web3 !== "undefined") {
      getCurrentBnb();
    }
  }, [alignment]);

  const getCurrentBnb = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      let myContract = new web3.eth.Contract(ABI, Address);
      console.log(await myContract.methods.CurrentFomoPrice().call());
      setCurrentBnb(await myContract.methods.CurrentFomoPrice().call());
    }
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
      let currentValue = await myContract.methods.CurrentFomoPrice().call();
      console.log(currentValue, type, count);
      await myContract.methods.BuyKey(type, inviteCode).send({
        from: addr[0],
        value:
          alignment * (roundTime === "00:00:00" ? 2 * 10 ** 15 : currentValue),
      });
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
        <Typography className={styles.thin}>
          {`Keyring # ${gameInfo.round}`}
        </Typography>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Grid item sx={{ width: "100%", textAlign: "center" }}>
          Purchase keys to receive dividends from the following bets. Last
          bettor will win all BNB in pot{" "}
          {`(${usFormatterSix.format(gameInfo.total_pot)} BNB)`}.
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
          <TextField
            variant="standard"
            value={`${alignment} keys`}
            fullWidth
            readonly
            id="fullWidth"
            onChange={handleChangeCount}
            InputProps={{
              startAdornment: (
                <img
                  src={Bnb?.src}
                  style={{
                    width: "2rem",
                    color: "action.active",
                    transform: "scale(0.75)",
                  }}
                  alt=""
                />
              ),
              endAdornment: (
                <InputAdornment position="end">
                  @{" "}
                  {(alignment *
                    (roundTime === "00:00:00" ? 2 * 10 ** 15 : currentBnb)) /
                    10 ** 18}{" "}
                  BNB
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
        <Box sx={{ height: "1rem", width: "100%" }}></Box>
        <Box
          sx={{
            width: "100%",
            "& .MuiToggleButton-root": {
              color: "#FD02EF",
              border: "1px solid #FD02EF",
            },
            "& .Mui-selected": {
              color: "#FD02EF !important",
              backgroundColor: "rgba(253,2,239,0.3) !important",
            },
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            sx={{ width: "100%", fontFamily: "Comic Sans MS" }}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton
              value="1"
              sx={{ width: "24%", fontFamily: "Comic Sans MS" }}
            >
              CAll
            </ToggleButton>
            <ToggleButton
              value="2"
              sx={{ width: "24%", fontFamily: "Comic Sans MS" }}
            >
              2X raise
            </ToggleButton>
            <ToggleButton
              value="3"
              sx={{ width: "11%", fontFamily: "Comic Sans MS" }}
            >
              3<br />x
            </ToggleButton>
            <ToggleButton
              value="4"
              sx={{ width: "11%", fontFamily: "Comic Sans MS" }}
            >
              4<br />x
            </ToggleButton>
            <ToggleButton
              value="5"
              sx={{ width: "11%", fontFamily: "Comic Sans MS" }}
            >
              5<br />x
            </ToggleButton>
            <ToggleButton
              value="10"
              sx={{ width: "11%", fontFamily: "Comic Sans MS" }}
            >
              10
              <br />x
            </ToggleButton>
            <ToggleButton value="20" sx={{ fontFamily: "Comic Sans MS" }}>
              20
              <br />x
            </ToggleButton>
          </ToggleButtonGroup>
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
            <Button
              className={`${styles.vault} ${styles.btnSize}`}
              onClick={props.changeToVault}
            >
              <SavingsIcon />
              My Vault
            </Button>
          </Grid>
          <p lg={12} md={12} sm={12} xs={12} className={styles.text}>
            Each bet have 10% chance to win 3% of the pot{" "}
            {`(${usFormatterSix.format(gameInfo.total_pot)} BNB)`}.
          </p>
        </Grid>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Typography sx={{ fontFamily: "Comic Sans MS" }}>
          {"Choose Your Team"}
        </Typography>
        <Grid
          container
          sx={{ justifyContent: "space-between", paddingTop: "1rem" }}
        >
          {(status ? change_data : radio_data).map((item, index) => {
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
