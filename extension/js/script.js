const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_imageUrl",
        type: "string",
      },
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
  {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "_urlToId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
];

const NFT_CONTRACT_ADDRESS = '0xea3Aa1E7D56686A2561c932F13f02d6d0503449E'
const OPENSEA_STORE_BASE_URL = `https://testnets.opensea.io/assets/${NFT_CONTRACT_ADDRESS}/`

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

const mintImage = async (imageUrl) => {
  const web3 = window.web3;
	const nftContract = new web3.eth.Contract(
		NFT_ABI,
		NFT_CONTRACT_ADDRESS,
		{ 
      gasLimit: "1000000", 
      // this isn't working, literally nothing is getting returned when this is enabled...lol...
      // see this issue: https://github.com/ChainSafe/web3.js/issues/3939 and this issue: https://github.com/ChainSafe/web3.js/issues/3742
      // handleRevert: true 
    }
	);

	console.log('minting ' + imageUrl + ' to: ' + window.account)

  await nftContract.methods
  	.mintTo( imageUrl, window.account )
    .send({ from: window.account  })
    .on('error', async (error) => {
      console.log('URL already minted...')
      // we have to do this because we can't get the revert reason out of the error for some reason.
      // otherwise, we'd use that to know if a URL has already been minted and navigate to it.
      const urlId = await nftContract.methods._urlToId(imageUrl).call();
      // let the user know that their image has already been minted.
      alert('That image has already been minted.  Redirecting you to it\'s listing')
      await document.dispatchEvent(new CustomEvent('navigateBrowser', { detail: OPENSEA_STORE_BASE_URL + urlId }));
    })
  const urlId = await nftContract.methods._urlToId(imageUrl).call();
  await document.dispatchEvent(new CustomEvent('navigateBrowser', { detail: OPENSEA_STORE_BASE_URL + urlId }));
}

// respond to messages passed by the nfty.js script, which itself is listening to the background.js messages.
document.addEventListener('mintImage', async (e) => {
  await loadWeb3()
  await loadAccount()
  // minting a new image in the opensea test contract
  await mintImage(e.detail)
});