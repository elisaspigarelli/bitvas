import { Model } from './Model.js';
import { Block } from '../object/Block.js';
import { ClusterBlock } from '../object/ClusterBlock.js';
import { BlockArrow } from '../object/BlockArrow.js';


class CombinedModel extends Model {
    constructor() {
        super();
        this.defaultPerc = 0.5;
    }

    changeSliderPercentage(pct) {
        this.perc = pct;
        this._settingPercentage();
        this.loadDataSlider();
    }

    bindOpenBlockTab(callback) {
        this.handleOpenBlockTab = callback
    }
    bindBuildBlockTab(callback) {
        this.handleBuildBlockTab = callback
    }
    bindChangeNeighbourView(callback) {
        this.handleChangeNeighbourView = callback
    }

    _settingPercentage() {
        //console.log("CombinedModel - _settingPercentage()")
        let blockId;
        if (this.perc == 0) {
            blockId = this.data[0]
        } else {
            let blockNumber = Math.round((this.data.length - 2) * this.perc)
            blockId = this.data[blockNumber + 1];
        }
        let perc = { perc: this.perc, number: blockId.getBlockTime }
        this.handleSettingPercentage(perc)
    }

    startVisualization(input) {
        console.log("CombinedModel - startVisualization");
        if (this.dataset.setDayDataset(input)) {
            this._getData(this.dataLoaded, this.dataset.getDayBlocks());
        } else {
            this.handlerDrawApplication();
        }
    }

    dataLoaded = (blocks) => {
        this.buildData(blocks);
        this.loadDataSlider();
    }

    buildData = blocks => {
        console.log("CombinedModel - buildData");
        this._resetData();
        for (var i = 0; i < blocks.length; i++) {
            let block = new Block(blocks[i]);

            if (Array.isArray(this.data)) {
                this.data.push(block);
            } else {
                this.data = [].concat(block);
            }
        }
        this.perc = this.defaultPerc;
        this._settingPercentage();
    }

    loadDataSlider = () => {
        console.log("CombinedModel - loadDataSlider: " + this.perc);
        let url_dataset = this.dataset.getDayPosition(this.perc);
        this._getData(this.buildDataToDraw, url_dataset);
    }

    buildDataToDraw = blocks => {
        console.log("CombinedModel - buildDataToDraw()");
        this._resetDataToDraw();

        if (blocks != null) {
            for (var i = 0; i < blocks.length; i++) {
                let block;
                if (blocks[i].type == 1) {
                    block = new Block(blocks[i]);

                    if (Array.isArray(this.blockTab)) {
                        this.blockTab.push(block);
                    } else {
                        this.blockTab = [].concat(block);
                    }

                } else if (blocks[i].type == 0) {
                    block = new ClusterBlock(blocks[i], i);
                }

                if (Array.isArray(this.dataToDraw)) {
                    this.dataToDraw.push(block);
                } else {
                    this.dataToDraw = [].concat(block);
                }
            }

            // build block arrows
            for (var i = 0; i < blocks.length; i++) {
                let transaction_in = blocks[i].transaction_in;
                //console.log(transaction_in)
                if (Array.isArray(transaction_in) && transaction_in.length) {
                    for (var j = 0; j < this.dataToDraw.length; j++) {
                        if (this.dataToDraw[j].getBlockId == blocks[i].id) {
                            let block_from;
                            let block_to;
                            let arrow;
                            let d;
                            block_to = this.dataToDraw[j];
                            for (var k = 0; k < transaction_in.length; k++) {
                                arrow = transaction_in[k];
                                for (var t = 0; t < j; t++) {
                                    if (this.dataToDraw[t].getBlockId == transaction_in[k].block_in) {
                                        block_from = this.dataToDraw[t];
                                        d = j - t;
                                    }
                                }

                                let trans_in = new BlockArrow(block_from, block_to, arrow, d);
                                // crea le transazioni nell'oggetto transaction
                                if (Array.isArray(this.transaction)) {
                                    this.transaction.push(trans_in);
                                } else {
                                    this.transaction = [].concat(trans_in);
                                }
                            }
                        }
                    }
                }
            }
        }

        //deve essere chiamato anche quando non ci sono dati altrimenti non si sposta lo slider
        this.handlerDrawApplication();
        this.handleBuildBlockTab(this.blockTab);
    }

    checkClick(coord) {
        //console.log("CombinedModel - checkClick")
        for (var i = 0; i < this.dataToDraw.length; i++) {
            if (this.dataToDraw[i].getClassName == 'Block' && this.dataToDraw[i].isInteraction(coord)) {
                //    console.log("click on Block : " + this.dataToDraw[i].getBlockId)
                this.handleChangeNeighbourView(this.dataToDraw[i]);
            }
        }
    }

    checkMouseMove(coord) {
        //console.log("CombinedModel - checkMouseMove")
        let find = false;
        for (var i = 0; i < this.dataToDraw.length; i++) {
            if (this.dataToDraw[i].getClassName == 'Block' && this.dataToDraw[i].isInteraction(coord)) {
                find = true;
            }
        }
        for (var i = 0; i < this.transaction.length; i++) {
            if (this.transaction[i].isInteraction(coord)) {
                find = true;
            }
        }
        this.handleMouseMove(find);
    }

    checkToolTip(coord) {
        //console.log("CombinedModel - ToolTip")
        let result = { find: false };
        for (var i = 0; i < this.transaction.length; i++) {
            if (this.transaction[i].isInteraction(coord)) {
                result.find = true;
                result.trans = this.transaction[i];
                result.mouseX = coord.x_real
                result.mouseY = coord.y_real
            }
        }
        this.handleDrawToolTip(result);
    }
}

export { CombinedModel }