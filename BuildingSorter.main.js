// ==UserScript==
// @name         Building Sorter
// @version      2.0
// @description  Allows you to sort the buildings in several different ways.
// @author       FrustratedProgrammer
// @include      /https?://orteil.dashnet.org/cookieclicker/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAKlBMVEWOOT9GUDHDv5BbGyqUbD7EaVf///+MjF5fMyB2Si08Fg5IHxMgDgr////9CbZGAAAADnRSTlP/////////////////AEXA3MgAAAFUSURBVHja7Jdtr4MgDIWBeaWl9f//3VtelosboCtbcpd45IPG9AHPKUbNNilzAb4CwFlqAHtrvXeeJwFmAnC7GfMzATDvAbzqwZ/1bDQmVtbrUqis16VQWa9LobJel0JlvS6Fyvorhe9LgU+pD2DoaMFa/DnAxqEjBCosIh55QB0tCGV6wAMAc2MkAKXjEBC4Mf4J4H58zMRx91EV464bzYtN9NRM7wOc6UJodGMFoHZ9ZSA2jNwBGvZDBpA0AHlRPu0CnucvAJAeknK7+njaBzCHhwH3R5B659ZVCKgByMqlXhSXoAZYa50dA/oe5BVY55UriB64NQNUHhAlwir1pEpBsks5yvyg6oOzndhbwX4zkMYD2X9ZiDoPEOV5MgA0mykC4vvyANDfzhkQCSPA4IVaAEKYBFAYAEK7PiySm+RYbkO6agFOfl08fmNcP57b9ivAAE0ItTfDUzdYAAAAAElFTkSuQmCC
// ==/UserScript==
/**
 Building Sorter. A program designed to sort the Cookie Clicker building list
 Copyright (C) 2021  Elijah Anderson<contact@frustratedprogrammer.com>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, version 3 of the License.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 **/

//This is a just passion project of mine. These are my ideas for how to improve. But without some donations or incredible recognition(I got 250 upvotes when I released my mod, that inspired me to release v2), I probably won't implement these. Feel free to make a PR I'll probably accept it.
//TODO:
// allow users to make MORE than 1 custom sorter.
//  - look into finding other ways to save their custom functions so my mod doesn't have a massive save file
//  - allow users to put a name & description for their custom sorters.
//  - allow users to export/import custom sorters
// implement color coding for the custom coder (so it's more like an IDE)
// allow dragging/dropping sorting option.
// implement adjustments to some sorters depending on whether the user is "selling" or "buying" (currently everything assumes you are buying)
// update next achievement and next upgrade, to exclude achievements/upgrades you already own. (Prestige or Selling can reproduce)

// CONSTANTS
const version = "2.0";
const uniqueCharacter = "ô"
const defaultCustomSorter = "return function(array){\n\treturn array.sort(function(building1,building2){\n\t\treturn building1.price - building2.price;//Sorts array by cheapest buildings.\n\t});\n}";
// ==SAVED SETTINGS==
let sorterType = 0;
let animateBuildings = true;
let disabled = false;
let showSorterChanger = true;
let showDirectionChanger = true;
let showOnlyCanAfford = true;
let customSorter = defaultCustomSorter;
// ==USER CHANGEABLE== (but not saved)
let forwardDirection = true;
let onlyCanAfford = false;
// ==OTHER==
let CookieMonsterEnabled = false;
let FrozenCookiesEnabled = false;
let sorterElement = null;
let changeables = null;
let ObjectsToSort = [];
let UpgradeTiers = {};
let buildingAchievementTiers = [0, 1, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
let products = null;
let sortersOptions = [
    {
        enabled: true,
        sorterFrom:"BuildingSorter",
        text: "Built In",
        description: "Sort's building's by their ID's number. This ranks them in order how they were designed to be displayed. This theoretically works with mods that adds new options so long as their ID is a number.",
        tooltip: {
            icon: [10, 0],
            title: "Built In",
            forwardDescription: "Orders the buildings based on their <b>built in</b> order.",
            reverseDescription: "Orders the buildings based on their <b>built in</b> order but backwards.",
            quote: "Classic Ortiel's List."
        },
        sort: function(array){
            array.sort((a, b) => a.id - b.id);
            return array;
        }
    },
    {
        enabled: true,
        sorterFrom:"BuildingSorter",
        text: "Amount",
        description: "Sort's building's by showing the buildings that you own less of towards the top.",
        tooltip: {
            icon: [10, 33],
            title: "Amount",
            forwardDescription: "Places the buildings you own the <b>least</b> of at the top.",
            reverseDescription: "Places the buildings you own the <b>most</b> of at the top.",
            quote: "Ever heard of something called, a Monopoly?"
        },
        sort: function(array){
            array.sort((a, b) => a.amount - b.amount);
            return array;
        }
    },
    {
        enabled: true,
        sorterFrom:"BuildingSorter",
        text: "Price",
        description: "Grabs each building's current price for buying only 1 of that building, then ranks them based on lowest price.",
        tooltip: {
            icon: [3, 5],
            title: "Price",
            forwardDescription: "Places the current cheapest building at the top.",
            reverseDescription: "Places the current costliest building at the top.",
            quote: "Where shall I spend this dough?"
        },
        sort: function(array){
            array.sort((a, b) => a.bulkPrice - b.bulkPrice);
            return array;
        }
    },
    {
        enabled: true,
        sorterFrom:"BuildingSorter",
        text: "CPS",
        description: "Grabs how much each building is producing in CPS, and ranks them based on which is currently producing the most.",
        tooltip: {
            icon: [21, 6],
            title: "CPS",
            forwardDescription: "Places buildings generating the highest <b>C</b>ookies <b>P</b>er <b>S</b>econd at the top.",
            reverseDescription: "Places buildings generating the lowest <b>C</b>ookies <b>P</b>er <b>S</b>econd at the top.",
            quote: "So YOU are my most valuable possession."
        },
        sort: function(array){
            array.sort((a, b) => a.storedTotalCps - b.storedTotalCps);
            return array;
        }
    },
    {
        enabled: true,
        sorterFrom:"BuildingSorter",
        text: "Next Achievement",
        description: "Calculates how many of each building you need to buy to unlock the next achievement, and ranks them from cheapest total cost of buying all said buildings",
        tooltip: {
            icon: [32, 33],
            title: "Next Achievement",
            forwardDescription: "Calculates how many buildings you need to buy to unlock the next achievement, and then places lowest total price at the top.",
            reverseDescription: "Calculates how many buildings you need to buy to unlock the next achievement, and then places highest total price at the top.",
            quote: "Achievement hunter. But it costs cookies."
        },
        sort: function(array){
            array.sort((a, b) => {
                let aTier = 0;
                let bTier = 0;
                let aRemainder = Infinity;
                let bRemainder = Infinity;
                for(let i = 0; i < buildingAchievementTiers.length; i++){
                    if(a.amount >= buildingAchievementTiers[i]) aTier = i;
                    if(b.amount >= buildingAchievementTiers[i]) bTier = i;
                }
                if(buildingAchievementTiers[aTier + 1]) aRemainder = buildingAchievementTiers[aTier + 1] - a.amount;
                if(buildingAchievementTiers[bTier + 1]) bRemainder = buildingAchievementTiers[bTier + 1] - b.amount;
                if(isFinite(aRemainder) && isFinite(bRemainder)){
                    return a.getSumPrice(aRemainder) - b.getSumPrice(bRemainder);
                }
                else return a.id - b.id;
            });
            return array;
        }
    },
    {
        enabled: true,
        sorterFrom:"BuildingSorter",
        text: "Next Upgrade",
        description: "Calculates how many of each building you need to buy to unlock the next upgrade, and ranks them from cheapest total cost of buying all said buildings",
        tooltip: {
            icon: [29, 7],
            title: "Next Upgrade",
            forwardDescription: "Calculates how many buildings you need to buy to unlock the next upgrade, and then places lowest total price at the top.",
            reverseDescription: "Calculates how many buildings you need to buy to unlock the next upgrade, and then places highest total price at the top.",
            quote: "Upgrades, people, upgrades.<br>-Phineas T. Ratched"
        },
        sort: function(array){
            array.sort((a, b) => {
                let aTier = UpgradeTiers[a.name];
                let bTier = UpgradeTiers[b.name];
                if(!aTier || !bTier) return 0;
                let aTierNextUnlock = 0;
                for(let i = 0; i < aTier.length; i++){
                    if(aTier[i] > a.amount){
                        aTierNextUnlock = aTier[i];
                        break;
                    }
                }

                let bTierNextUnlock = 0;
                for(let i = 0; i < bTier.length; i++){
                    if(bTier[i] > b.amount){
                        bTierNextUnlock = bTier[i];
                        break;
                    }
                }
                if(aTierNextUnlock === 0){
                    return bTierNextUnlock === 0 ? 0 : 1;
                }
                else if(bTierNextUnlock === 0) return -1;

                return (a.getSumPrice(aTierNextUnlock - a.amount)) - (b.getSumPrice(bTierNextUnlock - b.amount));
            });
            return array;
        }
    },
    {
        enabled: false,
        sorterFrom:"BuildingSorter",
        text: "Custom Sorter",
        description: "The custom sorter option that you can code yourself and then run.",
        tooltip: {
            icon: [0, 4],
            title: "Custom Sorter",
            forwardDescription: "Who knows what this does, <b>you</b> coded it.",
            reverseDescription: "Who knows what this does, <b>you</b> coded it. All I know is that reverse is enabled.",
            quote: "Are you sure you know what you are doing?"
        },
        sort: function(array){
            let toPassIn = Array.from(array);
            let customSorterFunction = new Function(customSorter)();
            let returnedArray = customSorterFunction(toPassIn);
            let toReturnBack = toPassIn;
            if(returnedArray instanceof Array){
                toReturnBack = returnedArray;
            }

            //Insert back any objects that might have been skipped.
            //No we cannot hide any Objects, the best you can do is make their display="none" and then set them at the bottom of the list.
            let ids = [];
            for(let i = 0; i < toReturnBack.length; i++){
                if(toReturnBack[i] && typeof toReturnBack[i] === "object" && typeof toReturnBack[i].id != "undefined"){
                    ids.push(toReturnBack[i].id);
                }
            }
            for(let i = 0; i < array.length; i++){
                if(!ids.includes(array[i].id)){
                    toReturnBack.push(array[i]);
                }
            }
            return toReturnBack;
        }
    },
    {
        enabled: false,
        sorterFrom:"CookieMonster",
        enabledIfMyModIsEnabled: false,
        text: "Payback Period",
        description: "Sort the display of buildings by CookieMonster's Payback Period",
        tooltip: {
            icon: [10, 28],
            title: "CookieMonster's Payback Period",
            forwardDescription: "Sort the display of buildings by CookieMonster's lowest <b>P</b>ayback <b>P</b>eriod.",
            reverseDescription: "Sort the display of buildings by CookieMonster's highest <b>P</b>ayback <b>P</b>eriod.",
            quote: "C is for cookie that's good enough for me.<br>-Cookie Monster"
        },
        sort: function(array){
            if(!CookieMonsterEnabled) return array;
            let objectToUse = CookieMonsterData.Objects1;
            if(Game.buyBulk === 10) objectToUse = CookieMonsterData.Objects10;
            if(Game.buyBulk === 100) objectToUse = CookieMonsterData.Objects100;
            array.sort((a, b) => {
                if(objectToUse[a.name] && objectToUse[b.name]) return objectToUse[a.name].pp - objectToUse[b.name].pp;
                else return 0;
            })
            return array;
        }
    },
    {
        enabled: false,
        sorterFrom:"FrozenCookies",
        enabledIfMyModIsEnabled: false,
        text: "Efficiency",
        description: "Sort the display of buildings by FrozenCookie's Efficiency recommendation.",
        tooltip: {
            icon: [10, 2],
            title: "FrozenCookie's Efficiency",
            forwardDescription: "Sort the display of buildings by FrozenCookie's most efficient recommendation.",
            reverseDescription: "Sort the display of buildings by FrozenCookie's worst efficient recommendation.",
            quote: "Cookie Dough tastes better Frozen. Hence FrozenCookies"
        },
        sort: function(array){
            if(!FrozenCookiesEnabled) return array;
            array.sort((a, b) => {
                if(FrozenCookies.caches.buildings[a.id] && FrozenCookies.caches.buildings[b.id]) return FrozenCookies.caches.buildings[a.id].efficiency - FrozenCookies.caches.buildings[b.id].efficiency;
                else return 0;
            })
            return array;
        }
    },
];
// ==Create CSS==
let CSSFILE = `
    #ModBuildingSorter_selectHolder{
        grid-row: 2 / 2;
        height: 22px;
        background: url(img/panelHorizontal.png?v=2) repeat-x center;
        background-size: cover;
    }
    #ModBuildingSorter_selectHolder span{
        z-index: 1000;
        text-shadow: 0px 1px 1px #360e00, 0px -1px 1px #360e00, 1px 0px 1px #360e00, -1px 0px 1px #360e00;
        font-weight: bold;
        color: #F6DAB8;
        opacity: 1;
        line-height: 22px;
        font-variant: small-caps;
    }
    #ModBuildingSorter_SettingsTitle{
        font-size: 22px;
        padding-left: 16px;
        margin-bottom: 8px;
        background: linear-gradient(to right,rgba(0,0,0,0.5),rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0));
    }
    #ModBuildingSorter_customPrompt{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999;
        background-color: rgba(0,0,0,0.5);
    }
    #ModBuildingSorter_actualPrompt{
        width: 50%;
        height: 50%;
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%,-50%);
        background-color: rgba(0,0,0,1);
    }
    #ModBuildingSorter_actualPrompt .option{
        font-size:135%;
    }
    #ModBuildingSorter_customPromptContent{
        width:100%;
        height:70%;
        margin:0;
        padding:0;
    }
    #ModBuildingSorter_customSorterCoderContainer{
        width: 100%;
        height: 100%;
        border: none;
        box-shadow: none;
        margin: 5px;
        text-shadow: none;
    }
    #ModBuildingSorter_customSorterCodeContainer{
        width: 100%;
        height: 90%;
        font-size: 20px;
        font-family: monospace;
        color: white;
        display: flex;
        box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.5) inset, 0px 1px 2px rgba(0,0,0,0.5) inset;
    }
    #ModBuildingSorter_code:hover, #ModBuildingSorter_code:focus{
        border:none;
        box-shadow: none; 
        outline:none;
    }
    #ModBuildingSorter_customSorterCoderLines{
        width: 20px;
        overflow: hidden;
        color: #0ebb07;
        border-radius: 10px 0 0 10px;
        margin:0;
    }
    #ModBuildingSorter_customSorterCoderLines, #ModBuildingSorter_code{
        background-color: #2b2b2b;
        height: -webkit-fill-available;
        resize: none;
        border: none;
        line-height: 16px;
        box-shadow: none;
    }
    #ModBuildingSorter_code{
        border-radius: 0 10px 10px 0;
        color: #d7e2e2;
        width: -webkit-fill-available;
        tab-size: 4;
        margin:0;
        margin-left: -1px;
    }
    .ModBuildingSorter_codeStyle{
        background-color: rgba(255,255,255,0.6);
        color: #33ff00;
        font-family: monospace;
        padding: 1px 3px;
        text-shadow: 1px 0.9px 3.1px #000;
    }
    .ModBuildingSorter_errorCodeStyle{
        background-color: rgba(255,255,255,0.6);
        color: #ffffff;
        font-family: monospace;
        padding: 1px 3px;
        text-shadow: 1px 0.9px 3.1px #000;
        float:left;
       
    }
    .ModBuildingSorter_unsaved{
        text-shadow: 1px 1px 1px #f00!important;
        color: #ff8989!important;
    }
    #ModBuildingSorter_HiddenUpdateLinker, #ModBuildingSorter_HiddenPatchLinker{
        display:none;
    }
`;
let head = document.getElementsByTagName("head")[0];
let style = document.createElement("style");
style.id = "ModBuildingSorter_CSS";
style.type = "text/css";
style.innerHTML = CSSFILE;
head.appendChild(style);

function incrementSorterType(){
    sorterType++;
    if(sorterType === sortersOptions.length) sorterType = 0;
    if(!sortersOptions[sorterType].enabled){
        incrementSorterType();
    }
    else{
        changeables.children[0].innerText = sortersOptions[sorterType].text;
        sort();
    }
}

function directionButtonTooltip(){
    return `<div style="padding:8px 4px;min-width:350px;">
            <div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;background-position:-${11 * 48}px -${10 * 48}px;"></div>
            <div class="name">Swaps Direction</div>
            <div class="tag" style="color:#fff;">[${forwardDirection ? "Forward" : "Reversed"}]</div>
            <div class="line"></div>
            <div class="description">Swaps order direction to reverse or natural. <b>Example:</b> <i>Cheapest</i> to <i>Costliest</i>, <i>Lowest</i> to <i>Highest</i>.</div>
        </div>
        <div class="line"></div>`;
}

function affordableButtonTooltip(){
    return `<div style="padding:8px 4px;min-width:350px;">
            <div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;background-position:-${17 * 48}px -${6 * 48}px;"></div>
            <div class="name">Affordable Only</div>
            <div class="tag" style="color:#fff;">[${showOnlyCanAfford ? "Enabled" : "Disabled"}]</div>
            <div class="line"></div>
            <div class="description">Sorts only buildings you can afford, putting buildings you can't afford later towards the end of the list.</div>
        </div>
        <div class="line"></div>`;
}

function createToolTip(){
    let tooltip = sortersOptions[sorterType].tooltip;
    return `
        <div style="padding:8px 4px;min-width:350px;">
            <div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;background-position:-${tooltip.icon[0] * 48}px -${tooltip.icon[1] * 48}px;"></div>
            <div class="name">${tooltip.title}</div>
            <div class="tag" style="color:#fff;">[${forwardDirection ? "Forward" : "Reversed"}]</div>
            <div class="line"></div>
            <div class="description">${forwardDirection ? tooltip.forwardDescription : tooltip.reverseDescription}<q>${tooltip.quote}</q></div>
        </div>
        <div class="line"></div>`;
}

function createUpgradeTiers(){
    let tiers = Object.values(Game.Tiers);
    for(let i = 0; i < tiers.length; i++){
        if(!tiers[i].upgrades || tiers[i].special) continue;
        for(let j = 0; j < tiers[i].upgrades.length; j++){
            let name = "";
            if(tiers[i].upgrades[j].buildingTie) name = tiers[i].upgrades[j].buildingTie.name;
            else if(Math.floor(tiers[i].upgrades[j].order) === 100) name = "Cursor";
            if(name.length === 0) continue;
            if(!UpgradeTiers[name]) UpgradeTiers[name] = [];
            UpgradeTiers[name].push(tiers[i].unlock);
        }
    }
}

function updateBuildingAnimations(){
    let timer = animateBuildings ? "0.5s" : "0ms";
    if(disabled) timer = "0ms";
    for(let i = 0; i < ObjectsToSort.length; i++){
        ObjectsToSort[i].l.style["-webkit-transition"] = `all ${timer} ease`;
        ObjectsToSort[i].l.style["-moz-transition"] = `all ${timer} ease`;
        ObjectsToSort[i].l.style["-o-transition"] = `all ${timer} ease`;
        ObjectsToSort[i].l.style["-ms-transition"] = `all ${timer} ease`;
    }
    products.style["-webkit-transition"] = `all ${timer} ease`;
    products.style["-moz-transition"] = `all ${timer} ease`;
    products.style["-o-transition"] = `all ${timer} ease`;
    products.style["-ms-transition"] = `all ${timer} ease`;
}

function sort(){
    if(disabled){
        ObjectsToSort = Object.values(Game.Objects);
        for(let i = 0; i < ObjectsToSort.length; i++){
            ObjectsToSort[i].l.style.top = "0px";
            ObjectsToSort[i].l.style.position = "inherit";
        }
        return;
    }
    if(!sortersOptions[sorterType].enabled){
        incrementSorterType();
    }
    Game.tooltip.update();
    ObjectsToSort = Object.values(Game.Objects);
    ObjectsToSort.sort((a, b) => a.id - b.id);
    if(onlyCanAfford){
        let arrayToSort1 = [];//Affordable
        let arrayToSort2 = [];//Unaffordable
        for(let i = 0; i < ObjectsToSort.length; i++){
            if(ObjectsToSort[i].bulkPrice <= Game.cookies){
                arrayToSort1.push(ObjectsToSort[i]);
            }
            else arrayToSort2.push(ObjectsToSort[i]);
        }
        arrayToSort1 = sortersOptions[sorterType].sort(arrayToSort1);
        arrayToSort2 = sortersOptions[sorterType].sort(arrayToSort2);
        if(!forwardDirection){
            arrayToSort1 = arrayToSort1.reverse();
            arrayToSort2 = arrayToSort2.reverse();
        }
        ObjectsToSort = arrayToSort1.concat(arrayToSort2);
    }
    else{
        ObjectsToSort = sortersOptions[sorterType].sort(ObjectsToSort);
        if(!forwardDirection){
            ObjectsToSort = ObjectsToSort.reverse();
        }
    }
    let skips = 0;
    if(!disabled) products.style.display = "block";
    for(let i = 0; i < ObjectsToSort.length; i++){
        let obj = ObjectsToSort[i].l;
        if(obj.classList.contains("toggledOff")){
            skips++;
            continue;
        }
        obj.style.top = (obj.clientHeight * ((i - skips) - ObjectsToSort[i].id)) + "px";
        obj.style.position = "relative";
    }
}

function updateSorterButtons(){
    if(!changeables) return;
    changeables.children[0].innerText = sortersOptions[sorterType].text;
    changeables.children[1].innerText = forwardDirection ? "▲" : "▼";
    changeables.children[2].style.color = onlyCanAfford ? "#59FF00" : "#FF0000";
    changeables.children[0].style.display = showSorterChanger ? "block" : "none";
    changeables.children[1].style.display = showDirectionChanger ? "block" : "none";
    changeables.children[2].style.display = showOnlyCanAfford ? "block" : "none";
    sorterElement.style.display = (!showSorterChanger && !showDirectionChanger && !showOnlyCanAfford) ? "none" : "block";
}

function addSorter(){
    if(sorterElement !== null){
        sorterElement.remove();
        sorterElement = null;
        changeables = null;
    }
    let selectHolder = document.createElement("div");
    sorterElement = selectHolder;
    selectHolder.id = "ModBuildingSorter_selectHolder";
    let text = document.createElement("span");
    selectHolder.appendChild(text);
    text.innerText = "Sort Buildings By:";
    changeables = document.createElement("div");
    changeables.style.display = "flex";
    changeables.style.float = "right";

    // the MAIN button          | Determines what sorting method to use.
    let sorterButton = document.createElement("a");
    sorterButton.style.width = "100px";
    sorterButton.style.whiteSpace = "nowrap";
    sorterButton.onclick = function(){
        incrementSorterType();
        sorterButton.innerText = sortersOptions[sorterType].text;

    };
    changeables.appendChild(sorterButton);
    Game.attachTooltip(sorterButton, createToolTip, "store");
    // the DIRECTION button     | Determines whether to reverse the order or not
    let sorterDirectionButton = document.createElement("a");
    sorterDirectionButton.onclick = function(){
        forwardDirection = !forwardDirection;
        sorterDirectionButton.innerText = forwardDirection ? "▲" : "▼";
        sort();
    };
    changeables.appendChild(sorterDirectionButton);
    Game.attachTooltip(sorterDirectionButton, directionButtonTooltip, "store");
    // the AFFORDABLE button    | Determines whether to only put items you can afford on top
    let affordableButton = document.createElement("a");
    affordableButton.innerText = "$";
    affordableButton.onclick = function(){
        onlyCanAfford = !onlyCanAfford;
        affordableButton.style.color = onlyCanAfford ? "#59FF00" : "#FF0000";
        sort();
    };
    Game.attachTooltip(affordableButton, affordableButtonTooltip, "store");
    changeables.appendChild(affordableButton);
    selectHolder.appendChild(changeables);

    //Attach and update.
    updateSorterButtons();
    sorterButton.classList.add("option");
    sorterDirectionButton.classList.add("option");
    affordableButton.classList.add("option");
    products.insertBefore(selectHolder, products.children[1]);


}

function createSettingsButton(Title, Description, append, onclick){
    append.appendChild(document.createElement("br"));
    let bttn = document.createElement("a");
    bttn.classList.add("option");
    bttn.innerText = Title;
    bttn.onclick = onclick;
    let label = document.createElement("label");
    label.innerText = Description;
    append.appendChild(bttn);
    append.appendChild(label);
}

function createCustomPrompt(title){
    let customPrompt = document.createElement("div");
    customPrompt.id = "ModBuildingSorter_customPrompt";
    let actualPrompt = document.createElement("div");
    actualPrompt.id = "ModBuildingSorter_actualPrompt";
    actualPrompt.classList.add("framed");
    customPrompt.appendChild(actualPrompt);
    let titleElem = document.createElement("div");
    titleElem.innerText = title;
    titleElem.style.textAlign = "center";
    titleElem.style.margin = "20px";
    titleElem.classList.add("title");
    actualPrompt.appendChild(titleElem);
    let content = document.createElement("div");
    content.id = "ModBuildingSorter_customPromptContent";
    actualPrompt.appendChild(content);
    l("game").appendChild(customPrompt);
    return {customPrompt, actualPrompt, content};
}

function popUpCustomSorterCoder(){
    if(l("ModBuildingSorter_customPrompt")) return;
    let prompt = createCustomPrompt("Create a Custom Sorter");
    Game.mods.BuildingSorter.prompt = prompt;
    let currentCodeIsValid = false;
    //GENERATING CODER
    let customSorterCoderContainer = document.createElement("div");
    customSorterCoderContainer.id = "ModBuildingSorter_customSorterCoderContainer";
    let text = document.createElement("span");
    text.innerHTML = "For some documentation ";
    let documentationClick = document.createElement("a");
    documentationClick.innerText = "hover here";
    Game.attachTooltip(documentationClick, function(){
        return `<div style="padding:8px 4px;min-width:350px;">
            <div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;background-position:-${32 * 48}px -${25 * 48}px;"></div>
            <div class="name">Documentation</div>
            <div class="tag" style="color:#fff;">[CustomSorter]</div>
            <div class="line"></div>
        </div>
            <div class="description">You need to return a <span class="ModBuildingSorter_codeStyle">function</span> that then either: <br>1. Returns an array<br>2. Modifies the passed in array.<br>(if no array is returned in your function, it assumes you modified the array and uses the array it passed in)<br><br>Any items <i>missing</i> from the array will be appended at the end of the sorted array. The returned function will be called with an <span class="ModBuildingSorter_codeStyle">array</span> passed in that contains all the building objects. This array will be first sorted by their ID's before being passed in.<br><br>You should also know that <span class="ModBuildingSorter_codeStyle">Game</span> is a global variable that is the entire Cookie Clicker game. From this you have access to other mods, your cookies, cps, the current mod, etc.<br><br><small>Your code actually gets ran so you might want to test on another save, because you can delete/edit/add anything on the current save.</small></div>
        <div class="line"></div>`;
    }, "left");
    text.appendChild(documentationClick);
    let codeContainer = document.createElement("div");
    codeContainer.id = "ModBuildingSorter_customSorterCodeContainer";
    let lines = document.createElement("textarea");
    lines.id = "ModBuildingSorter_customSorterCoderLines";
    lines.disabled = true;
    lines.spellcheck = false;
    let code = document.createElement("textarea");
    code.id = "ModBuildingSorter_code";
    code.value = customSorter;
    code.spellcheck = false;
    codeContainer.appendChild(lines);
    codeContainer.appendChild(code);
    code.onscroll = function(e){
        lines.scrollTop = code.scrollTop;
    };
    code.oninput = function(){
        let split = code.value.split("\n");
        let linesTxt = "";
        for(let i = 0; i < split.length; i++){
            linesTxt += (i + 1) + "\n";
        }
        //REMOVE ô from the code, it cannot exist in the customSorter due to it being my unique character. Chances of it ever being used is down to nil. If there is ever a complaint, it might change.
        while(code.value.indexOf(uniqueCharacter) !== -1){
            code.value = code.value.substring(0,code.value.indexOf(uniqueCharacter)) + code.value.substring(code.value.indexOf(uniqueCharacter)+1, code.value.length);
        }
        lines.value = linesTxt;
        currentCodeIsValid = false;
        save.classList.add("ModBuildingSorter_unsaved");
    };
    code.onkeydown = function(e){
        if(e.key == "Tab"){
            e.preventDefault();
            let start = this.selectionStart;
            let end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = this.value.substring(0, start) +
                "\t" + this.value.substring(end);

            // put caret at right position again
            this.selectionStart =
                this.selectionEnd = start + 1;
            this.oninput();
        }
    };
    let otherContent = document.createElement("div");
    otherContent.appendChild(text);
    otherContent.style.height = "10%";
    customSorterCoderContainer.appendChild(otherContent);
    customSorterCoderContainer.appendChild(codeContainer);
    prompt.content.appendChild(customSorterCoderContainer);

    //CLOSE THE CODER
    let close = document.createElement("a");
    close.classList.add("option");
    close.innerText = "Close";
    close.onclick = function(){
        if(customSorter.trim() != code.value.trim()){
            Game.Prompt("<h3>Closing without saving</h3><div class=\"block\">Do you REALLY want to close without saving?<br><small>You will lose your code and revert to what was stored before.</small></div>", [["Close anyways.", "Game.ClosePrompt();Game.mods.BuildingSorter.prompt.customPrompt.remove();"], "Go Back!"]);
        }
        else prompt.customPrompt.remove();
    };

    //SAVE THE CODE
    let save = document.createElement("a");
    save.classList.add("option");
    save.innerText = "Save";
    save.onclick = function(){
        //I embed user's code INSIDE a function. Thier code has to have a "return function(){}" at somepoint or else I tell them it's invalid.
        let codeToRun = "console.log(\"Testing the file with user's code.\");\nfunction _ModBuildingSorter_testUsersFunction(){\n//============================\n\n" + code.value + "\n\n//============================\n}\n_ModBuildingSorter_testUsersFunction()";
        let result;
        let error = false;
        let success = false;
        try{
            result = window.eval(codeToRun);//Why would I need to do window.eval instead of eval? Because userscript managers seem to override eval.
            if(typeof result !== "function"){
                Game.Notify("Error", `A function is required to be passed back. The type of the item that was passed back is: <span class='ModBuildingSorter_codeStyle'>${typeof result}</span>`, [32, 29], false);
            }
            else{
                result = result(Object.values(Game.Objects).sort((a, b) => a.id - b.id));
                success = true;
            }
        }
        catch(e){
            error = true;
            result = e;
        }
        finally{
            let throwResult = false;
            //another try/catch. In case we can't display the error in a tidy message for the user.
            try{
                if(error){
                    throwResult = true;
                    let getColRow = result.stack.split("\n")[1].split("<anonymous>:")[1];
                    if(getColRow && getColRow.length > 2){
                        let column = parseInt(getColRow[2], 10) - 1;
                        let row = parseInt(getColRow[0], 10) - 1;
                        let lineOfCode = codeToRun.split("\n")[row];
                        let spaces = "                                                  ^";
                        if(lineOfCode.length > 30){
                            let start = lineOfCode.substring(0, column);
                            let end = lineOfCode.substring(column, lineOfCode.length);
                            if(start.length > 15){
                                start = start.substring(start.length - end.length, start.length);
                            }
                            if(end.length > 15){
                                end = end.substring(0, 30 - start.length);
                            }
                            lineOfCode = start + end;
                        }
                        else spaces = spaces.substring(spaces.length - (column + 1), spaces.length);
                        Game.Prompt(`<h3>An wild ERROR has appeared</h3><div class="block"><span>${result.message}</span><br><pre class="ModBuildingSorter_codeStyle" style="text-align: left">${lineOfCode}<br>${spaces}</pre><br><small>Error on Line: <span class="ModBuildingSorter_codeStyle">${getColRow[0]}:${getColRow[2]}</span>.</small></div>`, [["Close", "Game.ClosePrompt();"]]);
                    }
                    else{
                        //WEIRDLY SyntaxErrors do not contain the line the error is located. I am forced to tell the user to try another website for debugging. I will not code an entire debugger just for this.
                        Game.Prompt(`<h3>An wild ERROR has appeared</h3><div class="block"><span class="ModBuildingSorter_errorCodeStyle">${result.message}</span><br><br><span>Normally, with errors, I can point to what line the error is located. Unfortunately I am limited when it comes to this error.</span><br><small>Try <a target="_blank" href="https://extendsclass.com/javascript-fiddle.html">this website</a>.</small></div>`, [["Close", "Game.ClosePrompt();"]]);
                    }
                }
                if(success){
                    save.classList.remove("ModBuildingSorter_unsaved");
                    Game.Notify("Success", `Successfully tested & saved your code.`, [22, 30], true);
                    customSorter = code.value;
                    Game.saveModData();
                }
            }
            catch(e){
                Game.Notify("Error", `${error ? "There is some errors in your code. Usually we help you by displaying your code's error message, but that crashed. Instead check the console for the errors." : "Something went wrong with saving. We don't know what happened. Check the console for the errors."}`, [32, 29], false);
                if(throwResult){
                    console.error("ERROR inside user's code:");
                    console.error(result);
                    console.error("\nERROR that prevented error message from displaying:");
                }
                throw e;
            }
            if(throwResult){//Needed to put it OUTSIDE the try/catch so this INTENTIONAL throw, doesn't trigger the catch
                console.error("ERROR inside user's code:");
                throw result;
            }
        }
    };
    prompt.actualPrompt.appendChild(close);
    prompt.actualPrompt.appendChild(save);
    code.oninput();
    save.classList.remove("ModBuildingSorter_unsaved");
}

function addSettings(){
    let settings = l("buildingSorterSettings");
    if(settings) return;
    let menu = l("menu");
    if(!menu) return;
    if(!menu.children[1]) return;
    if(!menu.children[1].innerHTML.toString().toLowerCase().includes("options")) return;
    let settingsHolder = menu.children[2];
    if(!settingsHolder) return;
    else settings = document.createElement("div");
    settings.id = "buildingSorterSettings";
    settings.classList.add("subsection");
    let settingsTitle = document.createElement("div");
    let buttonsHolder = document.createElement("div");
    buttonsHolder.classList = "listing";
    settingsTitle.classList.add("title");
    settingsTitle.id = "ModBuildingSorter_SettingsTitle";
    settingsTitle.innerText = "Buildings Sorter";
    settings.appendChild(settingsTitle);
    let description = document.createElement("div");
    description.classList.add("listing");
    for(let i = 0; i < sortersOptions.length; i++){
        if(!CookieMonsterEnabled && sortersOptions[i].sorterFrom === "CookieMonster") continue;
        if(!FrozenCookiesEnabled && sortersOptions[i].sorterFrom === "FrozenCookies") continue;
        if(i !== 0){
            description.appendChild(document.createElement("br"));
            description.appendChild(document.createElement("br"));
        }
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = sortersOptions[i].enabled;
        description.appendChild(checkbox);
        let bolded = document.createElement("b");
        bolded.style.opacity = sortersOptions[i].enabled ? "1" : "0.5";
        bolded.innerText = sortersOptions[i].text;
        description.appendChild(bolded);
        if(sortersOptions[i].text === "Custom Sorter"){
            let customSorterButton = document.createElement("a");
            customSorterButton.classList.add("option");
            customSorterButton.innerText = "Edit";
            customSorterButton.onclick = function(){
                popUpCustomSorterCoder();
            };
            description.appendChild(customSorterButton);
        }
        let label = document.createElement("label");
        label.innerText = sortersOptions[i].description;
        label.style.opacity = sortersOptions[i].enabled ? "0.5" : "0.25";
        description.appendChild(label);
        checkbox.oninput = function(){
            sortersOptions[i].enabled = this.checked;
            if(this.checked === false){
                let atLeastOneEnabled = false;
                for(let j = 0; j < sortersOptions.length; j++){
                    if(sortersOptions[j].enabled){
                        atLeastOneEnabled = true;
                        break;
                    }
                }
                if(!atLeastOneEnabled){
                    sortersOptions[i].enabled = true;
                    this.checked = true;
                    Game.Notify("Can't do that.", `You have to have at least ONE sorter enabled at all times. If you'd like to disable the sorter, the Building Sorter settings page has a DISABLE MOD option.`, [1, 7], false);
                }
            }
            if(!sortersOptions[i].enabled && sorterType === i){
                incrementSorterType();
            }
            bolded.style.opacity = sortersOptions[i].enabled ? "1" : "0.5";
            label.style.opacity = sortersOptions[i].enabled ? "0.5" : "0.25";
        };
    }
    settings.appendChild(description);
    createSettingsButton(showSorterChanger ? "Showing Sorter" : "Hiding Sorter", "Whether to show/hide the sorter option on the sidebar for quick adjustments.", buttonsHolder, function(){
        showSorterChanger = !showSorterChanger;
        this.innerText = showSorterChanger ? "Showing Sorter" : "Hiding Sorter";
        updateSorterButtons();
    });
    createSettingsButton(showDirectionChanger ? "Showing Directional" : "Hiding Directional", "Whether to show/hide the directional option on the sidebar for quick adjustments.", buttonsHolder, function(){
        showDirectionChanger = !showDirectionChanger;
        this.innerText = showDirectionChanger ? "Showing Directional" : "Hiding Directional";
        updateSorterButtons();
    });
    createSettingsButton(showOnlyCanAfford ? "Showing Affordable" : "Hiding Affordable", "Whether to show/hide the affordable option on the sidebar for quick adjustments.", buttonsHolder, function(){
        showOnlyCanAfford = !showOnlyCanAfford;
        this.innerText = showOnlyCanAfford ? "Showing Affordable" : "Hiding Affordable";
        updateSorterButtons();
    });
    createSettingsButton(animateBuildings ? "Animating Buildings" : "Instant Buildings", "Whether the buildings smoothly move when sorting options change or update.", buttonsHolder, function(){
        animateBuildings = !animateBuildings;
        this.innerText = animateBuildings ? "Animating Buildings" : "Instant Buildings";
        updateBuildingAnimations();
    });
    createSettingsButton(disabled ? "Mod Disabled" : "Mod Enabled", "Temporarily disable the mod, this allows other mods to sort the list instead. Example: Cookie Monster", buttonsHolder, function(){
        disabled = !disabled;
        this.innerText = disabled ? "Mod Disabled" : "Mod Enabled";
        products.style.display = "grid";//CookieMonster requires this. I'd rather not break a well known mod. But shame it doesn't update this itself.
        sorterElement.style.display = disabled ? "none" : "flex";
        updateBuildingAnimations();
        sort();
    });
    createSettingsButton(BuildingSorter.CheckForUpdates ? "Allow check for updates" : "Stay offline", "Whether to check if the mod has some updates or not.", buttonsHolder, function(){
        BuildingSorter.CheckForUpdates = !BuildingSorter.CheckForUpdates;
        this.innerText = BuildingSorter.CheckForUpdates ? "Check for updates" : "Stay offline";
    });
    settings.append(buttonsHolder);
/**ADD SETTINGS**/
//BEFORE CookieMonster's settings though, they have a massive list of settings.
//AND due to CookieMonster way of allowing user to close groups, any settings placed after their settings gets screwed up every redraw
    if(l("cookieMonsterFrameworkMenuSection")){
        settingsHolder.insertBefore(settings, l("cookieMonsterFrameworkMenuSection"));
    }
    else if(l("cookieMonsterModMenuSection")){
        settingsHolder.insertBefore(settings, l("cookieMonsterModMenuSection"));
    }
    else{
        settingsHolder.insertBefore(settings, settingsHolder.lastElementChild);
    }
}

function updateNoPatchNote(oldVersion, newVersion){
    setTimeout(function(){//wait 30 secs before showing. To not overflow the notification bar.
        if(version.toLowerCase() === newVersion.toLowerCase()){//Show what changed since last time
            Game.Notify("Updated Building Sorter", `The mod 'Building Sorter' loaded from <span class="ModBuildingSorter_codeStyle">v${oldVersion}</span> to <span class="ModBuildingSorter_codeStyle">v${version}</span>. Patchnotes failed to load, but you can check them out <a target="_blank" href="https://frustrated-programmer.github.io/BuildingSorter/patchnotes.md">here</a>.`, [0.25, 0.25, "http://orteil.dashnet.org/cookieclicker/img/factory.png"], false);
        }
        else{
            if(version.toLowerCase() === newVersion.toLowerCase()){//Advise the user to upgrade.
                Game.Notify("Update Building Sorter", `The mod 'Building Sorter' is currently <span class="ModBuildingSorter_codeStyle">v${version}</span>, the newest version is <span class="ModBuildingSorter_codeStyle">v${newVersion}</span>. You can upgrade <a target="_blank" href="https://github.com/Frustrated-Programmer/BuildingSorter">here</a>`, [0.25, 0.25, "http://orteil.dashnet.org/cookieclicker/img/factory.png"], false);
            }
        }
    }, 10000);
}

function updateWithPatchNote(oldVersion, newVersion, patchnotes){
    let patchnote = patchnotes[newVersion];
    if(!patchnote){
        updateNoPatchNote(newVersion);
        return;
    }
    Game.mods.BuildingSorter.showPatchNotes = function(){
        if(version.toLowerCase() === newVersion.toLowerCase()){//Show patchnotes
            Game.Prompt(`<h3>Updated Version ${newVersion}</h3><div class="block">${patchnote.html}</div><a target="_blank" href="https://frustrated-programmer.github.io/BuildingSorter/patchnotes.md" id="ModBuildingSorter_HiddenPatchLinker"></a>`, [["Ignore for now.", "Game.ClosePrompt();"], ["See More", "l('ModBuildingSorter_HiddenPatchLinker').click()"]]);
        }
        else{//recommend user updates.
            Game.Prompt(`<h3>Update Version ${newVersion}</h3><div class="block">${patchnote.html}</div><a target="_blank" href="https://github.com/Frustrated-Programmer/BuildingSorter" id="ModBuildingSorter_HiddenUpdateLinker"></a>`, [["Ignore for now.", "Game.ClosePrompt();"], ["Update", "l('ModBuildingSorter_HiddenUpdateLinker').click()"]]);
        }
    };
    setTimeout(function(){//wait 30 secs before showing. To not overflow the notification bar.
        if(version.toLowerCase() === newVersion.toLowerCase()){//Show patchnotes
            Game.Notify("Updated Building Sorter", `The mod 'Building Sorter' updated from <span class="ModBuildingSorter_codeStyle">v${oldVersion}</span> the newest version is <span class="ModBuildingSorter_codeStyle">v${newVersion}</span>.<a style="float:right;" onclick="Game.mods.BuildingSorter.showPatchNotes();==CLOSETHIS()==">Whats new?</a>`, [0.25, 0.25, "http://orteil.dashnet.org/cookieclicker/img/factory.png"], false);
        }
        else{//recommend user updates.
            Game.Notify("Update Building Sorter", `The mod 'Building Sorter' is currently <span class="ModBuildingSorter_codeStyle">v${version}</span> the newest version is <span class="ModBuildingSorter_codeStyle">v${newVersion}</span>.<a style="float:right;" onclick="Game.mods.BuildingSorter.showPatchNotes();==CLOSETHIS()==">Whats new?</a>`, [0.25, 0.25, "http://orteil.dashnet.org/cookieclicker/img/factory.png"], false);
        }
    }, 10000);
}

const BuildingSorter = {
    CheckForUpdates: 1,
    DisableNotif: 0,
    showPatchNotes: null,
    prompt: null,
    init: function(){
        Game.registerHook("logic", function(value){
            addSettings();
            sort();
            return value;
        });
        products = l("products");
        ObjectsToSort = Object.values(Game.Objects);
        createUpgradeTiers();
        updateBuildingAnimations();
        addSorter();
        sort();
    },

    save: function(){
        let enabled = ``;
        for(let i = 0; i < sortersOptions.length; i++){
            enabled += (sortersOptions[i].enabled || sortersOptions[i].enabledIfMyModIsEnabled) ? `1` : `0`;
        }
        return `${version}ô${sorterType}ô${animateBuildings ? 1 : 0}${showSorterChanger ? 1 : 0}${showDirectionChanger ? 1 : 0}${showOnlyCanAfford ? 1 : 0}${this.DisableNotif === 1 ? 1 : 0}${this.CheckForUpdates === 1 ? 1 : 0}ô${enabled}ô${customSorter === defaultCustomSorter ? "" : customSorter}`;
    },
    load: function(str){
        /** HOW MY CODE HAS SAVED STUFF. Now documented because it was a pain to track this down.
            1.0
             - save split by |
             - sorterType, animateBuildings, showSorterChange, showDirectionChange, showOnlyCanAfford,
            1.2
             - save split by |
             - sorterType, animateBuildings, showSorterChange, showDirectionChange, showOnlyCanAfford, disableNotif
            1.3
             - save split by |
             - sorterType, animateBuildings, showSorterChange, showDirectionChange, showOnlyCanAfford, disableNotif, checkForUpdates, version
            2.0
             - save split by ô
             - version, sorterType, BITFIELD-1, BITFIELD-2, customSorter
                - BITFIELD-1 = animateBuildings, showSorterChanger, showDirectionChanger, showOnlyCanAfford, this.DisableNotif, this.CheckForUpdates
                - BITFIELD-2 = Sorter_BuiltIn.enabled, Sorter_Amount.enabled, Sorter_Price.enabled, Sorter_CPS.enabled, Sorter_NextAchievement.enabled, Sorter_NextUpgrade.enabled, Sorter_Custom.enabled, Sorter_CookieMonsterPaybackPeriod.enabled, Sorter_FrozenCookiesEfficiency.enabled
         */
        let loadedVersion = ""
        let arr = str.split("ô");
        if(arr.length === 1){//Version 1.3 or below.
            arr = str.split("|");
            if(arr[0] && !isNaN(arr[0])){
                sorterType = parseInt(arr[0], 10) || 0;
                loadedVersion = "1.0";
            }
            if(arr[1] && !isNaN(arr[1])) animateBuildings = parseInt(arr[1], 10) === 1;
            if(arr[2] && !isNaN(arr[2])) showSorterChanger = parseInt(arr[2], 10) === 1;
            if(arr[3] && !isNaN(arr[3])) showDirectionChanger = parseInt(arr[3], 10) === 1;
            if(arr[4] && !isNaN(arr[4])) showOnlyCanAfford = parseInt(arr[4], 10) === 1;
            if(arr[5] && !isNaN(arr[5])){
                this.DisableNotif = parseInt(arr[5], 10);
                loadedVersion = "1.2";
            }
            if(arr[6] && !isNaN(arr[6])) {
                this.CheckForUpdates = parseInt(arr[6], 10);
                loadedVersion = "1.3";
            }
        }
        else{//Version 2 or higher
            if(arr[0]) loadedVersion = arr[0];
            if(arr[1]) sorterType = parseInt(arr[1], 10) || 0;
            if(arr[2]){
                let booleans = arr[2].split("");
                if(booleans[0]) animateBuildings = parseInt(booleans[0], 10) === 1;
                if(booleans[1]) showSorterChanger = parseInt(booleans[1], 10) === 1;
                if(booleans[2]) showDirectionChanger = parseInt(booleans[2], 10) === 1;
                if(booleans[3]) showOnlyCanAfford = parseInt(booleans[3], 10) === 1;
                if(booleans[4]) this.DisableNotif = parseInt(booleans[4], 10) === 1 ? 1 : 0;
                if(booleans[5]) this.CheckForUpdates = parseInt(booleans[5], 10) === 1 ? 1 : 0;
            }
            if(arr[3]){
                let enabled = arr[3].split("");
                for(let i = 0; i < enabled.length; i++){
                    if(sortersOptions[i]){
                        if(sortersOptions[i].sorterFrom === "CookieMonster") sortersOptions[i].enabledIfMyModIsEnabled = (parseInt(enabled[i], 10) === 1);
                        if(sortersOptions[i].sorterFrom === "FrozenCookies") sortersOptions[i].enabledIfMyModIsEnabled = (parseInt(enabled[i], 10) === 1);
                        else sortersOptions[i].enabled = (parseInt(enabled[i], 10) === 1);
                    }
                }
            }
            if(arr[4]){
                customSorter = arr[4];
            }
        }
        if(sorterType < 0) sorterType = 0;
        if(sorterType >= sortersOptions.length) sorterType = 0;
        if(isNaN(sorterType)) sorterType = 0;
        updateSorterButtons();
        updateBuildingAnimations();
        sort();
        if(this.DisableNotif === 0) Game.Notify("Building Sorter", `The mod 'Building Sorter' has loaded v${version} successfully, check the settings for more info about how the mod sorts.<a style="float:right;" onclick="Game.mods.BuildingSorter.DisableNotif=1;==CLOSETHIS()==">Don't show this again</a>`, [0.25, 0.25, "http://orteil.dashnet.org/cookieclicker/img/factory.png"], false);
        else Game.Notify("Building Sorter", `The mod 'Building Sorter' has loaded v${version} successfully`, [0.25, 0.25, "http://orteil.dashnet.org/cookieclicker/img/factory.png"], true);
        if(this.CheckForUpdates === 1){
            fetch("https://frustrated-programmer.github.io/BuildingSorter/version.txt").then(function(versionResponse){
                versionResponse.json().then(function(versionJsonResult){
                    if(loadedVersion.toLowerCase() !== `${versionJsonResult}`){
                        let patchNoteFail = function(e){
                            console.error(e);
                            updateNoPatchNote(loadedVersion, versionJsonResult.toString());
                        };
                        fetch("https://frustrated-programmer.github.io/BuildingSorter/patchnotes.json").then(function(patchNotesResponse){
                            patchNotesResponse.json().then(function(patchNoteJsonResponse){
                                updateWithPatchNote(loadedVersion, `${versionJsonResult}`, patchNoteJsonResponse);
                            }).catch(patchNoteFail);
                        }).catch(patchNoteFail);
                    }
                }).catch(console.error);
            }).catch(console.error);
        }
    }
};

const readyCheck = setInterval(() => {
    const theGame = unsafeWindow.Game || Game || window.Game;
    if(typeof theGame !== "undefined" && typeof theGame.ready !== "undefined" && theGame.ready){
        theGame.registerMod("BuildingSorter", BuildingSorter);
        clearInterval(readyCheck);

        //Check for external mods after 1s, 5s, 10s, 30s, 60s since mod was loaded.
        let timers = [1000,4000,5000,20000,30000];
        function checkForExternalMods(timerChecker){
            if(!timers[timerChecker]) return;
            setTimeout(function(){
                //Check for CookieMonster
                if(!CookieMonsterEnabled && !!(theGame && theGame.mods && theGame.mods.CookieMonster && CookieMonsterData && CookieMonsterData.Objects1 && CookieMonsterData.Objects10 && CookieMonsterData.Objects100)){
                    CookieMonsterEnabled = true;
                    for(let i = 0; i < sortersOptions.length; i++){
                        if(sortersOptions[i].sorterFrom === "CookieMonster") {
                            sortersOptions[i].enabled = sortersOptions[i].enabledIfMyModIsEnabled;
                            break;
                        }
                    }
                }
                //Check for FrozenCookies
                if(!FrozenCookiesEnabled && !!(theGame && theGame.mods && theGame.mods["Frozen Cookies mtarnuhal "] && FrozenCookies && FrozenCookies.caches && FrozenCookies.caches.buildings)){
                    FrozenCookiesEnabled = true;
                    for(let i = 0; i < sortersOptions.length; i++){
                        if(sortersOptions[i].sorterFrom === "FrozenCookies") {
                            sortersOptions[i].enabled = sortersOptions[i].enabledIfMyModIsEnabled;
                            break;
                        }
                    }
                }
                //Check to see if we should check again.
                if(!(FrozenCookiesEnabled && CookieMonsterEnabled)){
                    checkForExternalMods(timerChecker+1);
                }
            },timers[timerChecker]);
        }
        checkForExternalMods(0);
    }
}, 1000);
