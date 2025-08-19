import { Dataset } from './Dataset.js';

class Model {
  constructor() {
    this.XMLHttpRequest = XMLHttpRequest;
    this.data = [];
    this.dataToDraw = [];
    this.transaction = [];
    this.blockTab = [];
    this.dataset= new Dataset();
  }

  _resetData() {
    this.data = [];
  }
  _resetDataToDraw() {
    this.dataToDraw = [];
    this.transaction = [];
    this.blockTab = [];
  }
  get getDataToDraw() {
    //console.log(this.dataToDraw)
    return this.dataToDraw;
  }
  get getTransaction() {
    //console.log(this.transaction)
    return this.transaction;
  }

  bindLoadingData(callback) { // da rimuovere?
    this.handlerLoadingData = callback
  }
  
  bindSettingPercentage(callback) {
    this.handleSettingPercentage = callback
}
  bindToolTip(callback) {
    this.handleDrawToolTip = callback
  }

  bindDrawApplication(callback) {
    this.handlerDrawApplication = callback
  }

  bindMouseMove(callback) {
    this.handleMouseMove = callback
  }

  _getData(callback, url) {
    var request = new this.XMLHttpRequest;
    request.onload = function onLoad(e) {
      var dataset = JSON.parse(e.currentTarget.responseText);
      callback(dataset);
    }
    request.open('GET', url, true);
    request.send();
  }

}

export { Model };