This repo contains the development of the NFTify browser extension.  It's broken into two sections.


## extension/
The `extension/` directory, which houses the code for the browser extension.

The next step in this section of the project is to get **Web3** imported as a third-party import and injected into the page so we can interact with the user's Ethereum wallet (currently when NFTify is selected it obviously fails with "Web3 is not defined").

## colors/
The `colors/` directory which houses the NFT smart contract that the browser extension will interact with.  This code was taken from the [RSK Colors tutorial](https://developers.rsk.co/tutorials/tokens/create-a-collectable-token/) (with some minor updates to make the code functional).

Along with the smart contract, it also contains a react app to interact with the smart contract via the browser as an example of how it's done.
