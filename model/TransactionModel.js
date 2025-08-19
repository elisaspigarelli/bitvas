
import { Model } from './Model.js';
import { TransactionBlock } from '../object/TransactionBlock.js';
import { TransactionArrow } from '../object/TransactionArrow.js';
import { PreviousTransactionBlock } from '../object/PreviousTransactionBlock.js';
import { FollowingTransactionBlock } from '../object/FollowingTransactionBlock.js';
import { Block } from '../object/Block.js';
import { ClusterBlock } from '../object/ClusterBlock.js';


class TransactionModel extends Model {
  constructor() {
    super();
    this.max_numb_transBlock = 2;
    this.transTab = null;
    this.defaultPerc_input = 1;
    this.defaultPerc_output = 0;
  }

  bindBuildTransTab(callback) {
    this.handleBuildTransTab = callback
  }
  bindOpenTransTab(callback) {
    this.handleOpenTransTab = callback
  }

  changeSliderPercentage(pct) {
    this.perc_input = pct.input;
    this.perc_output = pct.output;
    let perc = { input: this.perc_input, output: this.perc_output }
    this.handleSettingPercentage(perc)
    this.buildDataToDraw();
  }

  startVisualization(input) {
    console.log("TransactionModel - starVisualization: " + input)
    //retreive the right dataset
    if (this.dataset.setTransactionDataset(input)) {
      this._getData(this.dataLoaded, this.dataset.getTransactionDataset());
    } else {
      this.handlerDrawApplication();
    }
  }


  dataLoaded = (blocks) => {
    this.buildData(blocks);
    this.buildDataToDraw();
    this.loadTransactionInfo();
  }

  buildData = (blocks) => {
    console.log("TransactionModel - buildData")
    this._resetData();
    console.log(blocks)
    for (var i = 0; i < blocks.length; i++) {
      let block;
      if (blocks[i].type == 1) {
        block = new Block(blocks[i]);
      } else if (blocks[i].type == 0) {
        block = new ClusterBlock(blocks[i], i);
      } else if (blocks[i].type == 2) {
        let b = new Block(blocks[i]);
        block = new TransactionBlock(b, blocks[i].transaction);
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
    console.log(this.data)
  }

  buildDataToDraw = () => {
    console.log("TransactionModel - buildDataToDraw")
    this._resetDataToDraw();
    let start_input;
    let start_output;
    if (this.perc_output == 0) {
      start_output = 1;
    }
    if (this.perc_input == 1) {
      start_input = 1;
    }
    let index = 0;
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].getClassName == 'TransactionBlock' && this.data[i].position == 0) {
        index = i;
      }
    }
    console.log(index)
    console.log(this.data.length)
    // calcolo gli indici in input e output in base alla percentuale
    if (start_output === undefined) {
      start_output = Math.round((this.data.length - 1 - index) * this.perc_output)
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

    //console.log(start_input + " e " + start_output)
    let count = 0;
    let index_input = 0;

    if (start_input == 2 && this.data[index - 1].getClassName == "ClusterBlock") {
      // check se primo blocco è un Cluster e vicino al Trans
      start_input = start_input - 1;
    } else if (start_input != 1 && index - start_input > 0) {
      //check se primo blocco è un Cluster, vai sul successivo
      if (this.data[index - start_input].getClassName == "ClusterBlock") {
        start_input = start_input + 1;
      }
    }

    for (var k = index - start_input; k >= 0; k--) {
      if (this.data[k].getClassName == "TransactionBlock" && this.data[k].position == -1) {
        count = count + 1;
        if (count == this.max_numb_transBlock) {
          index_input = k; // indice del primo blocco visibile
        }
      }
    }
    let previuosTranInput;
    if (index_input > 0) { //check if there are trans previuos
      previuosTranInput = new PreviousTransactionBlock(-1);
      this.dataToDraw.push(previuosTranInput);
    } else {
      //controlla che devono esserci tutti i valori possibili (alla fine non deve scorrere se non ne hanno più successivi)
      count = 0;
      for (var k = index_input; k < index; k++) {
        if (this.data[k].getClassName == "TransactionBlock" && this.data[k].position == -1) {
          count = count + 1;
          if (count == this.max_numb_transBlock) {
            start_input = index - k;
          }
        }
      }
    }

    for (var i = index_input; i <= index - start_input; i++) {
      this.dataToDraw.push(this.data[i]);
    }

    let followingTranInput;
    if (1 != start_input) {
      followingTranInput = new FollowingTransactionBlock(-1);
      this.dataToDraw.push(followingTranInput);
    }

    this.dataToDraw.push(this.data[index]);

    if (start_output == 2 && this.data[index + 1].getClassName == "ClusterBlock") {
      // check se primo blocco è un Cluster e vicino al Trans
      start_output = start_output - 1;
    } else if (start_output != 1 && index + start_output < this.data.length) {
      //check se primo blocco è un Cluster, vai sul successivo
      if (this.data[index + start_output].getClassName == "ClusterBlock") {
        start_output = start_output + 1;
      }
    }

    let previuosTranOutput;
    if (start_output != 1) { //check if there are trans previuos
      previuosTranOutput = new PreviousTransactionBlock(1);
      this.dataToDraw.push(previuosTranOutput);
    }
    count = 0;
    let index_output = this.data.length - 1;

    for (var k = index + start_output; k < this.data.length; k++) {
      if (this.data[k].getClassName == "TransactionBlock" && this.data[k].position == 1) {
        count = count + 1;
        if (count == this.max_numb_transBlock) {
          index_output = k;
        }
      }
    }

    if (index_output == this.data.length - 1) {
      //controlla che devono esserci tutti i valori possibili (alla fine non deve scorrere se non ne hanno più successivi)
      count = 0;
      for (var k = index_output; k > index; k--) {
        if (this.data[k].getClassName == "TransactionBlock" && this.data[k].position == 1) {
          count = count + 1;
          if (count == this.max_numb_transBlock) {
            start_output = k - index;
          }
        }
      }
    }

    for (var i = index + start_output; i <= index_output; i++) {
      this.dataToDraw.push(this.data[i]);
    }

    let followingTranOutput;
    if (index_output < this.data.length - 1) {//check if there are trans following
      followingTranOutput = new FollowingTransactionBlock(1);
      this.dataToDraw.push(followingTranOutput);
    }

    console.log(this.dataToDraw)
    this.loadTransaction();

  }

  changeDataToDraw(clickPreviousFollowing) {
    console.log("TransactionModel - changeDataToDraw: " + clickPreviousFollowing.getPosition)
    let index_trans_data = 0; // contiene la posizione della Transazione in data
    for (var i = 0; i < this.data.length; i++) {
      if (this.data[i].getClassName == 'TransactionBlock' && this.data[i].position == 0) {
        index_trans_data = i;
      }
    }
    let index_trans_draw = 0; // contiene la posizione della Transazione in dataToDraw
    for (var i = 0; i < this.dataToDraw.length; i++) {
      if (this.dataToDraw[i].getClassName == 'TransactionBlock' && this.dataToDraw[i].position == 0) {
        index_trans_draw = i;
      }
    }
    let index_input_data = 0;// posizione in data del blocco che stiamo cercando (precedente a Trans)
    let index_output_data = 0; // posizione in data del blocco sucessivo a Trans (deve rimanere lo stesso)
    let perc;
    if (clickPreviousFollowing.getPosition == -1) {

      if (clickPreviousFollowing.getClassName == 'PreviousTransactionBlock') {
        // devo andare a trovare l'indice dopo index da cui partire 
        let count = 0;
        let index_input = 0; //è in nuovo indice del TransBlock da mettere vicino a Trans
        for (var k = index_trans_draw - 1; k >= 0; k--) {
          if (this.dataToDraw[k].getClassName == "TransactionBlock" && this.dataToDraw[k].position == -1) {
            count = count + 1;
            if (count == this.max_numb_transBlock) { // è =2, quindi si scorre di 1, altrimenti di più
              index_input = k;
            }
          }
        }
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].getClassName == 'TransactionBlock' && this.data[i] == this.dataToDraw[index_input]) {
            index_input_data = i;
          }
        }

      } else if (clickPreviousFollowing.getClassName == 'FollowingTransactionBlock') {
        let start_input_data = 0; // cerco posizione in data del blocco precedente a Trans 
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].getClassName == 'TransactionBlock' && this.data[i] == this.dataToDraw[index_trans_draw - 2]) { //-2 perchè a -1 c'è FollowingTransactionBlock pigiato
            start_input_data = i;
          }
        }
        let count = 0;
        for (var k = start_input_data; k < index_trans_data; k++) {
          if (this.data[k].getClassName == "TransactionBlock" && this.data[k].position == -1) {
            count = count + 1;
            if (count == this.max_numb_transBlock) { // è =2, quindi si scorre di 1, altrimenti di più
              index_input_data = k;
            }
          }
        }

        if (this.data[index_input_data + 1].getClassName == "ClusterBlock" && this.data[index_input_data + 2].position == 0) { //se ultimo ed è cluster prendere!
          index_input_data = index_input_data + 1;
        }
      }

      if (index_input_data == 1) {
        this.perc_input = 0;
      } else {
        this.perc_input = index_input_data / index_trans_data;
      }
      perc = { input: this.perc_input, output: this.perc_output }


    } else if (clickPreviousFollowing.getPosition == 1) {


      if (clickPreviousFollowing.getClassName == 'PreviousTransactionBlock') {
        let start_output_data = 0; // cerco posizione in data del blocco successivo a Trans 
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].getClassName == 'TransactionBlock' && this.data[i] == this.dataToDraw[index_trans_draw + 2]) { //+2 perchè a +1 c'è PreviousTransactionBlock pigiato
            start_output_data = i;
          }
        }
        let count = 0;
        for (var k = start_output_data; k > index_trans_data; k--) {
          if (this.data[k].getClassName == "TransactionBlock" && this.data[k].position == 1) {
            count = count + 1;
            if (count == this.max_numb_transBlock) { // è =2, quindi si scorre di 1, altrimenti di più
              index_output_data = k;
            }
          }
        }

        if (this.data[index_output_data - 1].getClassName == "ClusterBlock" && this.data[index_output_data - 2].position == 0) { //se ultimo ed è cluster prendere!
          index_output_data = index_output_data - 1;
        }

      } else if (clickPreviousFollowing.getClassName == 'FollowingTransactionBlock') {

        let count = 0;
        let index_output = this.dataToDraw.length - 1;//è in nuovo indice del TransBlock da mettere vicino a Trans

        for (var k = index_trans_draw + 1; k < this.dataToDraw.length; k++) {
          if (this.dataToDraw[k].getClassName == "TransactionBlock" && this.dataToDraw[k].position == 1) {
            count = count + 1;
            if (count == this.max_numb_transBlock) {// è =2, quindi si scorre di 1, altrimenti di più
              index_output = k;
            }
          }
        }

        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].getClassName == 'TransactionBlock' && this.data[i] == this.dataToDraw[index_output]) {
            index_output_data = i;
          }
        }

      }

      if (index_output_data - index_trans_data == 1) {
        this.perc_output = 0;
      } else {
        this.perc_output = (index_output_data - index_trans_data) / (this.data.length - index_trans_data);
      }
      perc = { input: this.perc_input, output: this.perc_output }

    }
    console.log(perc)
    this.handleSettingPercentage(perc)
    this.buildDataToDraw();
  }

  loadTransaction() {
    console.log("TransactionModel - loadTransaction")
    this._getData(this.buildTransactions, this.dataset.getTransactionTrans());
  }

  buildTransactions = (transactions) => {
    console.log("TransactionModel - buildTransactions")
    for (var j = 0; j < transactions.length; j++) {
      let block_from = null;
      let block_to = null;
      let input = -1;
      let output = -1;
      for (var i = 0; i < this.dataToDraw.length; i++) {
        if (this.dataToDraw[i].getClassName == 'TransactionBlock' && this.dataToDraw[i].getBlockId == transactions[j].id_input) {
          block_from = this.dataToDraw[i];
          input = i;
        } else if (this.dataToDraw[i].getClassName == 'TransactionBlock' && this.dataToDraw[i].getBlockId == transactions[j].id_output) {
          block_to = this.dataToDraw[i];
          output = i;
        }
      }
      if (block_from != null && ((block_to == null && transactions[j].id_output == '-') || block_to != null)) {
        let distance = 0;
        if (input != -1 && output != -1) {
          for (var k = input + 1; k <= output; k++) {
            if (this.dataToDraw[k].getClassName == 'TransactionBlock') {
              distance = distance + 1;
            }
          }
        }
        let trans = new TransactionArrow(block_from, block_to, distance, transactions[j].transaction)
        this.transaction.push(trans)
      }
    }
    this.handlerDrawApplication();
  }

  loadTransactionInfo() {
    console.log("TransactionModel - loadTransactionInfo")
    this._getData(this.buildTransactionsInfo, this.dataset.getTransactionTransInfo());
  }

  buildTransactionsInfo = (transInfo) => {
    this.transTab = {
      trans_name: transInfo.trans_name,
      block_id: transInfo.block_id,
      hash: transInfo.hash,
      time: transInfo.time,
      input_count: transInfo.input_count,
      output_count: transInfo.output_count,
      fee: transInfo.fee,
      output_total: transInfo.output_total,
      input_total: transInfo.input_total,
    };

    this.handleBuildTransTab(this.transTab);
    this.handleOpenTransTab(this.transTab);
  }

  checkClick(coord) {
    console.log("CHECK CLICK TransactionMODEL")
    for (var i = 0; i < this.dataToDraw.length; i++) {
      if (this.dataToDraw[i].getClassName == 'TransactionBlock' && this.dataToDraw[i].getShow && this.dataToDraw[i].getFollowing != null && this.dataToDraw[i].getFollowing.isInteraction(coord)) {
        //console.log("click on Following ")
        this.dataToDraw[i].clickFollowing()
        this.handlerDrawApplication()
      } else if (this.dataToDraw[i].getClassName == 'TransactionBlock' && this.dataToDraw[i].getShow && this.dataToDraw[i].getPrevious != null && this.dataToDraw[i].getPrevious.isInteraction(coord)) {
        //  console.log("click on Previous")
        this.dataToDraw[i].clickPrevious()
        this.handlerDrawApplication()
      } else if (this.dataToDraw[i].getClassName == 'TransactionBlock' && this.dataToDraw[i].isInteraction(coord)) {
        // console.log("click on Transaction : " + this.dataToDraw[i].id)
        if (this.dataToDraw[i].position != 0) {
          this.dataToDraw[i].changeShow()
          this.handlerDrawApplication()
        }
      }
      if ((this.dataToDraw[i].getClassName == 'PreviousTransactionBlock' || this.dataToDraw[i].getClassName == 'FollowingTransactionBlock') && this.dataToDraw[i].isInteraction(coord)) {
        //console.log("click on " + this.dataToDraw[i].getClassName + " position " + this.dataToDraw[i].getPosition);
        this.changeDataToDraw(this.dataToDraw[i]);
      }
    }
  }

  checkMouseMove(coord) {
    //console.log("MouseMove TransactionModel")
    let find = false;
    for (var i = 0; i < this.dataToDraw.length; i++) {
      if (this.dataToDraw[i].getClassName == 'TransactionBlock') {
        //check mouseMove on block not central
        if (this.dataToDraw[i].position != 0 && this.dataToDraw[i].isInteraction(coord)) {
          find = true
        } else if (this.dataToDraw[i].position == 0) {
          // check trans rect in central Block
          let checkResult = this.dataToDraw[i].isInteractionTrans(coord)
          if (checkResult.find) {
            find = true
          }
        }
      }
      if ((this.dataToDraw[i].getClassName == 'PreviousTransactionBlock' || this.dataToDraw[i].getClassName == 'FollowingTransactionBlock') && this.dataToDraw[i].isInteraction(coord)) {
        //console.log("move on " + this.dataToDraw[i].getClassName + " position " + this.dataToDraw[i].getPosition);
        find = true;
      }
    }
    for (var i = 0; i < this.transaction.length; i++) {
      /*if (this.transaction[i].getBlock_from != null && this.transaction[i].getBlock_from.getShow && this.transaction[i].getBlock_to != null && this.transaction[i].getBlock_to.getShow) {
        let index = Math.max(this.transaction[i].getBlock_from.transaction_index, this.transaction[i].getBlock_to.transaction_index);
        if (this._isInteractionBlock(this.transaction[i].transaction[index].rect, coord)) {
          find = true;
        }
      } else if (this.transaction[i].getBlock_to == null) {
        for (let j = 0; j < this.transaction[i].transaction.length; j++) {
          if (this._isInteractionBlock(this.transaction[i].transaction[j].rect, coord)) {
            find = true;
          }
        }
      }*/
      let checkResult = this.transaction[i].isInteractionRect(coord)
      if(checkResult.find){
        find = true;
      }
    }
    this.handleMouseMove(find);
  }

  checkToolTip(coord) {
    // console.log("TransactionBlockModel - ToolTip")
    let result = { find: false };
    for (var i = 0; i < this.transaction.length; i++) {
     /* if (this.transaction[i].getBlock_from != null && this.transaction[i].getBlock_from.getShow && this.transaction[i].getBlock_to != null && this.transaction[i].getBlock_to.getShow) {
        let index = Math.max(this.transaction[i].getBlock_from.transaction_index, this.transaction[i].getBlock_to.transaction_index);
        if (this._isInteractionBlock(this.transaction[i].transaction[index].rect, coord)) {
          result.find = true;
          result.type = 0;
          result.trans = this.transaction[i].transaction[index];
          result.mouseX = coord.x_real
          result.mouseY = coord.y_real
        }
      } else if (this.transaction[i].getBlock_to == null) {
        for (let j = 0; j < this.transaction[i].transaction.length; j++) {
          if (this._isInteractionBlock(this.transaction[i].transaction[j].rect, coord)) {
            result.find = true;
            result.type = 0;
            result.trans = this.transaction[i].transaction[j];
            result.mouseX = coord.x_real
            result.mouseY = coord.y_real
          }
        }
      }*/
      let checkResult = this.transaction[i].isInteractionRect(coord)
      if(checkResult.find){
        result.find = true;
            result.type = 0;
            result.trans = checkResult.trans;
            result.mouseX = coord.x_real
            result.mouseY = coord.y_real

      }
    }
    for (var i = 0; i < this.dataToDraw.length; i++) {
      if (this.dataToDraw[i].getClassName == 'TransactionBlock' && this.dataToDraw[i].getShow) {
        //let index = this.dataToDraw[i].transaction_index;
        let checkResult = this.dataToDraw[i].isInteractionTrans(coord)
        if (checkResult.find) {
          result.find = true;
          result.type = 1;
          result.trans = checkResult.trans;
          result.mouseX = coord.x_real
          result.mouseY = coord.y_real
        }
      }
    }
    this.handleDrawToolTip(result);
  }

}

export { TransactionModel }