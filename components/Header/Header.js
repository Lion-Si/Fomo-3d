import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
} from "@mui/material";
import Bnb from "../../public/assets/bnb.png";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import KeyIcon from "@mui/icons-material/KeyOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import Link from "next/link";

import { switch_to_bsc, fresh_key_return } from "../../src/utils/Common";
import styles from "../../styles/components/Header.module.css";
import ABI from "../../public/abi.json";

const pages = ["about", "Pricing", "Blog"];

const Address = "0x9B66816Bb69a17aCDeD442522d8495DFf01497C1";

const ResponsiveAppBar = (props) => {
  // 获取中央仓库中的数据(需要的时候在引入)
  const userInfo = useSelector((state) => state.userInfo);
  const isConnect = useSelector((state) => state.isConnect);
  const user_address = useSelector((state) => state.user_address);
  const invite_code = useSelector((state) => state.invite_code);
  const round_time = useSelector((state) => state.round_time);
  const gameInfo = useSelector((state) => state.gameInfo);
  // 通信必备
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = useState(null);

  useEffect(() => {
    if (user_address.length !== 0) {
      login();
    }
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const login = async () => {
    if (window.ethereum) {
      let addr = await ethereum.request({ method: "eth_requestAccounts" });
      if (document.getElementById("connect")) {
        document.getElementById("connect").innerHTML =
          addr[0].slice(0, 7) + "...." + addr[0].substring(addr[0].length - 5);
        if (ethereum.networkVersion != "97") {
          alert("please switch to BSC testnet");
          await switch_to_bsc();
        }
      }
      dispatch({
        type: "SET_CONNECT_STATUS",
        data: true,
      });
      dispatch({
        type: "SET_USER_ADDRESS",
        data: addr[0],
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

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#343a40" }}>
      <Container
        sx={{ maxWidth: { lg: "80%", md: "90%", sm: "100%", xs: "100%" } }}
      >
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Fomo3D
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
                "& .MuiMenu-list": {
                  backgroundColor: "#343a40",
                  color: "white",
                },
              }}
            >
              <Button onClick={handleCloseNavMenu} className={styles.hideBtn}>
                <LinkOutlinedIcon style={{ transform: "rotate(135deg)" }} />
                <span>购买推广链接</span>
              </Button>
              <Button
                href={`https://t.me/suohame`}
                onClick={handleCloseNavMenu}
                className={styles.hideBtn}
              >
                <TelegramIcon />
              </Button>
              <Button
                href={`https://testnet.bscscan.com/address/${Address}`}
                onClick={handleCloseNavMenu}
                className={styles.hideBtn}
              >
                {"合约"}
              </Button>
              <Button
                href={`https://fomo3d.hostedwiki.co/`}
                onClick={handleCloseNavMenu}
                className={styles.hideBtn}
              >
                {"Help"}
              </Button>
              <Button
                href={`https://cobo.com/`}
                onClick={handleCloseNavMenu}
                className={styles.hideBtn}
              >
                {"Cobo"}
              </Button>
            </Menu>
          </Box>
          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            className={styles.appBar}
          >
            <div readOnly={true} onClick={handleCloseNavMenu}>
              <AccessAlarmIcon />
              <span>{round_time || "00:00:00"}</span>
            </div>
            <div readOnly={true} onClick={handleCloseNavMenu}>
              <KeyIcon style={{ transform: "rotate(135deg)" }} />
              <span>{userInfo?.key || "000"}</span>
            </div>
            <div readOnly={true} onClick={handleCloseNavMenu}>
              <img src={Bnb?.src} style={{ height: "1rem" }} alt="" />&nbsp;
              <span>{gameInfo?.bnb || "00"}</span>
            </div>
            {/* <Button
              href={`/about`}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              {"About"}
            </Button> */}
            <Button>
              <Link
                className={styles.btn}
                href={{
                  pathname: "/about",
                  query: { way: "invite" },
                }}
              >
                <div>
                  <LinkOutlinedIcon style={{ transform: "rotate(135deg)" }} />
                  <span>Referral Program</span>
                </div>
              </Link>
            </Button>
            <Button
              href={`https://twitter.com/Exit_Scamming/about`}
              onClick={handleCloseNavMenu}
              className={styles.btn}
            >
              <TwitterIcon />
            </Button>
            <Button
              href={`https://testnet.bscscan.com/address/${Address}`}
              onClick={handleCloseNavMenu}
              className={styles.btn}
            >
              {"contract"}
            </Button>
            <a className={styles.btn}>{"White Paper"}</a>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Button
              id="connect"
              type="button"
              onClick={login}
              className={styles.hideBtn}
            >
              connect wallet
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
