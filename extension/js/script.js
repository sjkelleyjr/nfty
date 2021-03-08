const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
    ],
    name: "mintTo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const NFT_CONTRACT_ADDRESS = '0x0B4E9b00E75E76C7619C9b7BF267B7285d769ae7'

const loadWeb3 = async () => {
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

const loadAccount = async () => {
  const web3 = window.web3;
  // Load account
  const accounts = await web3.eth.getAccounts();
  console.log ('account: ', accounts[0]);
  window.account = accounts[0];
}

const mintCreature = async () => {
	const nftContract = new web3.eth.Contract(
		NFT_ABI,
		NFT_CONTRACT_ADDRESS,
		{ gasLimit: "1000000" }
	);

	console.log('minting to: ' + window.account)
	const result = await nftContract.methods
		.mintTo( window.account )
		.send({ from: window.account  });
		console.log("Minted creature. Transaction: " + result.transactionHash);
}


// respond to messages passed by the nfty.js script, which itself is listening to the background.js messages.
document.addEventListener('mintCreature', async (e) => {
  console.log(e.detail)
  await loadWeb3()
  await loadAccount()
  // minting a new creature in the opensea test contract
  await mintCreature()
});