import { Controller } from './Controller.js';


class TransactionController extends Controller{
    constructor(model, view, tabView) {
      super(model,view, tabView);

      this.model.bindBuildTransTab(this.bindBuildTransTab)
      this.model.bindOpenTransTab(this.handleOpenTransTab)
      this.model.bindSettingPercentage(this.handleSettingPercentage) 
      this.view.clickSlider(this.handleSliderPosition);
    }
 
    bindBuildTransTab = (trans) => {
      console.log("TransactionController - bindBuildTransTab")
      this.tabView.buildTransTab(trans);
    }
    handleOpenTransTab = (trans) => {
      console.log("TransactionController - handleOpenBlockTab")
      this.tabView.clickButton(trans.trans_name);
    }
    
    handleSettingPercentage = pct => {
      console.log("TransactionController - handleSettingPercentage" )
      this.view.setPercentage(pct);
    }

    handleSliderPosition = pct => {
      this.model.changeSliderPercentage(pct);
    }

  }
  
  export { TransactionController };
  