import { Model } from './Model.js';
import { Block } from '../object/Block.js';
import { ClusterBlock } from '../object/ClusterBlock.js';
import { PreviousBlock } from '../object/PreviousBlock.js';
import { FollowingBlock } from '../object/FollowingBlock.js';
import { BlockArrow } from '../object/BlockArrow.js';


class NeighbourModel extends Model {
    constructor(id) {
        super();
        this.input = id;
        this.max_numb = 4;
        this.defaultPerc_input = 1;
        this.defaultPerc_output = 0;
    }

    bindBuildBlockTab(callback) {
        this.handleBuildBlockTab = callback
    }
    bindOpenBlockTab(callback) {
        this.handleOpenBlockTab = callback
    }

    startVisualization() {
        console.log("NeighbourModel - startVisualization");
        if (this.dataset.setNeighbourDataset(this.input)) {
            this.loadBlockInfo();
        } else {
            this.handlerDrawApplication();
        }
    }
  
    changeSliderPercentage(pct) {
        this.perc_input = pct.input;
        this.perc_output = pct.output;
        let perc = { input: this.perc_input, output: this.perc_output }
        this.handleSettingPercentage(perc)
        this.buildDataToDraw();
    }

    _loadDataset = () => {
        this._getData(this.dataLoaded, this.dataset.getNeighbourDataset())
    }

    loadTransaction() {
        console.log("NeighbourModel - loadTransaction")
        this._getData(this.buildTransactions, this.dataset.getNeighbourTrans());
    }

    dataLoaded = (blocks) => {
     
        this.buildData(blocks);
        this.buildDataToDraw();    
    }

    loadBlockInfo() {
        console.log("NeighbourModel - loadBlockInfo")
        this._getData(this.buildBlockInfo, this.dataset.getNeighbourBlockInfo());
    }

    buildBlockInfo = (blockInfo) => {
        let block = new Block(blockInfo);
        this.blockId=block.getBlockId;
        console.log(this.blockId)
        this.handleBuildBlockTab(block)
        this.handleOpenBlockTab(block)
        this._loadDataset();
    }

    buildData = blocks => {
        console.log("NeighbourModel - buildData");
        this._resetData();
      
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
        this.perc_input = this.defaultPerc_input;
        this.perc_output = this.defaultPerc_output;
        let perc = { input: this.perc_input, output: this.perc_output }
        this.handleSettingPercentage(perc)
        // console.log(this.data)
    }


    buildDataToDraw = () => {
        console.log("NeighbourModel - buildDataToDraw")
        this._resetDataToDraw();
        let start_input;
        let start_output;
        // default position 
        if (this.perc_output == 0) {
            start_output = 1;
        }
        if (this.perc_input == 1) {
            start_input = 1;
        }
        let index = 0;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].getClassName == 'Block' && this.data[i].getBlockId == this.blockId) {
                index = i;
            }
        }
        // calcolo gli indici in input e output in base alla percentuale
        if (start_output === undefined) {
            start_output = Math.round((this.data.length - index) * this.perc_output)
            if (start_output == 0) {
                start_output = 1;
            }
        }
        if (start_input === undefined) {
            let v = ((index) * this.perc_input)
            start_input = Math.round(index - v)
            if (start_input == 0) {
                start_input = 1;
            }
        }

        let count = 0;
        let index_input = 0;

        if (start_input == 2 && this.data[index - 1].getClassName == "ClusterBlock") {
            // check se primo blocco è un Cluster e vicino al BLOCKID
            start_input = start_input - 1;
        } else if (start_input != 1 && index - start_input > 0) {
            //check se primo blocco è un Cluster, vai sul successivo
            if (this.data[index - start_input].getClassName == "ClusterBlock") {
                start_input = start_input + 1;
            }
        }

        for (var k = index - start_input; count < this.max_numb && k >= 0; k--) {
            if (this.data[k].getClassName == "ClusterBlock" && count == this.max_numb - 1) {
                break;
            }
            count = count + 1;
            index_input = k; // indice del primo blocco visibile
        }


        let previuosInput;
        if (index_input > 0) { //check if there are  previuos
            previuosInput = new PreviousBlock(-1);
            this.dataToDraw.push(previuosInput);
        } else {
            //controlla che devono esserci tutti i valori possibili (alla fine non deve scorrere se non ne hanno più successivi)
            count = 0;
            for (var k = index_input; count < this.max_numb && k < this.max_numb + index_input; k++) {
                if (this.data[k].getClassName == "ClusterBlock" && count == this.max_numb - 1) {
                    break;
                }
                count = count + 1;
                start_input = index - k;
            }
        }

        for (var i = index_input; i <= index - start_input; i++) {
            this.dataToDraw.push(this.data[i]);
        }

        let followingInput;
        if (1 != start_input) {
            followingInput = new FollowingBlock(-1);
            this.dataToDraw.push(followingInput);
        }

        this.dataToDraw.push(this.data[index]);

        if (start_output == 2 && this.data[index + 1].getClassName == "ClusterBlock") {
            // check se primo blocco è un Cluster e vicino al BLOCKID
            start_output = start_output - 1;
        } else if (start_output != 1 && index + start_output < this.data.length) {
            //check se primo blocco è un Cluster, vai sul successivo
            if (this.data[index + start_output].getClassName == "ClusterBlock") {
                start_output = start_output + 1;
            }
        }

        let previuosOutput;
        if (start_output != 1) { //check if there are previuos
            previuosOutput = new PreviousBlock(1);
            this.dataToDraw.push(previuosOutput);
        }

        count = 0;
        let index_output = this.data.length - 1;

        for (var k = index + start_output; count < this.max_numb && k < this.data.length; k++) {
            if (this.data[k].getClassName == "ClusterBlock" && count == this.max_numb - 1) {
                break;
            }
            count = count + 1;
            index_output = k;
        }

        if (index_output == this.data.length - 1) {
            //controlla che devono esserci tutti i valori possibili (alla fine non deve scorrere se non ne hanno più successivi)
            count = 0;
            for (var k = index_output; count < this.max_numb && k >= index_output - this.max_numb; k--) {
                if (this.data[k].getClassName == "ClusterBlock" && count == this.max_numb - 1) {
                    break;
                }
                count = count + 1;
                start_output = k - index;
            }
        }

        for (var i = index + start_output; i <= index_output; i++) {
            this.dataToDraw.push(this.data[i]);
        }

        let followingOutput;
        if (index_output < this.data.length - 1) {//check if there are  following
            followingOutput = new FollowingBlock(1);
            this.dataToDraw.push(followingOutput);
        }
        console.log(this.dataToDraw)
        this.loadTransaction();
    }

    buildTransactions = (transactions) => {
        console.log("NeighbournModel - buildTransactions ")
        for (var j = 0; j < transactions.length; j++) {
            let block_from = null;
            let block_to = null;
            let input = -1;
            let output = -1;
            for (var i = 0; i < this.dataToDraw.length; i++) {
                if (this.dataToDraw[i].getClassName == 'Block' && this.dataToDraw[i].getBlockId == transactions[j].id_input) {
                    block_from = this.dataToDraw[i];
                    input = i;
                }
                if (this.dataToDraw[i].getClassName == 'Block' && this.dataToDraw[i].getBlockId == transactions[j].id_output) {
                    block_to = this.dataToDraw[i];
                    output = i;
                }
            }
            if (block_from != null && block_to != null) {
                let distance = 0;
                for (var k = input + 1; k <= output; k++) {
                    if (this.dataToDraw[k].getClassName == 'Block') {
                        distance = distance + 1;
                    }
                }
                let arrow = { count: transactions[j].count, value: transactions[j].value, lineWidth: transactions[j].lineWidth }
                let trans = new BlockArrow(block_from, block_to, arrow, distance);

                this.transaction.push(trans)
            }
        }
        this.handlerDrawApplication(this.blockId);
    }

    changeDataToDraw(clickPreviousFollowing) {
        let index_block_data = 0; // contiene la posizione della block centrare in data
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].getClassName == 'Block' && this.data[i].getBlockId == this.blockId) {
                index_block_data = i;
            }
        }
        let index_block_draw = 0; // contiene la posizione del block centrare in dataToDraw
        for (var i = 0; i < this.dataToDraw.length; i++) {
            if (this.dataToDraw[i].getClassName == 'Block' && this.dataToDraw[i].getBlockId == this.blockId) {
                index_block_draw = i;
            }
        }
        let index_input_data = 0;// posizione in data del blocco che stiamo cercando (precedente a BlockID)
        let index_output_data = 0; // posizione in data del blocco sucessivo a BlockID (deve rimanere lo stesso)

        if (clickPreviousFollowing.getPosition == -1) {

            if (clickPreviousFollowing.getClassName == 'PreviousBlock') {
                // devo andare a trovare l'indice dopo index da cui partire 
                let count = 0;
                let index_input = 0; //è in nuovo indice del Block da mettere vicino a BlockID
                for (var k = index_block_draw - 1; k >= 0; k--) {
                    //devo trovare il blocco da mettere vicino al block centrale              
                    if (this.dataToDraw[k].getClassName == "Block") {
                        count = count + 1;
                        if (count == 2) { //  =2, quindi si scorre di 1, altrimenti  cambiare
                            index_input = k;
                            break;
                        }
                    }
                }
                for (var i = 0; i < this.data.length; i++) {
                    if (this.data[i].getClassName == 'Block' && this.data[i] == this.dataToDraw[index_input]) {
                        index_input_data = i;
                    }
                }

            } else if (clickPreviousFollowing.getClassName == 'FollowingBlock') {
                let start_input_data = 0; // cerco posizione in data del blocco precedente a BlockID 
                for (var i = 0; i < this.data.length; i++) {
                    if (this.data[i].getClassName == 'Block' && this.data[i] == this.dataToDraw[index_block_draw - 2]) { //-2 perchè a -1 c'è FollowingBlock pigiato
                        start_input_data = i;
                    }
                }
                let count = 0;
                for (var k = start_input_data; k < index_block_data; k++) {
                    if (this.data[k].getClassName == "Block") {
                        count = count + 1;
                        if (count == 2) { //=2 quindi si scorre di 1
                            index_input_data = k;
                            break;
                        }
                    }
                }

                if (this.data[index_input_data + 1].getClassName == "ClusterBlock" && this.data[index_input_data + 2].getBlockId == this.blockId) { //se ultimo ed è cluster prendere!
                    index_input_data = index_input_data + 1;
                }
            }
            /*let i_output = index_block_draw + 1
            if (this.dataToDraw[i_output].getClassName == "PreviousBlock") { //check se in output c'è previousBlock
                i_output = index_block_draw + 2;
            }
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i] == this.dataToDraw[i_output]) {
                    index_output_data = i;
                }
            }*/

            if (index_input_data == 1) {
                this.perc_input = 0;
            } else {
                this.perc_input = index_input_data / index_block_data;
            }

            let perc = { input: this.perc_input, output: this.perc_output }
            this.handleSettingPercentage(perc)


        } else if (clickPreviousFollowing.getPosition == 1) {

            if (clickPreviousFollowing.getClassName == 'PreviousBlock') {
                let start_output_data = 0; // cerco posizione in data del blocco successivo a BlockID 
                for (var i = 0; i < this.data.length; i++) {
                    if (this.data[i].getClassName == 'Block' && this.data[i] == this.dataToDraw[index_block_draw + 2]) { //+2 perchè a +1 c'è PreviousBlock pigiato
                        start_output_data = i;
                    }
                }
                let count = 0;
                for (var k = start_output_data; k > index_block_data; k--) {
                    if (this.data[k].getClassName == "Block") {
                        count = count + 1;
                        if (count == 2) { // è =2 si scorre di 1
                            index_output_data = k;
                        }
                    }
                }

                if (this.data[index_output_data - 1].getClassName == "ClusterBlock" && this.data[index_output_data - 2].getBlockId == this.blockId) { //se ultimo ed è cluster prendere!
                    index_output_data = index_output_data - 1;
                }

            } else if (clickPreviousFollowing.getClassName == 'FollowingBlock') {

                let count = 0;
                let index_output = this.dataToDraw.length - 1;//è in nuovo indice del Block da mettere vicino a BlockID

                for (var k = index_block_draw + 1; k < this.dataToDraw.length; k++) {
                    if (this.dataToDraw[k].getClassName == "Block") {
                        count = count + 1;
                        if (count == 2) {// è =2 quindi si scorre di 1
                            index_output = k;
                        }
                    }
                }

                for (var i = 0; i < this.data.length; i++) {
                    if (this.data[i].getClassName == 'Block' && this.data[i] == this.dataToDraw[index_output]) {
                        index_output_data = i;
                    }
                }

            }

            /*let i_input = index_block_draw - 1
            if (this.dataToDraw[i_input].getClassName == "FollowingBlock") { //check se in input c'è followingBlock
                i_input = index_block_draw - 2;
            }
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i] == this.dataToDraw[i_input]) {
                    index_input_data = i;
                }
            }*/

            if (index_output_data - index_block_data == 1) {
                this.perc_output = 0;
            } else {
                this.perc_output = (index_output_data - index_block_data) / (this.data.length - index_block_data);
            }

            let perc = { input: this.perc_input, output: this.perc_output }
            this.handleSettingPercentage(perc)
        }

        this.buildDataToDraw();

    }

    checkClick(coord) {
        //console.log("NeighbourModel - checkClick")
        for (var i = 0; i < this.dataToDraw.length; i++) {
            if ((this.dataToDraw[i].getClassName == 'PreviousBlock' || this.dataToDraw[i].getClassName == 'FollowingBlock') && this.dataToDraw[i].isInteraction(coord)) {
                console.log("click on " + this.dataToDraw[i].getClassName + " position " + this.dataToDraw[i].getPosition);
                this.changeDataToDraw(this.dataToDraw[i]);
                break;
            }
        }
    }

    checkMouseMove(coord) {
        //console.log("NeighbourModel - checkMouseMove")
        let find = false;
        for (var i = 0; i < this.dataToDraw.length; i++) {
            if ((this.dataToDraw[i].getClassName == 'PreviousBlock' || this.dataToDraw[i].getClassName == 'FollowingBlock') && this.dataToDraw[i].isInteraction(coord)) {
                find = true;
                break;
            }
        }
        for (var i = 0; i < this.transaction.length; i++) {
            if (this.transaction[i].getBlock_from.getBlockId == this.blockId && this.transaction[i].getBlock_to.getBlockId == this.blockId) {
                if (this.transaction[i].getBlock_from.isInteraction(coord)) {
                    find = true;
                    break;
                }
            } else if (this.transaction[i].isInteraction(coord)) {
                find = true;
                break;
            }

        }
        this.handleMouseMove(find);
    }


    checkToolTip(coord) {
        // console.log("NeighbourModel - ToolTip")
        let result = { find: false };
        for (var i = 0; i < this.transaction.length; i++) {
            if (this.transaction[i].getBlock_from.getBlockId == this.blockId && this.transaction[i].getBlock_to.getBlockId == this.blockId) {
                if (this.transaction[i].getBlock_from.isInteraction(coord)) {
                    result.find = true;
                    result.trans = this.transaction[i];
                    result.mouseX = coord.x_real
                    result.mouseY = coord.y_real
                    break;
                }
            } else if (this.transaction[i].isInteraction(coord)) {
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
export { NeighbourModel };