# NOTE

This README isn't being updated anymore, look at the commit messages instead.  I thought some people would be collaborating on this with me, so I made a point of keeping it up to date for their sake.  So far, no one has forked or submitted PRs, so I'm going to assume no one else is contributing until I hear otherwise.  Therefore, the README is left stale as is for now.



This repo contains the development of the nfty browser extension.  Currently it interacts with [the opensea-creatures test NFT contract that I forked](https://github.com/sjkelleyjr/opensea-creatures) in order to have something to code against.  As such, discussion of that smart contract can be found in this README.

# extension/
The `extension/` directory, which houses the code for the browser extension.

As it stands now, this is [minting a new image NFT](./extension/js/script.js#L65) every time the "Mint This Image" menu item is selected.

# opensea-creatures/
The `opensea-creatures/` directory which houses the NFT smart contract that the browser extension currently interacts with on the Rinkeby testnet.  This code was taken from the [opensea creatures tutorial](https://docs.opensea.io/docs/getting-started) with a [one-line change to allow anyone to mint tokens rather than just the owner of the contract](https://github.com/sjkelleyjr/opensea-creatures/commit/041de6430f80f439ba965fee769a1f469281c0e9) (myself in this case). 

You can see the minted creatures on the [opensea testnet UI for this particular collection](https://testnets.opensea.io/collection/opensea-creatures-u2wptl6ke2).

Along with the smart contract, it also contains some node.js scripts to interact with the smart contract as an example of how it's done.  This contract was just used as a basic example of an NFT smart contract in order to have a contract to code against in the extension and should be replaced with an opensea compatible contract specific to our use case.

# Opensea
After following [the opensea tutorials](https://docs.opensea.io/docs/getting-started), I've found that we'll need a server to provide the metadata associated with the NFT.  In this case, it would just be the image key with the URL of the user's selected image, as seen in [this creature example](https://opensea-creatures-api.herokuapp.com/api/creature/1).  The smart contract would then point to the server endpoint in the [`baseTokenURI`](https://github.com/ProjectOpenSea/opensea-creatures/blob/a0db5ede13ffb2d43b3ebfc2c50f99968f0d1bbb/contracts/Creature.sol#L14)function of the smart contract, rather than opensea's test endpoint.

I'm still trying to decide if I want to use IPFS (opensea suggests [pinata](https://pinata.cloud/) if so), or a vanilla offering like API Gateway.

This [GitHub issue opened in the opensea-js repo](https://github.com/ProjectOpenSea/opensea-js/issues/66) is a good overview of what we're trying to achieve, the question is, how do we do it?

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


# Q/A

* Who owns the token?  Ideally it should be us first, in order to do the secondary sales fee mentioned below, and we would gift the token to the user after taking initial ownership.
    - We own the collection and the smart contract, but we will "_mintTo" the user, meaning they'll own the NFT.
* How do we programmatically enact the [secondary sales fees specified here](https://docs.opensea.io/docs/10-setting-fees-on-secondary-sales)? This is the key to monetizing the extension.
    - there is no way to programmatically do this as far as I know.
* What happens when an image gets minted, but the upload to the API fails?  We should ideally have some kind of periodic process to list all of the images that have been minted, and add them to the metadata server if they're missing.  This means that it's important that the identifier we use for the image makes it easily retrievable so we can do something like this if necessary.