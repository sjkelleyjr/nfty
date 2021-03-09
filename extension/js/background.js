// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

//This file is used to interact with the chrome APIs from the extension.  The types of APIs
//you can access and how to do it can be found here: https://developer.chrome.com/extensions/api_index
//to access these from an extension, message passing is used between this file and the extension javascript.

//See this documentation for more information on message passing: https://developer.chrome.com/extensions/messaging
//Currently we've add the functionality to retrieve the user's email if they have sync turned on in Chrome, but we're
//console logging it for now.

const nfty = async (info) => {
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
       // send this to the listener in nfty.js, which will forward it on to the injected script to interact with the Ethereum wallet. 
	   chrome.tabs.sendMessage(tabs[0].id, { srcUrl: info.srcUrl }, (response) => {
	  	//shouldn't receive anything back, but in case we need to, here's how to do it.
	    console.log(response);
	  });
	});
};

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        title: 'Mint This Image',
        id: 'nfty', // this is used in the click handler to identify which menu item was clicked.
        contexts: ['all'],
    });
});


//receive messages from the content script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    //currently we're only handling tab navigation here, hence the undefined check.
    if (request.navUrl !== undefined) {
        chrome.tabs.create({url: request.navUrl})
    }
    //send an empty response for now.
    sendResponse()
  }
);


chrome.contextMenus.onClicked.addListener(function(info, tab) {
    //if the user selected nfty on an image.
    if (info.menuItemId === 'nfty' && info.mediaType === 'image') {
		nfty(info)
    }
});