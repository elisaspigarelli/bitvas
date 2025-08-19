
class Controller {
  constructor(model, view, tabView) {
    this.model = model;
    this.view = view;
    this.tabView= tabView;

    // binding with handler
    this.model.bindDrawApplication(this.bindDrawApplication)
    this.view.toolTip(this.handlerToolTip);
    this.model.bindToolTip(this.handleDrawToolTip)
    this.view.resizeWindow(); 
    this.view.clickCanvas(this.handleClickCanvas);
    this.model.bindMouseMove(this.handleMouseMove)
    this.view.mouseMoveCanvas(this.handleMouseMoveCanvas);
  }

  //handler per change Mode
  bindChangeMode(callback) {
    this.handleChangeMode = callback
  }

  startVisualization(input) {
    this.model.startVisualization(input);
  }

  handleClickCanvas = (coord) => { 
    this.model.checkClick(coord);
  }
  handleMouseMoveCanvas = (coord) => { 
    this.model.checkMouseMove(coord);
  }

  handleMouseMove = (cursor) => {
    this.view.mouseMove(cursor);
  }
  
  bindDrawApplication = (input) => {
    console.log("Controller - bindDrawApplication")
    this.view.drawCanvas(this.model.getDataToDraw, this.model.getTransaction,input);
  }

  handlerToolTip = (coord) => { 
    this.model.checkToolTip(coord);
  }

  handleDrawToolTip = (toolTip) => {
    this.view.drawToolTip(toolTip);
  }

  removeCanvas = () =>{
    this.view.removeCanvas();
  }


}

export { Controller };
