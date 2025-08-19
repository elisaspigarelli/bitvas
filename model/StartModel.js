import { Model } from './Model.js';
import { Block } from '../object/Block.js';
import { ClusterBlock } from '../object/ClusterBlock.js';
import { BlockArrow } from '../object/BlockArrow.js';


class StartModel extends Model {
    constructor() {
        super();
        this.defaultPerc = 0.5;
        this._startModel();
    }
    
    bindDrawApplication(callback) {
        this.handlerDrawApplication = callback
    }

    _startModel() {
        console.log("StartModel - _startModel ");
        let url_dataset = this.dataset.getStartVisualization();
        this._getData(this.buildDataToDraw, url_dataset);
    }
    buildDataToDraw = blocks => {
        console.log("StartModel - buildDataToDraw()");
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
        this.handlerDrawApplication();
    }
}

export { StartModel }
