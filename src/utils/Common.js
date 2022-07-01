/**
 * 切换币安智能链
 */
const switch_to_bsc = async () => {
  try {
    await window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: Web3.utils.numberToHex(97) }],
      })
      .then(console.log("switch network"));
  } catch (e) {
    if (e.code === 4902 || e.code === -32603) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: Web3.utils.numberToHex(97),
            chainName: "BSC testnet",
            nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
          },
        ],
      });
      await window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: Web3.utils.numberToHex(97) }],
        })
        .then(console.log("switch network"));
    }
  }
};

export { switch_to_bsc };
