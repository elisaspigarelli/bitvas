import { StartView } from "./view/StartView.js";
import { StartModel } from "./model/StartModel.js";
import { TabView } from './view/TabView.js';
import { CombinedModel } from './model/CombinedModel.js';
import { TransactionModel } from './model/TransactionModel.js';
import { NeighbourModel } from './model/NeighbourModel.js';
import { MinerModel } from './model/MinerModel.js';

import { CombinedView } from './view/CombinedView.js';
import { TransactionView } from './view/TransactionView.js';
import { NeighbourView } from './view/NeighbourView.js';
import { MinerView } from './view/MinerView.js';
import { CombinedController } from './controller/CombinedController.js';
import { TransactionController } from './controller/TransactionController.js';
import { NeighbourController } from './controller/NeighbourController.js';
import { MinerController } from './controller/MinerController.js';

// Start Application
class StartApplication {

    constructor(startView, startModel) {
        this.startView = startView;
        this.startModel= startModel;
        this.startView.clickButton(this.handleStartApplication);
        this.startModel.bindDrawApplication(this.bindDrawApplication)
        this.controller = null;
    }

    handleStartApplication = (btn, input) => {
        console.log("StartApplication- startApplication: " + input);
        if (this.controller != null) {
            this.controller.removeCanvas();
        }
        let model;
        let view;
        let tabView
        if (btn == 0) {
            //CombinedMode
            model = new CombinedModel();
            view = new CombinedView();
            tabView = new TabView();
            this.controller = new CombinedController(model, view, tabView);
            this.controller.bindChangeMode(this.handleChangeMode)
        } else if (btn == 1) {
            // control whitch input is insert
            if (this._checkInput(input)) {
                //TransactionMode
                model = new TransactionModel();
                view = new TransactionView();
                tabView = new TabView();
                this.controller = new TransactionController(model, view, tabView);
            } else {
                //NeighbourMode
                model = new NeighbourModel(input);
                view = new NeighbourView();
                tabView = new TabView();
                this.controller = new NeighbourController(model, view, tabView);
            }
        }
        
        this.controller.startVisualization(input);
    }

    handleChangeMode = (type, id) => {
        let model;
        let view;
        let tabView;
        if (type == 0) {
            //NeighbourMode
            model = new NeighbourModel(id);
            view = new NeighbourView(id);
            tabView = new TabView();
            this.controller = new NeighbourController(model, view, tabView);
        } else if (type == 1) {
            //MinerMode
            model = new MinerModel(id);
            view = new MinerView(id);
            tabView = new TabView();
            this.controller = new MinerController(model, view, tabView);
            this.controller.bindChangeMode(this.handleChangeMode)
        }
        this.controller.startVisualization(id);
    }

    _checkInput(input) {
        let view;
        if (input.length <= 14 || input.substring(0, 14) == '00000000000000') {
            view = false;
        } else {
            view = true;
        }
        return view
    }

    bindDrawApplication = () => {
        this.startView.drawStarting(this.startModel.getDataToDraw,this.startModel.getTransaction);
    }
}

let startView = new StartView();
let startModel = new StartModel();
let application = new StartApplication(startView, startModel);

