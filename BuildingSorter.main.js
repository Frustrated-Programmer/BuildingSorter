// ==UserScript==
// @name         Building Sorter
// @version      1.0
// @description  Allows you to sort the buildings in several different ways.
// @author       FrustratedProgrammer
// @include      /https?://orteil.dashnet.org/cookieclicker/
// @icon         data:image/png;base64,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
// ==/UserScript==
/**
 Building Sorter. A program designed sort the building list
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
// ==SAVED SETTINGS==
let sorterType = 0;
let animateBuildings = true;
let disabled = false;
let showSorterChanger = true;
let showDirectionChanger = true;
let showOnlyCanAfford = true;
// ==USER CHANGEABLE== (but not saved)
let forwardDirection = true;
let onlyCanAfford = false;
// ==OTHER==
let sorterElement = null;
let changeables = null;
let ObjectsToSort = [];
let UpgradeTiers = {};
let buildingAchievementTiers = [0, 1, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600];
let products = null;
//TODO: possibly add more sorting options? It's very easy, but idk what's another method of sorting.
let sortersOptions = [
    {
        text: "Built In",
        tooltip: {
            icon: [10, 0],
            title: "Built In",
            forwardDescription: "Orders the buildings based on their <b>built in</b> order.",
            reverseDescription: "Orders the buildings based on their <b>built in</b> order but backwards.",
            quote: "Classic Ortiel's List."
        },
        sort: function(array){
            array.sort(function(a, b){
                if(forwardDirection) return a.id - b.id;
                else return b.id - a.id;
            });
        }
    },
    {
        text: "Price",
        tooltip: {
            icon: [3, 5],
            title: "Price",
            forwardDescription: "Places the current cheapest building at the top.",
            reverseDescription: "Places the current costliest building at the top.",
            quote: "Where shall I spend this dough?"
        },
        sort: function(array){
            if(forwardDirection) array.sort((a, b) => a.price - b.price);
            else array.sort((a, b) => b.price - a.price);
        }
    },
    {
        text: "CPS",
        tooltip: {
            icon: [21, 6],
            title: "CPS",
            forwardDescription: "Places buildings generating the highest <b>C</b>ookies <b>P</b>er <b>S</b>econd at the top.",
            reverseDescription: "Places buildings generating the lowest <b>C</b>ookies <b>P</b>er <b>S</b>econd at the top.",
            quote: "So YOU are my most valuable possession."
        },
        sort: function(array){
            if(!forwardDirection) array.sort((a, b) => a.storedTotalCps - b.storedTotalCps);
            else array.sort((a, b) => b.storedTotalCps - a.storedTotalCps);
        }
    },
    {
        text: "Next Achievement",
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
                if(forwardDirection){
                    if(isFinite(aRemainder) && isFinite(bRemainder)){
                        return a.getSumPrice(aRemainder) - b.getSumPrice(bRemainder);
                    }
                    else return a.id - b.id;
                }
                else{
                    if(isFinite(aRemainder) && isFinite(bRemainder)){
                        return b.getSumPrice(aRemainder) - a.getSumPrice(bRemainder);
                    }
                    else return b.id - a.id;
                }
            });
        }
    },
    {
        text: "Next Upgrade",
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
                //GET NEXT ATIER UNLOCK
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
        }
    },
];

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
    if(disabled) return;
    Game.tooltip.update();
    ObjectsToSort = Object.values(Game.Objects);
    ObjectsToSort.sort((a, b) => a.id - b.id);
    if(onlyCanAfford){
        let arrayToSort1 = [];//Affordable
        let arrayToSort2 = [];//Unaffordable
        for(let i = 0; i < ObjectsToSort.length; i++){
            if(ObjectsToSort[i].price <= Game.cookies){
                arrayToSort1.push(ObjectsToSort[i]);
            }
            else arrayToSort2.push(ObjectsToSort[i]);
        }
        sortersOptions[sorterType].sort(arrayToSort1);
        sortersOptions[sorterType].sort(arrayToSort2);
        ObjectsToSort = arrayToSort1.concat(arrayToSort2);
    }
    else{
        sortersOptions[sorterType].sort(ObjectsToSort);
    }
    let skips = 0;
    if(!disabled) products.style.display = "block";
    for(let i = 0; i < ObjectsToSort.length; i++){
        let obj = ObjectsToSort[i].l;

        if(obj.classList.contains("toggledOff")){
            skips++;
            continue;
        }
        if(disabled){
            obj.style.top = 0;
            obj.style.position = "";
        }
        else{
            obj.style.top = (obj.clientHeight * ((i - skips) - ObjectsToSort[i].id)) + "px";
            obj.style.position = "relative";
        }
    }
}

function applyFancyCss(bttn){
    bttn.classList.add("option");
    return;
    bttn.style.border = "1px solid #e2dd48";
    bttn.style.borderColor = ["#ECE2B6", "#875526", "#733726", "#DFBC9A"];
    bttn.style.borderRadius = "2px";
    bttn.style.margin = 0;
    bttn.style.padding = 0;
    bttn.style.whiteSpace = "nowrap";
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
    selectHolder.style.gridRow = "2 / 2";
    selectHolder.style.height = "22px";
    selectHolder.style.background = "url(img/panelHorizontal.png?v=2) repeat-x center";
    selectHolder.style.backgroundSize = "cover";
    let text = document.createElement("span");
    text.style.zIndex = 1000;
    text.style.textShadow = ["0px 1px 1px #360e00", "0px -1px 1px #360e00", "1px 0px 1px #360e00", "-1px 0px 1px #360e00"];
    text.style.fontWeight = "bold";
    text.style.color = "#F6DAB8";
    text.style.opacity = 1;
    text.style.lineHeight = "22px";
    text.style.fontVariant = "small-caps";
    selectHolder.appendChild(text);
    text.innerText = "Sort Buildings By:";
    changeables = document.createElement("div");
    changeables.style.display = "flex";
    changeables.style.float = "right";

    // the MAIN button          | Determines what sorting method to use.
    let sorterButton = document.createElement("a");
    sorterButton.style.width = "100px";
    sorterButton.onclick = function(){
        sorterType++;
        if(sorterType === sortersOptions.length) sorterType = 0;
        sorterButton.innerText = sortersOptions[sorterType].text;
        sort();

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
    applyFancyCss(sorterButton);
    applyFancyCss(sorterDirectionButton);
    applyFancyCss(affordableButton);
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

function addSettings(){
    let settings = l("buildingSorterSettings");
    if(settings) return;
    if(!l("menu")) return;
    let settingsHolder = l("menu").children[2];
    if(!settingsHolder) return;
    else settings = document.createElement("div");
    settings.id = "buildingSorterSettings";
    settings.classList.add("subsection");
    let settingsTitle = document.createElement("div");
    let buttonsHolder = document.createElement("div");
    buttonsHolder.classList = "listing";
    settingsTitle.classList.add("title");
    settingsTitle.style.fontSize = "22px";
    settingsTitle.style.paddingLeft = "16px";
    settingsTitle.style.marginBottom = "8px";
    settingsTitle.style.background = "linear-gradient(to right,rgba(0,0,0,0.5),rgba(0,0,0,0),rgba(0,0,0,0),rgba(0,0,0,0));";
    settingsTitle.innerText = "Buildings Sorter";
    settings.appendChild(settingsTitle);
    let description = document.createElement("div");
    description.classList.add("listing");
    description.innerHTML = `<b style="opacity:1">Built In: </b><label>Sort's building's by their ID's number. This ranks them in order how they were designed to be displayed. This theoretically works with mods that adds new options so long as their <i>ID</i> is a number.</label><br><br>
<b style="opacity:1">Price: </b><label>Grabs each building's current price for buying only 1 of that building, then ranks them based on lowest price.</label><br><br>
<b style="opacity:1">CPS: </b><label>Grabs how much each building is producing in CPS, and ranks them based on which is currently producing the most.</label><br><br>
<b style="opacity:1">Next Achievement: </b><label>Calculates how many of each building you need to buy to unlock the next <i>achievement</i>, and ranks them from cheapest total cost of buying all said buildings</label><br><br>
<b style="opacity:1">Next Upgrade: </b><label>Calculates how many of each building you need to buy to unlock the next <i>upgrade</i>, and ranks them from cheapest total cost of buying all said buildings</label>`;
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
    createSettingsButton(disabled ? "Disabled" : "Enabled", "Whether to temporarily disable the mod, this allows other mods to sort the list instead. Example: Cookie Clicker", buttonsHolder, function(){
        disabled = !disabled;
        this.innerText = disabled ? "Disabled" : "Enabled";
        sort();
        products.style.display = "grid";//CookieMonster requires this. I'd rather not break a well known mod. But shame it doesn't update this itself.
        sorterElement.style.display = disabled ? "none" : "flex";
    });
    settings.append(buttonsHolder);
    //ADD SETTINGS
    //BEFORE cookieMonster's settings though, they have a massive list of settings.
    if(l("cookieMonsterFrameworkMenuSection")){
        settingsHolder.insertBefore(settings, l("cookieMonsterFrameworkMenuSection"));
    }
    else{
        settingsHolder.insertBefore(settings, settingsHolder.lastElementChild);
    }
}

const BuildingSorter = {
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
        Game.Notify("Building Sorter", "The mod 'Building Sorter' has loaded successfully, check the settings for more info about how the mod sorts.", [0.25, 0.25, "http://orteil.dashnet.org/cookieclicker/img/factory.png"], false);
    },

    save: function(){
        return `${sorterType}|${animateBuildings ? 1 : 0}|${showSorterChanger ? 1 : 0}|${showDirectionChanger ? 1 : 0}|${showOnlyCanAfford ? 1 : 0}`;
    },

    load: function(str){
        let arr = str.split("|");
        if(arr[0]) sorterType = parseInt(arr[0], 10) || 0;
        if(arr[1]) animateBuildings = parseInt(arr[1], 10) === 1;
        if(arr[2]) showSorterChanger = parseInt(arr[2], 10) === 1;
        if(arr[3]) showDirectionChanger = parseInt(arr[3], 10) === 1;
        if(arr[4]) showOnlyCanAfford = parseInt(arr[3], 10) === 1;
        if(sorterType < 0) sorterType = 0;
        if(sorterType >= sortersOptions.length) sorterType = 0;
        if(isNaN(sorterType)) sorterType = 0;
        updateSorterButtons();
        updateBuildingAnimations();
        sort();
        if(changeables) changeables.children[0].innerText = sortersOptions[sorterType].text;
    }
};

const readyCheck = setInterval(() => {
    const Game = unsafeWindow.Game;
    if(typeof Game !== "undefined" && typeof Game.ready !== "undefined" && Game.ready){
        Game.registerMod("BuildingSorter", BuildingSorter);
        clearInterval(readyCheck);
    }
}, 1000);
