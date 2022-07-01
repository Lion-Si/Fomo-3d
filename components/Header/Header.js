import React, { useEffect, useState } from "react";
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
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import TelegramIcon from "@mui/icons-material/Telegram";
import KeyIcon from "@mui/icons-material/KeyOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import Link from "next/link";

import { switch_to_bsc } from "../../src/utils/Common";
import styles from "../../styles/components/Header.module.css";

const pages = ["about", "Pricing", "Blog"];

const Address = "0xcEE9f25B0443513abCD609B4BD50a4F8315E640b";

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  useEffect(() => {
    if (document?.getElementById("connect")?.innerHTML !== "connect wallet") {
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
      // await fresh_keyreturn();
    } else {
      alert("please install MetaMask");
    }
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
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            梭哈
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
              }}
            >
              {pages.map((page) => (
                <Link key={page} href={`/${page}`} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </Link>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
            className={styles.appBar}
          >
            <div readOnly={true} onClick={handleCloseNavMenu}>
              <AccessAlarmIcon />
              <span>00:00</span>
            </div>
            <div readOnly={true} onClick={handleCloseNavMenu}>
              <KeyIcon style={{ transform: "rotate(135deg)" }} />
              <span>000</span>
            </div>
            <div readOnly={true} onClick={handleCloseNavMenu}>
              <span>3.2% (102.13 ETH)</span>
            </div>

            {/* <Button
              href={`/about`}
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              {"About"}
            </Button> */}
            <Button onClick={handleCloseNavMenu} className={styles.btn}>
              <LinkOutlinedIcon style={{ transform: "rotate(135deg)" }} />
              <span>购买推广链接</span>
            </Button>
            <Button
              href={`https://t.me/suohame`}
              onClick={handleCloseNavMenu}
              className={styles.btn}
            >
              <TelegramIcon />
            </Button>
            <Button
              href={`https://testnet.bscscan.com/address/${Address}`}
              onClick={handleCloseNavMenu}
              className={styles.btn}
            >
              {"合约"}
            </Button>
            <Button
              href={`/`}
              onClick={handleCloseNavMenu}
              className={styles.btn}
            >
              {"Help"}
            </Button>
            <Button
              href={`https://cobo.com/`}
              onClick={handleCloseNavMenu}
              className={styles.btn}
            >
              {"Cobo"}
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <button id="connect" type="button" onClick={login}>
              connect wallet
            </button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
