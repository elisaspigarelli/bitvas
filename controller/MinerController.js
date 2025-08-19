
import { Controller } from './Controller.js';

class MinerController extends Controller {
    constructor(model, view, tabView) {
        super(model, view, tabView);

        this.model.bindSettingPercentage(this.handleSettingPercentage)
        this.view.clickSlider(this.handleSliderPosition);
        this.model.bindBuildBlockTab(this.bindBuildBlockTab)
        this.model.bindOpenBlockTab(this.handleOpenBlockTab)
        this.tabView.bindClickMiners(this.handleClickMiners);

    }
  handleSettingPercentage = pct => {
    console.log("MinerController - handleSettingPercentage: " )
    this.view.setPercentage(pct);
  }

  handleSliderPosition = pct => {
    this.model.changeSliderPercentage(pct);
  }

//handle TabView
  bindBuildBlockTab = (blocks, miner) => {
    this.tabView.buildBlockTabs(blocks);
    this.tabView.changeLegendViewClicked(miner);
  }

  handleOpenBlockTab = (block) => {
    console.log("BlockController - handleOpenBlockTab")
    this.tabView.clickButton(block.getBlockId);
  }

  handleClickMiners = (miner) => {
    console.log("BlockController -handleClickMiners " + miner)
  //  this.tabView.changeLegendViewClicked(miner); 
    
    // cambiare il canvas
    this.removeCanvas();
    this.handleChangeMode(1, miner);
  }
}

export{MinerController}