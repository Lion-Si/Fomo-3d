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
import Logo from "../../public/assets/logo1.png";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import DescriptionIcon from "@mui/icons-material/Description";
import KeyIcon from "@mui/icons-material/KeyOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import Link from "next/link";
import Image from "next/image";

import { switch_to_bsc, fresh_key_return } from "../../src/utils/Common";
import styles from "../../styles/components/Header.module.css";
import ABI from "../../public/abi.json";

const pages = ["about", "Pricing", "Blog"];

const Address = "0x9B66816Bb69a17aCDeD442522d8495DFf01497C1";
const usFormatterSix = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 6,
});

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

  // useEffect(() => {
  //   if (localStorage.getItem("isConnect")) {
  //     console.log("当前登录？", isConnect, localStorage.getItem("isConnect"));
  //     if (typeof Web3 !== undefined) {
  //       login();
  //     }
  //   }
  // }, []);

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
      localStorage.setItem("isConnect", true);
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
    console.log(typeof Web3);
    if (typeof Web3 !== undefined && window.ethereum) {
      const web3 = new Web3(window.ethereum);
      let myContract = new web3.eth.Contract(ABI, Address);
      let addr = await ethereum.request({ method: "eth_requestAccounts" });
      let game_round = await myContract.methods.GameRound().call();
      let user_info = await myContract.methods.UserInfo(addr[0]).call();
      let yourkey = await myContract.methods
        .UserKey(game_round, addr[0])
        .call();
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
      console.log(typeof total_return);
      dispatch({
        type: "SET_USER_INFO",
        data: {
          ...userInfo,
          referral_return: parseInt(user_info.invIncome) / 10 ** 18,
          claimed_return: parseInt(user_info.claimed) / 10 ** 18,
          total_return: parseInt(total_return),
          key: parseInt(yourkey),
        },
      });
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#343a40" }}>
      <Container
        sx={{ maxWidth: { lg: "80%", md: "90%", sm: "100%", xs: "100%" } }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h5"
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
            <img src={Logo?.src} style={{ width: "4rem" }} alt="" />
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
              <Button className={styles.hideBtn}>
                <Link
                  className={styles.hideBtn}
                  href={{
                    pathname: "/about",
                    query: { way: "invite" },
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <LinkOutlinedIcon style={{ transform: "rotate(135deg)" }} />
                    <span>Referral Program</span>
                  </div>
                </Link>
              </Button>
              <Button
                href={`https://twitter.com/Exit_Scamming/about`}
                onClick={handleCloseNavMenu}
                className={styles.hideBtn}
              >
                <TwitterIcon />
              </Button>
              <Button
                href={`https://testnet.bscscan.com/address/${Address}`}
                onClick={handleCloseNavMenu}
                className={styles.hideBtn}
              >
                {"contract"}
              </Button>
              <Button
                sx={{ width: "100%" }}
                className={styles.hideBtn}
                onClick={handleCloseNavMenu}
              >
                {"White Paper"}
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
              <img src={Bnb?.src} style={{ height: "1rem" }} alt="" />
              &nbsp;
              <span>{usFormatterSix.format(gameInfo?.bnb) || "00"}</span>
            </div>
            {/* <Button
              href={`/about`}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              {"About"}
            </Button> */}
            <Button className={styles.btn}>
              <Link
                href={{
                  pathname: "/about",
                  query: { way: "invite" },
                }}
              >
                <div
                  style={{
                    cursor: "pointer",
                    justifyContent: "center",
                  }}
                >
                  <LinkOutlinedIcon style={{ transform: "rotate(135deg)" }} />
                  <Typography
                    sx={{
                      display: { md: "none", lg: "flex" },
                      color: "white",
                      fontFamily: "Comic Sans MS",
                    }}
                  >
                    Referral Program
                  </Typography>
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
              href={`https://github.com/Exit_Scamming/about`}
              onClick={handleCloseNavMenu}
              className={styles.btn}
            >
              <GitHubIcon />
            </Button>
            <Button
              href={`https://testnet.bscscan.com/address/${Address}`}
              onClick={handleCloseNavMenu}
              className={styles.btn}
            >
              {"contract"}
            </Button>
            <a className={styles.btn}>
              <Typography
                sx={{
                  display: { md: "none", lg: "flex" },
                  color: "white",
                  fontFamily: "Comic Sans MS",
                }}
              >
                WhitePaper
              </Typography>
              <DescriptionIcon sx={{ display: { md: "flex", lg: "none" } }} />
            </a>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Button
              id="connect"
              type="button"
              onClick={login}
              className={styles.btnGold}
            >
              connect
            </Button>
          </Box>
          <Button
            href="/admin"
            style={{ backgroundColor: "transparent" }}
          ></Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
