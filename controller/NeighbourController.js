import { Controller } from './Controller.js';

class NeighbourController extends Controller {
    constructor(model, view, tabView) {
        super(model, view, tabView);
         
    this.model.bindSettingPercentage(this.handleSettingPercentage)
    this.model.bindBuildBlockTab(this.bindBuildBlockTab)
    this.model.bindOpenBlockTab(this.handleOpenBlockTab)
    this.view.clickSlider(this.handleSliderPosition);
    }

    handleSettingPercentage = pct => {
        console.log("NeighbourController - handleSettingPercentage: " + pct)
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
        console.log("NeighbourController - handleOpenBlockTab")
        this.tabView.clickButton(block.getBlockId);
      }

}

export{NeighbourController}