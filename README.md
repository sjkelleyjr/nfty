This repo contains the development of the NFTify browser extension.  Currently, it's broken into two sections.


## extension/
The `extension/` directory, which houses the code for the browser extension.

As it stands now, this is [minting a random color NFT](./extension/js/script.js#L77) every time the "nftify" menu item is selected, so, largely the extension development is "done".  Rather than minting a color we'll likely be minting something related to the `TradeableERC721Token` discussed below, but until I do more research into what this is it's tough to say how much more dev we'll need here.

## colors/
The `colors/` directory which houses the NFT smart contract that the browser extension will interact with.  This code was taken from the [RSK Colors tutorial](https://developers.rsk.co/tutorials/tokens/create-a-collectable-token/) (with some minor updates to make the code functional).

Along with the smart contract, it also contains a react app to interact with the smart contract via the browser as an example of how it's done.

Note, that it's likely we'll be using [opensea](https://opensea.io/) so people can trade the NFTs.  So, it's likely that the colors NFT isn't going to be sufficient (opensea uses a concept called the [`TradeableERC721Token`](https://docs.opensea.io/docs/1-structuring-your-smart-contract#section-creature-erc-721-contract)).  This means the code in this directory will likely eventually be replaced with something in [these tutorials](https://docs.opensea.io/docs) so the NFTs can be traded.  For now, the RSK Colors tutorial will be used to code against a smart contract.
