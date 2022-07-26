import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import store from "../store/index";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import "../styles/globals.css";
import Script from "next/script";
import Header from "../components/Header/Header";
import Loader from "../components/Loading/Loader";
import Footer from "../components/Footer/Footer";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  const router = useRouter();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   console.log(router);
  //   const handleStart = (url) => {
  //     console.log(url);
  //     url !== router.pathname ? setIsLoading(true) : setIsLoading(false);
  //   };
  //   const handleComplete = (url) => setIsLoading(false);

  //   router.events.on("routeChangeStart", handleStart);
  //   router.events.on("routeChangeComplete", handleComplete);
  //   router.events.on("routeChangeError", handleComplete);
  // }, [router]);
  useEffect(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [router]);

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
            {/* <Script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js"></Script> */}
          </Head>
          <Script
              src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
              integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
              crossorigin="anonymous"
            ></Script>
          <Script
              src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.4/web3.min.js"
              integrity="sha512-oMd9Re3VgJcXuZJn9DN6X7S7JUc7xLYZ2UyZ85Mm/xzaW3lwBr4fV2zjuu/n5jY/Of/2JOx35CTa6zvQNxb31Q=="
              crossorigin="anonymous"
              referrerpolicy="no-referrer"
            ></Script>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <CssBaseline />
              <Header />
              <Component {...pageProps} />
              <Footer />
            </Provider>
          </ThemeProvider>
        </CacheProvider>
      )}
    </Fragment>
  );
};

export default MyApp;
