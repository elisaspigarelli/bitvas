import { Controller } from './Controller.js';

class CombinedController extends Controller {
  constructor(model, view, tabView) {
    super(model, view, tabView);

    this.model.bindSettingPercentage(this.handleSettingPercentage)
    this.view.clickSlider(this.handleSliderPosition);
    this.model.bindBuildBlockTab(this.bindBuildBlockTab)
    this.model.bindOpenBlockTab(this.handleOpenBlockTab)
    this.model.bindChangeNeighbourView(this.handleChangeNeighbourView);
    this.tabView.bindClickMiners(this.handleClickMiners);
  }

  handleSettingPercentage = pct => {
    console.log("DayController - handleSettingPercentage: " + pct)
    this.view.setPercentage(pct);
  }

  handleSliderPosition = pct => {
    this.model.changeSliderPercentage(pct);
  }

  //handle TabView
  bindBuildBlockTab = (blocks) => {
    this.tabView.buildBlockTabs(blocks);
  }

  handleOpenBlockTab = (block) => {
    console.log("DayController - handleOpenBlockTab")
    this.tabView.clickButton(block.getBlockId);
  }

  handleClickMiners = (miner) => {
    console.log("DayController - handleClickMiners " + miner)
    this.tabView.changeLegendViewClicked(miner); 
    this.removeCanvas();
    this.handleChangeMode(1, miner);
  }


  //handle change view Neighbour
  handleChangeNeighbourView = (block) => { 
    this.removeCanvas();
    this.handleChangeMode(0, block.getBlockId);
  }
}

export { CombinedController };
