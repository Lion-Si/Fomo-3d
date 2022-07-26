import Head from "next/head";
import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Box, Tabs, Tab, Grid, Button } from "@mui/material";
import KeyIcon from "@mui/icons-material/KeyOutlined";
// import SmoothScroll from "smooth-scroll";
import dynamic from "next/dynamic";

import ABI from "../public/abi.json";

import TabPanel from "../components/TabPanel/TabPanel";
import styles from "../styles/About.module.css";
import Buy from "../components/Action/Buy";

import Vault from "../components/Action/Vault";
import Recommend from "../components/Action/Recommend";
import Round from "../components/Action/Round";
import { useRouter } from "next/router";
import History from "../components/Action/History";

const useStyles = makeStyles((theme) => ({
  tabBox: {
    display: "flex",
    "& .Mui-selected": {
      backgroundColor: "#343a40 !important",
    },
    "& .MuiButtonBase-root .MuiTab-root": {
      backgroundColor: "transparent",
    },
  },
}));

const firstProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const secondProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Address = "0x9B66816Bb69a17aCDeD442522d8495DFf01497C1";

// const SmoothScroll = dynamic(() => import("smooth-scroll"), {
//   ssr: false,
// });

const About = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const isConnect = useSelector((state) => state.isConnect);
  const userAddress = useSelector((state) => state.user_address);
  const invite_code = useSelector((state) => state.invite_code);
  const gameInfo = useSelector((state) => state.gameInfo);
  const roundTime = useSelector((state) => state.round_time);
  // 通信必备
  const dispatch = useDispatch();
  const [actionValue, setActionValue] = useState(0);
  const [recordValue, setRecordValue] = useState(0);
  const [inviteCode, setInviteCode] = useState("");
  const [totalPot, setTotalPot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      fresh_base_info();
      if (roundTime === "00:00:00") {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (router?.query?.way === "invite") {
      importSmooth();
    }
    if (router?.query?.code) {
      receiveInviteCode(router?.query?.code);
    }
  }, []);

  /**
   * 在 next/dynamic dynamic(...)来导入模块，只能导入组件
   * 如果需要导入模块参照以下用法 Needs to be ran in an `async` context or environment that supports top-level `await`s
   */
  const importSmooth = async () => {
    const SmoothScroll = (await import("smooth-scroll")).default;
    let scroll = new SmoothScroll();
    let anchor = document?.querySelector("#invite");
    scroll.animateScroll(anchor);
    setActionValue(2);
  };

  /**
   * 本方法用来接收邀请码并自动填入
   * @param {number | string} code 邀请码
   */
  const receiveInviteCode = (code) => {
    if (invite_code.length !== 0) {
      alert(`您已存在邀请码${invite_code}`);
      router.push({
        pathname: "/about",
      });
    } else {
      alert(`当前邀请码为${code}`);
      setInviteCode(code);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getBnbPrice();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getBnbPrice = async () => {
    try {
      const res = await fetch(
        "https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT"
      );
      if (res.status === 200) {
        const json = await res.json();
        dispatch({
          type: "SET_CURRENT_PRICE",
          data: json.price,
        });
      } else {
        alert("请求异常");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeToVault = () => {
    setActionValue(1);
  };

  const handleActionChange = (event, newValue) => {
    setActionValue(newValue);
  };

  const handleRecordChange = (event, newValue) => {
    setRecordValue(newValue);
  };

  const fresh_base_info = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      // const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'))
      let myContract = new web3.eth.Contract(ABI, Address);
      let game_round = await myContract.methods.GameRound().call();
      let round_info = await myContract.methods.RoundInfo(game_round).call();
      let cur_key = await myContract.methods.CurrentKeyNum().call();
      dispatch({
        type: "SET_GAME_INFO",
        data: {
          ...gameInfo,
          round: parseInt(game_round),
          total_pot: parseInt(round_info.bnb) / 10 ** 18,
          bnb: parseInt(round_info.pot) / 10 ** 18,
          total_key: parseInt(round_info.keys),
          key: parseInt(cur_key),
          current_winner: round_info.plyr,
          share: parseInt(round_info.share) / 10 ** 18,
        },
      });
      var now = new Date();
      if (round_info.end > now / 1000) {
        let rest_time = round_info.end - now / 1000;
        let h = parseInt(rest_time / 3600);
        let m = parseInt((rest_time - 3600 * h) / 60);
        let s = parseInt(rest_time - 3600 * h - 60 * m);
        dispatch({
          type: "SET_ROUND_TIME",
          data: `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        });
      } else {
        dispatch({
          type: "SET_ROUND_TIME",
          data: `00:00:00`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className={styles.background} />
      <div className={styles.container}>
        <Head>
          <title>FOMO-3D | About</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.subtitle}>
            {isConnect
              ? `${userAddress.slice(0, 7)}....${userAddress.substring(
                  userAddress.length - 5
                )} is `
              : " Somebody else is "}
          </h1>
          <h1 className={styles.title}>Exit Scamming Again</h1>
          <div
            style={{
              color: "white",
              fontSize: "4.5rem",
              textShadow: "0 0 5px #2b002b, 0 0 20px #FD02EF, 0 0 10px #FD02EF",
            }}
          >
            {gameInfo.total_pot} BNB
          </div>
          <div style={{ color: "white", fontSize: "2rem" }}>
            {roundTime === "00:00:00" ? "was" : "will be"} taken away by &nbsp;
            <a
              style={{
                color: "white",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {gameInfo?.current_winner.slice(0, 7) +
                "...." +
                gameInfo?.current_winner.substring(
                  gameInfo?.current_winner?.length - 5
                )}
            </a>
          </div>
          <div className={styles.time}>
            <span>in {roundTime || "00:00:00"}</span>
          </div>
          <Button className={`${styles.btnGold} ${styles.btnSize}`}>
            <div style={{ display: "flex", alignItems: "center" }}>
              1x
              <KeyIcon style={{ transform: "rotate(135deg)" }} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                textTransform: "capitalize",
              }}
            >
              {roundTime === "00:00:00"
                ? `Lucky! Your are the frist person to start a new round`
                : `Join and Exit Scamming with ${gameInfo.total_pot} BNB`}
            </div>
          </Button>
          <Grid container className={styles.tabBox}>
            <Grid item className={styles.tab} lg={5} md={6} sm={11} xs={12}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTabs-flexContainer": {
                    borderBottom: "1px solid #dee2e6",
                  },
                  "& .Mui-selected": {
                    color: "white !important",
                    backgroundColor: "#343a40",
                    marginBottom: "-1px",
                    borderTopLeftRadius: "0.25rem",
                    borderTopRightRadius: "0.25rem",
                  },
                }}
              >
                <Tabs
                  value={actionValue}
                  onChange={handleActionChange}
                  aria-label="basic tabs example"
                  indicatorColor="transparent"
                >
                  <Tab
                    label="Bets"
                    sx={{
                      color: "white",
                      fontFamily: "Comic Sans MS",
                      "&:hover": {
                        backgroundColor: "#2d3238",
                        textShadow:
                          "0 0 2px #2b002b, 0 0 25px #c0c, 0 0 5px #f0f",
                      },
                    }}
                    {...firstProps(0)}
                  />
                  <Tab
                    label="Vault"
                    sx={{
                      color: "white",
                      fontFamily: "Comic Sans MS",
                      "&:hover": {
                        backgroundColor: "#2d3238",
                        textShadow:
                          "0 0 2px #2b002b, 0 0 25px #c0c, 0 0 5px #f0f",
                      },
                    }}
                    {...firstProps(1)}
                  />
                  <Tab
                    label="Referral Program"
                    sx={{
                      color: "white",
                      fontFamily: "Comic Sans MS",
                      "&:hover": {
                        backgroundColor: "#2d3238",
                        textShadow:
                          "0 0 2px #2b002b, 0 0 25px #c0c, 0 0 5px #f0f",
                      },
                    }}
                    {...firstProps(2)}
                  />
                </Tabs>
              </Box>
              <div id="buy">
                <TabPanel value={actionValue} index={0}>
                  <Buy changeToVault={changeToVault} code={inviteCode} />
                </TabPanel>
              </div>
              <TabPanel value={actionValue} index={1}>
                <Vault />
              </TabPanel>
              <div id="invite">
                <TabPanel value={actionValue} index={2}>
                  <Recommend code={inviteCode} />
                </TabPanel>
              </div>
            </Grid>
            <Grid item className={styles.tab} lg={5} md={6} sm={11} xs={12}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  "& .MuiTabs-flexContainer": {
                    borderBottom: "1px solid #dee2e6",
                  },
                  "& .Mui-selected": {
                    color: "white !important",
                    marginBottom: "-10px",
                    backgroundColor: "#343a40",
                    borderTopLeftRadius: "0.25rem",
                    borderTopRightRadius: "0.25rem",
                  },
                }}
              >
                <Tabs
                  value={recordValue}
                  onChange={handleRecordChange}
                  aria-label="basic tabs example"
                  indicatorColor="transparent"
                >
                  <Tab
                    label="Round"
                    sx={{ color: "white", fontFamily: "Comic Sans MS" }}
                    {...secondProps(0)}
                  />
                  <Tab
                    label="Last Winners"
                    sx={{ color: "white", fontFamily: "Comic Sans MS" }}
                    {...secondProps(1)}
                  />
                </Tabs>
              </Box>
              <TabPanel value={recordValue} index={0}>
                <Round />
              </TabPanel>
              <TabPanel value={recordValue} index={1}>
                <History />
              </TabPanel>
            </Grid>
          </Grid>
        </main>
      </div>
    </Fragment>
  );
};

export default About;
