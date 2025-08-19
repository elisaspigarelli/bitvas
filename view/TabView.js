import { LegendTab } from "./LegendTab.js";
import { BlockTab } from "./BlockTab.js";
import { TransTab } from "./TransTab.js";

class TabView {

    constructor() {
        this.tabWrap = document.getElementById("myTabs");
       // this._reset();

    }
    _reset() {
        this.blockTabs = [];
        this.transTab = null;
        while (this.tabWrap.firstChild) {
            this.tabWrap.firstChild.remove();
        }
        this.tabHeader = document.createElement("div");
        this.tabHeader.className = "tabHeader";
        this.tabWrap.appendChild(this.tabHeader)
        this._buildLegendTab();
    }
    
    bindClickMiners(callback){  
        this.handlerClickMiners = callback
    }

    changeLegendViewClicked(miner){
         this.legendTab.clickMiner(miner)
    }

    _buildLegendTab() {
        console.log("TabView - _buildLegendTab")
        this.legendTab = new LegendTab(this.handlerClickMiners);
        this.tabHeader.appendChild(this.legendTab.getButton);
        this.tabWrap.appendChild(this.legendTab.getPanel);
        this._addClickButton(this.legendTab.getButton);
        this.legendTab.show();
    }

    buildBlockTabs(blocks) {
        this._reset();
        if (Array.isArray(blocks)) {
            for (let i = 0; i < blocks.length; i++) {
                let block = blocks[i]
                let blockTab = new BlockTab(block);
                this.tabHeader.appendChild(blockTab.getButton);
                this.tabWrap.appendChild(blockTab.getPanel);
                this._addClickButton(blockTab.getButton);

                if (Array.isArray(this.blockTabs)) {
                    this.blockTabs.push(blockTab)
                } else {
                    this.blockTabs = [].concat(blockTab);
                }
            }
        } else if (blocks != null) {
            let blockTab = new BlockTab(blocks);
            this.tabHeader.appendChild(blockTab.getButton);
            this.tabWrap.appendChild(blockTab.getPanel);
            this._addClickButton(blockTab.getButton);
            this.blockTabs = [].concat(blockTab);
        }
    }

    buildTransTab(trans) {
        this._reset();
        this.transTab = new TransTab(trans);
        this.tabHeader.appendChild(this.transTab.getButton);
        this.tabWrap.appendChild(this.transTab.getPanel);
        this._addClickButton(this.transTab.getButton);
    }

    clickButton(id) {
        this.legendTab.hide();
        if (this.blockTabs.length != 0) {
            this.blockTabs.forEach(tab => { tab.hide() });
        }
        if (this.transTab != null) {
            this.transTab.hide();
        }

        if (this.legendTab.getButton.id == id) {
            this.legendTab.show();
        } else if (this.blockTabs.length != 0) {
            for (let i = 0; i < this.blockTabs.length; i++) {
                if (this.blockTabs[i].getButton.id == id) {
                    this.blockTabs[i].show();
                }
            }
        } else {
            if (this.transTab.getButton.id == id) {
                this.transTab.show();
            }
        }
    }

    _addClickButton(button) {
        button.addEventListener('click', (e) => {
            //console.log("click on btn " + button.id)
            e.preventDefault()
            this.clickButton(button.id);
        })
    }

}

export { TabView }