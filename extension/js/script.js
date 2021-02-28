
const loadWeb3 = async () => {
	console.log(window)
	if (window.ethereum) {
      // current web3 providers
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      // fallback for older web3 providers
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      // no web3 provider, user needs to install one in their browser
      window.alert('No injected web3 provider detected');
    }
    console.log(window.web3.currentProvider);
}

// respond to messages passed by the nftify.js script, which itself is listening to the background.js messages.
document.addEventListener('loadWeb3', async (e) => {
  console.log(e.detail)
  await loadWeb3()
});