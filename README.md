This repo contains the development of the nfty browser extension.  Currently, it's broken into two sections.


# extension/
The `extension/` directory, which houses the code for the browser extension.

As it stands now, this is [minting a random color NFT](./extension/js/script.js#L77) every time the "Mint This Image" menu item is selected, so, largely the extension development is "done".  Rather than minting a color we'll be minting something related to the `TradeableERC721Token` discussed below.

# colors/
The `colors/` directory which houses the NFT smart contract that the browser extension currently interacts with.  This code was taken from the [RSK Colors tutorial](https://developers.rsk.co/tutorials/tokens/create-a-collectable-token/) (with some minor updates to make the code functional).

Along with the smart contract, it also contains a react app to interact with the smart contract via the browser as an example of how it's done.  This contract was just used as a basic example of an NFT smart contract in order to have a contract to code against in the extension and should be replaced with an opensea compatible contract discussed below.

# Opensea

The next steps are to replace the interactions with the colors contract with an [opensea](https://opensea.io/) contract.  Opensea uses a concept called the [`TradeableERC721Token`](https://docs.opensea.io/docs/1-structuring-your-smart-contract#section-creature-erc-721-contract), which is eventually what will replace the `colors/` directory.

After following [these opensea tutorials](https://docs.opensea.io/docs/getting-started), I've found that we'll need a server to provide the metadata associated with the NFT.  In this case, it would just be the image key with the URL of the user's selected image, as seen in [this creature example](https://opensea-creatures-api.herokuapp.com/api/creature/1).  The smart contract would then point to the server endpoint in the [`baseTokenURI`](https://github.com/ProjectOpenSea/opensea-creatures/blob/a0db5ede13ffb2d43b3ebfc2c50f99968f0d1bbb/contracts/Creature.sol#L14)function of the smart contract, rather than opensea's test endpoint.

I'm still trying to decide if I want to use IPFS (opensea suggests [pinata](https://pinata.cloud/) if so), or a vanilla offering like API Gateway.

## Architecture
The open questions at the bottom of this section make this proposed architecture tentative.  It is subject to change depending on the answers to those.

### Client
If we go with the above solution, the idea is that the browser extension would do 1 thing:

    1. attempt to mint the NFT via our smart contract. Either:
        a. the image URL has never been minted before, in which case the client should send a request to our metadata server to put the image URL.
        b. the image URL has been minted, in which case we should redirect the user to the opensea listing for that image so they can attempt to buy it.

### Server
The server would be extremely simple, it would do 2 things:

    1. accept PUT requests for image URLs from the browser extension.
        a. if the URL hasn't been minted before, store it in a datastore.
        b. if the URL has been seen before return an error indicating that it's already been minted with the URL of the image on opensea so the client can be redirected.
    2. accept GET requests from opensea for the NFT metadata by [`tokenId`](https://github.com/ProjectOpenSea/opensea-creatures/blob/a0db5ede13ffb2d43b3ebfc2c50f99968f0d1bbb/contracts/TradeableERC721Token.sol#L33) (maybe our tokenId is a hash of the URL?  The color contract uses a byte array of the hex string, maybe a simple byte array of the URL would suffice?)


### Open Questions

* Who owns the token?  Ideally it should be us first, in order to do the secondary sales fee mentioned below, and we would gift the token to the user after taking initial ownership.
* How do we programmatically enact the [secondary sales fees specified here](https://docs.opensea.io/docs/10-setting-fees-on-secondary-sales)? This is the key to monetizing the extension.
* What happens when an image gets minted, but the upload to the API fails?  We should ideally have some kind of periodic process to list all of the images that have been minted, and add them to the metadata server if they're missing.  This means that it's important that the identifier we use for the image makes it easily retrievable so we can do something like this if necessary.