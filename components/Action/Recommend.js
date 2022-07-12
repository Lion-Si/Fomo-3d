import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import styles from "../../styles/components/Recommend.module.css";

import { switch_to_bsc } from "../../src/utils/Common";
import ABI from "../../public/abi.json";

const Address = "0x9B66816Bb69a17aCDeD442522d8495DFf01497C1";

const Recommend = (props) => {
  const user_address = useSelector((state) => state.user_address);
  const invite_code = useSelector((state) => state.invite_code);
  const dispatch = useDispatch();
  const [hasCode, setHasCode] = useState(false);

  useEffect(() => {
    if (invite_code.length !== 0) {
      setHasCode(true);
    }
  }, [invite_code]);

  const apply = async () => {
    if (window.ethereum) {
      var code = document.getElementById("code").value;
      console.log(code);
      if (code) {
        let addr = await ethereum.request({ method: "eth_requestAccounts" });
        if (ethereum.networkVersion != "97") {
          await switch_to_bsc();
          return;
        }
        const web3 = new Web3(window.ethereum);
        let myContract = new web3.eth.Contract(ABI, Address);
        await myContract.methods
          .GenerateInviteCode(code)
          .send({ from: addr[0], value: 0 });
        await fresh_key_return();
      } else {
        alert("please input code");
      }
    } else {
      alert("please install MetaMask");
    }
  };

  const fresh_key_return = async () => {
    const web3 = new Web3(window.ethereum);
    let myContract = new web3.eth.Contract(ABI, Address);
    let addr = await ethereum.request({ method: "eth_requestAccounts" });
    let user_info = await myContract.methods.UserInfo(addr[0]).call();
    if (user_info.hasInvite == true) {
      setHasCode(true);
      dispatch({
        type: "SET_INVITE_CODE",
        data: user_info.invite,
      });
    }
  };

  const handleSetEdit = (status) => {
    setHasCode(status);
  };

  const renderShowCode = () => {
    return (
      <Grid item className={styles.item}>
        当前分享码：{invite_code}
        <IconButton onClick={() => handleSetEdit(false)}>
          <EditOutlinedIcon sx={{ color: "white" }} />
        </IconButton>
      </Grid>
    );
  };

  const renderHideCode = () => {
    return (
      <Grid item className={styles.item}>
        您还没有推广码，申请一个 ：
        <input id="code" name="code" type="text" />
        <IconButton onClick={() => handleSetEdit(true)}>
          <CancelOutlinedIcon sx={{ color: "white" }} />
        </IconButton>
        <Button
          onClick={apply}
          className={styles.btnGold}
          style={{ width: "10px" }}
        >
          申请
        </Button>
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container>
        <Typography className={styles.thin}>{"A Bad Idea"}</Typography>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Grid container className={styles.showInfo}>
          {hasCode ? renderShowCode() : renderHideCode()}
          <Grid item className={styles.item}>
            {!hasCode
              ? "Generate a referral link to invite more people exit scamming together, get 2.5% from their bets"
              : "Get 2.5% from invitee’s bets, invitee will get 5% off from their first bet"}
          </Grid>
          <Button className={styles.btnGold}>
            <CheckIcon />
            注册一个专属的推广代号
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Recommend;
