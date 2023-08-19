// ==UserScript==
// @name         ChatRewindScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A userscript for character.ai that let user to copy their own messages and paste it to the textarea.
// @author       KozaCode
// @match        https://beta.character.ai/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var container;
    var textarea;
    var style = document.createElement("style");
    style.innerHTML = `
    .copy-button-container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex:1
    }
    .copy-button{
        background-color: #2c2f33;
        border: none;
        color: white;
        padding: 5px 10px;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .copy-button:active{
        background-color: #23272a;
    }
    `;
    document.head.appendChild(style);

    function pastetToTextarea(text){
        console.log(text)
        textarea = document.querySelector("#user-input");
        if (!textarea) {
            console.log("Textarea not found");
            return;
        }
        textarea.focus();
        textarea.click();
        document.execCommand('insertText', false, text);
        //execCommand is deprecated but other methods are not working


        textarea.style.height = textarea.scrollHeight + "px";
    };

    function checkForNewMessages() {
        container = document.querySelector(".inner-scroll-view");
        if (!container) {
            console.log("Container not found");
            return;
        }

        var messages = container.childNodes;
        if (messages.length == 0) {
            return;
        }
        messages.forEach(function(message) {
            if (message.querySelector(".d-flex") || message.querySelector(".copy-button-container")) {
                return;
            } else {
                addCopyButton(message);
            }
        });
    }
    function addCopyButton(message) {
        var div = document.createElement("div");
        div.className = "copy-button-container";
        var button = document.createElement("button");
        button.innerHTML = "Copy";
        button.className = "copy-button";
        button.onclick = function() {
            var messageText = message.getElementsByTagName("p");
            messageText = Array.from(messageText).map(function(p) {
                return p.innerHTML;
            }).join("\n\n");
            console.log(messageText);
            messageText = messageText.replaceAll("<em>", "*");
            messageText = messageText.replaceAll("</em>", "*");
            navigator.clipboard.writeText(messageText);
            pastetToTextarea(messageText);
        }

        
        div.appendChild(button);
        message.appendChild(div);
    }
    setInterval(function(){
        checkForNewMessages();
    }, 1000);
})();