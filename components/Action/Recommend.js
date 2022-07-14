import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
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
import Link from "next/link";

import styles from "../../styles/components/Recommend.module.css";

import { switch_to_bsc } from "../../src/utils/Common";
import ABI from "../../public/abi.json";

const Address = "0x9B66816Bb69a17aCDeD442522d8495DFf01497C1";

const Recommend = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { code } = props;
  const user_address = useSelector((state) => state.user_address);
  const invite_code = useSelector((state) => state.invite_code);
  const [hasCode, setHasCode] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    if (invite_code.length !== 0) {
      setHasCode(true);
    }
  }, [invite_code]);

  useEffect(() => {
    if (code) {
      setInviteCode(code)
    }
  }, []);

  const apply = async () => {
    console.log(inviteCode);
    if (window.ethereum) {
      if (inviteCode) {
        let addr = await ethereum.request({ method: "eth_requestAccounts" });
        if (ethereum.networkVersion != "97") {
          await switch_to_bsc();
          return;
        }
        const web3 = new Web3(window.ethereum);
        let myContract = new web3.eth.Contract(ABI, Address);
        await myContract.methods
          .GenerateInviteCode(inviteCode)
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
      <Fragment>
        <Grid item className={styles.item}>
          Your Referral Link：
          <Link
            href="/[code]"
            as={`/${invite_code}`}
          >{`${window.location.host}/${invite_code}`}</Link>
          <IconButton onClick={() => handleSetEdit(false)}>
            <EditOutlinedIcon sx={{ color: "white" }} />
          </IconButton>
        </Grid>
        <Grid item className={styles.item}>
          Get 2.5% from invitee’s bets, invitee will get 5% off from their first
          bet
        </Grid>
      </Fragment>
    );
  };

  const renderHideCode = () => {
    return (
      <Fragment>
        <Grid item className={styles.item}>
          您还没有推广码，申请一个 ：
          <input
            id="code"
            name="code"
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
          />
          <IconButton onClick={() => handleSetEdit(true)}>
            <CancelOutlinedIcon sx={{ color: "white" }} />
          </IconButton>
        </Grid>
        <Grid item className={styles.item}>
          Generate a referral link to invite more people exit scamming together,
          get 2.5% from their bets
        </Grid>
        <Button className={styles.btnGold} onClick={apply}>
          <CheckIcon />
          Generate a Referral Code
        </Button>
      </Fragment>
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container>
        <Typography className={styles.thin}>{"A Bad Idea"}</Typography>
        <Box sx={{ height: "2rem", width: "100%" }}></Box>
        <Grid container className={styles.showInfo}>
          {hasCode ? renderShowCode() : renderHideCode()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Recommend;
