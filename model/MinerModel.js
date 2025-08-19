import { Model } from './Model.js';
import { Block } from '../object/Block.js';
import { ClusterBlock } from '../object/ClusterBlock.js';
import { PreviousBlock } from '../object/PreviousBlock.js';
import { FollowingBlock } from '../object/FollowingBlock.js';
import { BlockArrow } from '../object/BlockArrow.js';



class MinerModel extends Model {
    constructor(miner) {
        super();
        this.miner = miner;
        this.defaultPerc = 0.5;
        this.default_max_numb = 9;
    }

    startVisualization(){
        console.log("MinerModel - startVisualization");
        if(this.dataset.setMinerDataset(this.miner)){
            this._loadDataset();
        } else {
            this.handlerDrawApplication();
        }
    }
    _returnCentralBlock() {
        let blockId;
        if (this.perc == 0) {
            if (this.data[0].getClassName == 'Block') {
                blockId = this.data[0]
            } else {
                blockId = this.data[1]
            }
        } else {
            let blockNumber = Math.round((this.data.length - 2) * this.perc)
            if (this.data[blockNumber].getClassName == 'Block') {
                blockId = this.data[blockNumber];
            } else if (blockNumber != this.data.length - 1) {
                blockId = this.data[blockNumber + 1];
            } else {
                blockId = this.data[blockNumber - 1];
            }
        }
        return blockId;
    }

    _settingPercentage() {
        //console.log("MinerModel - _settingPercentage()")
        let blockId = this._returnCentralBlock();
        let perc = { perc: this.perc, number: blockId.getBlockTime }
        this.handleSettingPercentage(perc)
    }

    changeSliderPercentage(pct) {
        this.perc = pct;
        this._settingPercentage()
        this.buildDataToDraw();
    }

    //binding
    bindOpenBlockTab(callback) {
        this.handleOpenBlockTab = callback
    }
    bindBuildBlockTab(callback) {
        this.handleBuildBlockTab = callback
    }

    //retreive data
    _loadDataset = () => {
        this._getData(this.dataLoaded, this.dataset.getMinerDataset())
    }

    loadTransaction() {
        console.log("MinerModel - loadTransaction")
        this._getData(this.buildTransactions, this.dataset.getMinerDataset());
    }

    dataLoaded = (blocks) => {
        this.buildData(blocks);
        this.buildDataToDraw();
    }

    buildData = blocks => {
        console.log("MinerModel - buildData");
        this._resetData();
        if (Array.isArray(blocks) && blocks.length) {
            for (var i = 0; i < blocks.length; i++) {
                let block;
                if (blocks[i].type == 1) {
                    block = new Block(blocks[i]);
                } else if (blocks[i].type == 0) {
                    block = new ClusterBlock(blocks[i], i);
                }

                if (Array.isArray(this.data)) {
                    this.data.push(block);
                } else {
                    this.data = [].concat(block);
                }
            }
            this.perc = this.defaultPerc;
            this._settingPercentage()
        }

    }

    buildDataToDraw = () => {
        console.log("MinerModel - buildDataToDraw")
        this._resetDataToDraw();
        this.max_numb=this.default_max_numb;
        if (Array.isArray(this.data) && this.data.length) {
            let centralBlock = this._returnCentralBlock();
            //console.log(centralBlock)
            let index = 0;
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].getClassName == 'Block' && this.data[i].getBlockId == centralBlock.getBlockId) {
                    index = i;
                }
            }

            let start_input = 0;
            let add_max_numb = 0;
            //trovare l'indice di partenza in modo che central block sia centrale se possibile, altrimenti riempire cmq tutte le posizioni
            if (index > Math.floor(this.max_numb / 2) && (this.data.length - 1) - index > Math.floor(this.max_numb / 2)) {
                start_input = index - Math.floor(this.max_numb / 2)
                /* if (start_input == 1 && this.data[0].getClassName == 'ClusterBlock') {
                     start_input = 0
                     add_max_numb = 1;
                 }*/
            } else if (index <= Math.floor(this.max_numb / 2)) {
                start_input = 0;
                /*if (this.data[0].getClassName == 'ClusterBlock') {
                    add_max_numb = 1;
                }
*/
            } else if ((this.data.length - 1) - index <= Math.floor(this.max_numb / 2)) {
                /*if (this.data[this.data.length - 1].getClassName == 'ClusterBlock') {
                    start_input = (this.data.length -1) - this.max_numb
                } else if (this.data[this.data.length - 1].getClassName == 'Block') {*/
                start_input = (this.data.length) - this.max_numb
                //}
            }
            let starting = start_input;
            if (start_input != 0) {
                let previuos = new PreviousBlock();
                this.dataToDraw.push(previuos);
                //rimuovi il primo se clusterBlock
                if (this.data[start_input].getClassName == 'ClusterBlock') {
                    starting++
                }
            }
            //caso particolare in cui ci sono 3 blocchi a sx del blocco centrale
            if (start_input == 0 && this.data[start_input].getClassName == 'ClusterBlock') {
                let count = 0;
                let central_block_position = 0;
                for (var i = 0; i <= this.data.length && count < Math.floor(this.max_numb / 2) + 1; i++) {
                    if (this.data[i].getClassName == "Block") {
                        central_block_position = i;
                        count = count + 1;
                    } else if (this.data[i].getClassName == "ClusterBlock") {
                        count = count + 1;
                    }
                }
                console.log(count)
                console.log(central_block_position)
                if(central_block_position==3){
                    this.max_numb=this.default_max_numb-1;
                }
            }

            for (var i = starting; i < start_input + this.max_numb + add_max_numb; i++) {
                if (this.data[i].getClassName == 'Block') {
                    this.blockTab.push(this.data[i])
                }
                //non attacca l'ultimo se clusterBlock
                if (i != start_input + this.max_numb + add_max_numb - 1 || this.data[i].getClassName != 'ClusterBlock') {
                    this.dataToDraw.push(this.data[i]);
                }
            }

            if (start_input + this.max_numb == this.data.length && this.data[this.data.length - 1].getClassName == 'ClusterBlock') { //rimane fuori l'ultimo blocco
                this.dataToDraw.push(this.data[this.data.length - 1]);
            }
            if (this.dataToDraw[this.dataToDraw.length - 1] != this.data[this.data.length - 1]) {
                let following = new FollowingBlock();
                this.dataToDraw.push(following);
            }
        }
        this.loadTransaction();
    }

    buildTransactions = (blocks) => {
        // build block arrows
        this.transaction = [];
        if (Array.isArray(blocks) && blocks.length) {
            for (var i = 0; i < blocks.length; i++) {
                if (blocks[i].type == 1) {
                    for (var j = 0; j < this.dataToDraw.length; j++) {
                        if (this.dataToDraw[j].getBlockId == blocks[i].id) {
                            let block_to = this.dataToDraw[j];
                            let transaction_in = blocks[i].transaction_in;
                            if (Array.isArray(transaction_in) && transaction_in.length) {
                                let block_from = null;
                                let arrow;
                                let d;

                                for (var k = 0; k < transaction_in.length; k++) {
                                    arrow = transaction_in[k];
                                    for (var t = 0; t < this.dataToDraw.length; t++) {
                                        if (this.dataToDraw[t].getBlockId == transaction_in[k].block_in) {
                                            block_from = this.dataToDraw[t];
                                            d = j - t;
                                        }

                                    }
                                    if (block_from != null) {
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
            }
        }
        this.handlerDrawApplication();
        this.handleBuildBlockTab(this.blockTab, this.miner);
    }

    changeDataToDraw(clickPreviousFollowing) {
        let centralBlock = this._returnCentralBlock();
        let index = 0;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].getClassName == 'Block' && this.data[i].getBlockId == centralBlock.getBlockId) {
                index = i;
            }
        }

        let newIndex = null;
        if (clickPreviousFollowing.getClassName == 'PreviousBlock') {
            for (var i = index - 1; i >= 0 && newIndex == null; i--) {
                if (this.data[i].getClassName == 'Block') {
                    newIndex = i;
                }
            }

        } else if (clickPreviousFollowing.getClassName == 'FollowingBlock') {
            for (var i = index + 1; i < this.data.length && newIndex == null; i++) {
                if (this.data[i].getClassName == 'Block') {
                    newIndex = i;
                }
            }
        }
        let perc = newIndex / (this.data.length - 2);
        this.changeSliderPercentage(perc)
    }

    checkClick(coord) {
        console.log("MinerModel - checkClick")
        for (var i = 0; i < this.dataToDraw.length; i++) {
            if ((this.dataToDraw[i].getClassName == 'PreviousBlock' || this.dataToDraw[i].getClassName == 'FollowingBlock') && this.dataToDraw[i].isInteraction(coord)) {
                console.log("click on " + this.dataToDraw[i].getClassName);
                this.changeDataToDraw(this.dataToDraw[i]);
                break;
            }
        }

    }

    checkMouseMove(coord) {
        //console.log("MinerModel - checkMouseMove")
        let find = false;
        for (var i = 0; i < this.dataToDraw.length; i++) {
            if ((this.dataToDraw[i].getClassName == 'PreviousBlock' || this.dataToDraw[i].getClassName == 'FollowingBlock') && this.dataToDraw[i].isInteraction(coord)) {
                find = true;
                break;
            }
        }
        for (var i = 0; i < this.transaction.length; i++) {
            if (this.transaction[i].isInteraction(coord)) {
                find = true;
                break;
            }

        }
        this.handleMouseMove(find);
    }

    checkToolTip(coord) {
        //console.log("MinerModel - ToolTip")
        let result = { find: false };
        for (var i = 0; i < this.transaction.length; i++) {
            if (this.transaction[i].isInteraction(coord)) {
                result.find = true;
                result.trans = this.transaction[i];
                result.mouseX = coord.x_real
                result.mouseY = coord.y_real
                break;
            }
        }
        this.handleDrawToolTip(result);
    }

}
export { MinerModel }