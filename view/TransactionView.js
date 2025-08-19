import { View } from './View.js';
import { Slider } from '../object/Slider.js';

const slider_x_input = 123;
const slider_x_output = 803;
const slider_width = 440;


class TransactionView extends View {
  constructor() {
    super();
    this.font_clusterBlock = '16px helvetica';
    this.gap_textCluster = 15;
    this.gap_lineCluster = 6;
    this.extra_h_trans = 100;
    this.width_rect_trans = this.width_rect + 50;
    this.height_start_trans = this.height_start - (this.extra_h_trans / 2);
    this.height_rect_trans = this.height_rect + this.extra_h_trans;
    this.height_cluster = this.height_rect / 2;
    this.height_start_cluster = this.height_start + this.height_cluster / 2;
    this.io_rect_height = 20;
    this.io_rect_width = 40;
    this.previuos_following_h = 40;
    this.isDown_input = false;
    this.isDown_output = false;
    this.range_input = new Slider(slider_x_input, slider_width);
    this.range_output = new Slider(slider_x_output, slider_width);
  }

  setPercentage(pct) {
    this.range_input.setPerc(pct.input);
    this.range_output.setPerc(pct.output);
  }

  clickSlider(callback) {
    this.canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      //console.log("TransactionView - clickSlider.mousedown")
      let mousePoint = this._getMouseCoordinates(e);
      this.isDown_input = this.range_input.isInteraction(mousePoint)
      this.isDown_output = this.range_output.isInteraction(mousePoint)
    })

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isDown_input && !this.isDown_output) { return; }
      e.preventDefault();
      e.stopPropagation();
      let mousePoint = this._getMouseCoordinates(e);
      let pct;
      if (this.isDown_input) {
        let pct_input = this.range_input.calcolatePerc(mousePoint);
        //console.log("perc_input: " + pct_input)
        pct = { input: pct_input, output: this.range_output.getPerc }
      } else if (this.isDown_output) {
        let pct_output = this.range_output.calcolatePerc(mousePoint);
        //console.log("pct_output: " + pct_output)
        pct = { input: this.range_input.getPerc, output: pct_output }
      }

      callback(pct);
    })

    this.canvas.addEventListener('mouseup', (e) => {
      //console.log("TransactionView - mouseup")
      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();
      this.isDown_input = false;
      this.isDown_output = false;
    })

    this.canvas.addEventListener('mouseout', (e) => {
      //console.log("TransactionView - mouseout")
      // tell the browser we're handling this event
      e.preventDefault();
      e.stopPropagation();
      this.isDown_input = false;
      this.isDown_output = false;
    })
  }

  mouseMoveCanvas(callback) {
    this.canvas.addEventListener('mousemove', (e) => {
      e.preventDefault();
      e.stopPropagation();
      //console.log("TransactionView - mousemove")
      let mousePoint = this._getMouseCoordinates(e);
      if (this.range_input.isInteraction(mousePoint)) {
        this.canvas.style.cursor = "pointer"
      } else if (this.range_output.isInteraction(mousePoint)) {
        this.canvas.style.cursor = "pointer"
      } else {
        callback({ x: mousePoint.x, y: mousePoint.y });
      }
    })
  }

  drawCanvas = (blocks, transaction) => {
    this._resetView();
    if (Array.isArray(blocks) && blocks.length) {
      this.range_input.draw(this.ctx);
      this.range_output.draw(this.ctx);
      this._setCoordinates(blocks);
      this._drawingBlocks(blocks);
      this._setCoordinatesArrowBlock(transaction);
      this._drawingArrowsBlocks(transaction);
     
    } else {
      let message = "Hash or Block ID not found"
      this._drawMessage(message);
    }
  }

  _setCoordinatesArrowBlock(transaction) {
    this._spentTransactionsArrows(transaction);
    this._unspentTransactionsArrows(transaction);
  }
  
  drawToolTip(toolTip) {
    if (toolTip.find) {
      var BB = this.canvas.getBoundingClientRect();
      this.tipCtx.clearRect(0, 0, this.tipCanvas.width, this.tipCanvas.height);
      this.tipCtx.font = '18px helvetica';
      if (toolTip.type == 0) {
        var text1 = "Value: " + toolTip.trans.value + " BTC";
        var text2 = "Index: " + toolTip.trans.index;
        var text3 = "Address: " + toolTip.trans.address;
        var text1_ctx = this.tipCtx.measureText(text1);
        var text2_ctx = this.tipCtx.measureText(text2);
        var text3_ctx = this.tipCtx.measureText(text3);
        if (text1_ctx.width > text2_ctx.width) {
          if (text1_ctx.width > text3_ctx.width) {
            this.tipCanvas.width = text1_ctx.width + 10;
          } else {
            this.tipCanvas.width = text3_ctx.width + 10;
          }
        } else {
          if (text2_ctx.width > text3_ctx.width) {
            this.tipCanvas.width = text2_ctx.width + 10;
          } else {
            this.tipCanvas.width = text3_ctx.width + 10;
          }
        }
        this.tipCanvas.height = text1_ctx.fontBoundingBoxDescent * 3 + 30;
        this.tipCtx.font = '18px helvetica';
        this.tipCtx.textBaseline = 'top';
        this.tipCtx.fillText(text2, 5, 8);
        this.tipCtx.fillText(text1, 5, 33);
        this.tipCtx.fillText(text3, 5, 58);

      } else if (toolTip.type == 1) {
        var text1 = "Hash: " + toolTip.trans.trans_hash;
        var text1_ctx = this.tipCtx.measureText(text1);
        this.tipCanvas.width = text1_ctx.width + 10;
        this.tipCanvas.height = text1_ctx.fontBoundingBoxDescent + 10;
        this.tipCtx.font = '18px helvetica';
        this.tipCtx.textBaseline = 'top';
        this.tipCtx.fillText(text1, 5, 8);
      }


      if (BB.right > toolTip.mouseX + this.tipCanvas.width + 30) {
        this.tipCanvas.style.left = (toolTip.mouseX + 15) + "px";
      } else {
        this.tipCanvas.style.left = (toolTip.mouseX - 15 - this.tipCanvas.width) + "px";
      }
      if (BB.bottom > toolTip.mouseY + this.tipCanvas.height + 15) {
        this.tipCanvas.style.top = (toolTip.mouseY + 15) + "px";
      } else {
        this.tipCanvas.style.top = (BB.bottom - this.tipCanvas.height - 15) + "px";
      }
    } else {
      this.tipCanvas.style.left = "-1000px";
    }

  }

  _setCoordinates(rects) {
    // assegnare le coordinate ai rect che rappresentano le trans nei TransactionBlock 
    console.log("setCoordinate()");

    //set coordinates to central TransactionBlock 
    let centralTransaction;
    let index;
    for (var i = 0; i < rects.length; i++) {
      if (rects[i].getClassName == "TransactionBlock" && rects[i].position == 0) {
        centralTransaction = rects[i];
        index = i;
      }
    }

    if (centralTransaction.transaction.length == 1) {
      let width_half_canvas = this.fixed_width / 2;
      centralTransaction.width = this.width_rect_trans;
      centralTransaction.x = width_half_canvas - centralTransaction.width / 2;
      centralTransaction.y = this.height_start_trans;
      centralTransaction.height = this.height_rect_trans;
      centralTransaction.color = this.config.getMinerColor(centralTransaction.getMiner)

      centralTransaction.transaction[0].width = this.transaction_rect_x
      centralTransaction.transaction[0].height = this.transaction_rect_y
      centralTransaction.transaction[0].x = centralTransaction.x + centralTransaction.width / 2 - this.transaction_rect_x / 2
      centralTransaction.transaction[0].y = centralTransaction.y + centralTransaction.height / 2 + this.transaction_rect_gap_y - this.transaction_rect_y / 2

    }

    this.cursor_x_rect = centralTransaction.x;
    if (rects[index - 1].getClassName == "TransactionBlock") {
      this.cursor_x_rect = this.cursor_x_rect - this.width_gap_little;
    }

    for (var k = index - 1; k >= 0; k--) {
      if (rects[k].getClassName == "TransactionBlock" && rects[k].position == -1) {
        if (rects[k].getShow == false) {
          rects[k].y = this.height_start;
          rects[k].width = this.width_rect;
          rects[k].height = this.height_rect;
        } else {
          rects[k].y = this.height_start_expands;
          rects[k].width = this.width_rect;
          rects[k].height = this.height_rect_expands;
        }
        if (k == index - 1) {
          this.cursor_x_rect = this.cursor_x_rect - rects[k].width - this.width_gap_big;
        } else {
          this.cursor_x_rect = this.cursor_x_rect - rects[k].width - this.width_gap_little;
        }
        rects[k].color = this.config.getMinerColor(rects[k].getMiner)
        rects[k].x = this.cursor_x_rect;

        //setta le grandezze della transazione che deve essere mostrata
        let transaction_index = rects[k].transaction_index;

        rects[k].transaction[transaction_index].width = this.transaction_rect_y
        rects[k].transaction[transaction_index].height = this.transaction_rect_y
        rects[k].transaction[transaction_index].x = rects[k].x + rects[k].width / 2 - this.transaction_rect_y / 2
        rects[k].transaction[transaction_index].y = rects[k].y + rects[k].height / 2 + this.transaction_rect_gap_y - this.transaction_rect_y / 2

        if (rects[k].transaction.length != 1) {
          rects[k].checkPrevious();
          rects[k].checkFollowing();
          if (rects[k].getPrevious != null) {
            rects[k].getPrevious.width = this.transaction_rect_y / 4
            rects[k].getPrevious.height = this.transaction_rect_y / 2
            let space = rects[k].transaction[transaction_index].x - rects[k].x;
            rects[k].getPrevious.x = rects[k].x + (space - this.transaction_rect_y / 4) / 2
            rects[k].getPrevious.y = rects[k].y + rects[k].height / 2 + this.transaction_rect_gap_y - this.transaction_rect_y / 4;
          }
          if (rects[k].getFollowing != null) {
            rects[k].getFollowing.width = this.transaction_rect_y / 4
            rects[k].getFollowing.height = this.transaction_rect_y / 2
            let space = rects[k].x + rects[k].width - (rects[k].transaction[transaction_index].x + rects[k].transaction[transaction_index].width)
            rects[k].getFollowing.x = rects[k].transaction[transaction_index].x + rects[k].transaction[transaction_index].width + (space - this.transaction_rect_y / 4) / 2
            rects[k].getFollowing.y = rects[k].y + rects[k].height / 2 + this.transaction_rect_gap_y - this.transaction_rect_y / 4;
          }
        }

      } else if (rects[k].getClassName == "ClusterBlock") {
        rects[k].y = this.height_start_cluster;
        rects[k].width = this._calculateWidth(rects[k].getBlockId)
        rects[k].height = this.height_cluster;
        rects[k].index = k; //altrimenti tiene come indice quello in this.data (come accade nel Model)
        this.cursor_x_rect = this.cursor_x_rect - rects[k].width - this.width_gap_little;
        rects[k].x = this.cursor_x_rect;
      } else if (rects[k].getClassName == "PreviousTransactionBlock") {
        //come ultima posizione se ci sono previuos in input
        rects[k].y = this.height_start + 20;
        rects[k].triHeight = this.triHeight;
        rects[k].height = this.previuos_following_h;
        rects[k].width = ((rects[k].height / 2) * this.triHeight);
        rects[k].x = this.cursor_x_rect / 2 - rects[k].width / 2; //si adatta a metà dello spazio che rimane in cima
      } else if (rects[k].getClassName == "FollowingTransactionBlock") {
        //come prima posizione (index-1) se ci sono following in input
        rects[k].y = this.height_start + 20;
        rects[k].triHeight = this.triHeight;
        rects[k].height = this.previuos_following_h;
        rects[k].width = ((rects[k].height / 2) * this.triHeight);
        this.cursor_x_rect = this.cursor_x_rect - rects[k].width - this.width_gap_little;
        rects[k].x = this.cursor_x_rect;
      }

    }
    this.cursor_x_rect = centralTransaction.x + centralTransaction.width + this.width_gap_little;
    if (rects[index + 1].getClassName == "TransactionBlock") {
      this.cursor_x_rect = this.cursor_x_rect + this.width_gap_little * 2;
    }
    for (var k = index + 1; k < rects.length; k++) {
      if (rects[k].getClassName == "TransactionBlock" && rects[k].position == 1) {

        if (rects[k].getShow == false) {
          rects[k].y = this.height_start;
          rects[k].width = this.width_rect;
          rects[k].height = this.height_rect;
        } else {
          rects[k].y = this.height_start_expands;
          rects[k].width = this.width_rect;
          rects[k].height = this.height_rect_expands;
        }
        rects[k].color = this.config.getMinerColor(rects[k].getMiner)
        rects[k].x = this.cursor_x_rect;
        this.cursor_x_rect = this.cursor_x_rect + rects[k].width + this.width_gap_little;

        //setta le grandezze della transazione che deve essere mostrata
        let transaction_index = rects[k].transaction_index;

        rects[k].transaction[transaction_index].width = this.transaction_rect_y
        rects[k].transaction[transaction_index].height = this.transaction_rect_y
        rects[k].transaction[transaction_index].x = rects[k].x + rects[k].width / 2 - this.transaction_rect_y / 2
        rects[k].transaction[transaction_index].y = rects[k].y + rects[k].height / 2 + this.transaction_rect_gap_y - this.transaction_rect_y / 2

        if (rects[k].transaction.length != 1) {
          rects[k].checkPrevious();
          rects[k].checkFollowing();
          if (rects[k].getPrevious != null) {
            rects[k].getPrevious.width = this.transaction_rect_y / 4
            rects[k].getPrevious.height = this.transaction_rect_y / 2
            let space = rects[k].transaction[transaction_index].x - rects[k].x;
            rects[k].getPrevious.x = rects[k].x + (space - this.transaction_rect_y / 4) / 2
            rects[k].getPrevious.y = rects[k].y + rects[k].height / 2 + this.transaction_rect_gap_y - this.transaction_rect_y / 4;
          }
          if (rects[k].getFollowing != null) {
            rects[k].getFollowing.width = this.transaction_rect_y / 4
            rects[k].getFollowing.height = this.transaction_rect_y / 2
            let space = rects[k].x + rects[k].width - (rects[k].transaction[transaction_index].x + rects[k].transaction[transaction_index].width)
            rects[k].getFollowing.x = rects[k].transaction[transaction_index].x + rects[k].transaction[transaction_index].width + (space - this.transaction_rect_y / 4) / 2
            rects[k].getFollowing.y = rects[k].y + rects[k].height / 2 + this.transaction_rect_gap_y - this.transaction_rect_y / 4;
          }
        }

      } else if (rects[k].getClassName == "ClusterBlock") {
        rects[k].y = this.height_start_cluster;
        rects[k].width = this._calculateWidth(rects[k].getBlockId)
        rects[k].height = this.height_cluster;
        rects[k].index = k; //altrimenti tiene come indice quello in this.data (come accade nel Model)
        rects[k].x = this.cursor_x_rect;
        this.cursor_x_rect = this.cursor_x_rect + rects[k].width + this.width_gap_little;
      } else if (rects[k].getClassName == "PreviousTransactionBlock") {
        //come prima posizione(index+1) se ci sono previuos in output
        rects[k].y = this.height_start + 20;
        rects[k].triHeight = this.triHeight;
        rects[k].height = this.previuos_following_h;
        rects[k].width = ((rects[k].height / 2) * this.triHeight);
        rects[k].x = this.cursor_x_rect;
        this.cursor_x_rect = this.cursor_x_rect + rects[k].width + this.width_gap_little;
      } else if (rects[k].getClassName == "FollowingTransactionBlock") {
        //alla ultima posizione index-1 se ci sono following in output
        rects[k].y = this.height_start + 20;
        rects[k].triHeight = this.triHeight;
        rects[k].height = this.previuos_following_h;
        rects[k].width = ((rects[k].height / 2) * this.triHeight);
        this.cursor_x_rect = this.cursor_x_rect - this.width_gap_little;
        rects[k].x = this.cursor_x_rect - rects[k].width / 2 + (this.fixed_width - this.cursor_x_rect) / 2;
      }
    }
  }

  _spentTransactionsArrows(transaction) {
    for (var i = 0; i < transaction.length; i++) {
      let block_to = transaction[i].getBlock_to;

      if (block_to != null) {
        let block_from = transaction[i].getBlock_from;
        let show_from = block_from.getShow;
        let d = transaction[i].getDistance;
        let color;
        let show_to = null;
        let p1 = {};
        let p2 = {};
        let p3 = {};
        let gap_x_trans = this.transaction_rect_x / 5;  // per suddividere la trans iniziale in blocchi
        let gap_y = 4;
        let transaction_index = 0;

        show_to = block_to.getShow;
        color = this.config.COLOR.COLOR_RED_TRANS;
        if (show_from == true) {
          if (block_from.position == 0) {
            p1.x = block_from.transaction[block_from.transaction_index].x + block_from.transaction[block_from.transaction_index].width - d * gap_x_trans;
          } else {
            p1.x = block_from.x + this.width_rect / 2;
            if (transaction_index < block_from.transaction_index) {
              transaction_index = block_from.transaction_index;
            }
          }
          p1.y = block_from.transaction[block_from.transaction_index].y + block_from.transaction[block_from.transaction_index].height + gap_y


        } else {
          p1.x = block_from.x + this.width_rect / 2;
          p1.y = block_from.y + block_from.height + gap_y
        }

        if (show_to == true) {

          if (block_to.position == 0) {
            p3.x = block_to.transaction[block_to.transaction_index].x + d * gap_x_trans;
          } else {
            p3.x = block_to.x + this.width_rect / 2;
            if (transaction_index < block_to.transaction_index) {
              transaction_index = block_to.transaction_index;
            }
          }
          p3.y = block_from.transaction[block_from.transaction_index].y + block_from.transaction[block_from.transaction_index].height + gap_y

        } else {
          p3.x = block_to.x + this.width_rect / 2;
          p3.y = block_to.y + block_to.height + gap_y
        }

        p2.x = p1.x + (p3.x - p1.x) / 2;
        p2.y = p3.y + (p3.x - p1.x) / 3;
        transaction[i].color = color;
        //rect for I/O
        if (show_from == true && show_to == true) {
          transaction[i].transaction[transaction_index].rect = {
            width: this.io_rect_width,
            height: this.io_rect_height,
            x: p2.x - this.io_rect_width / 2,
            y: p1.y + (p2.y - p1.y) / 2 - this.io_rect_height / 2
          }
          //this._rectInputOutput(transaction[i].transaction[transaction_index], color);
        }
        transaction[i].transaction[transaction_index].p1 = { x: p1.x, y: p1.y }
        transaction[i].transaction[transaction_index].p2 = { x: p2.x, y: p2.y }
        transaction[i].transaction[transaction_index].p3 = { x: p3.x, y: p3.y }
        //this._transactionArrow(transaction[i].transaction[transaction_index], color);

      }
    }
  }

  _unspentTransactionsArrows(transaction) {
    let number = 0;
    let index = 0;
    for (var i = 0; i < transaction.length; i++) {
      let block_to = transaction[i].getBlock_to;
      if (block_to == null) {
        index = i;
        number = transaction[i].transaction.length // numero di trans unspent
      }
    }
    let gap = 50;
    let add = 0;
    if (number % 2 == 0) {
      add = gap / 2;
    }
    let count = 0;
    let block_from = transaction[index].getBlock_from;
    let show_from = block_from.getShow;
    let color = this.config.COLOR.COLOR_GREEN_TRANS;

    for (var i = 0; i < transaction[index].transaction.length; i++) {
      let p1 = {};
      let p2 = {};
      let p3 = {};
      let gap_y = 4;

      if (show_from == true && block_from.position == 0) {
        for (let j = 0; j < block_from.transaction.length; j++) {
          if (block_from.transaction[j].position == 0) { //setto la posizione in base alla trans in pos=0
            p1.x = block_from.transaction[j].x + block_from.transaction[j].width / 2;
            p1.y = block_from.transaction[j].y + block_from.transaction[j].height + gap_y
          }
        }
      }

      count++;
      if (count <= number / 2) {
        p3.x = p1.x - gap * (count) + add;
      } else {
        p3.x = p1.x + gap * (count - Math.ceil(number / 2)) - add;
      }

      p3.y = this.fixed_height - 80;
      p2.x = p1.x;
      p2.y = p1.y;

      transaction[index].transaction[i].rect = {
        width: this.io_rect_width,
        height: this.io_rect_height,
        x: p3.x - this.io_rect_width / 2,
        y: p3.y
      }
      //this._rectInputOutput(transaction[index].transaction[i], color);
      transaction[index].color = color;

      transaction[index].transaction[i].p1 = { x: p1.x, y: p1.y }
      transaction[index].transaction[i].p2 = { x: p2.x, y: p2.y }
      transaction[index].transaction[i].p3 = { x: p3.x, y: p3.y }
    }

    //this._transactionArrowUnspent(transaction[index]);
  }

  _drawSlider() {
    this.ctx.clearRect(this.range_input.x - 12.5, this.range_input.y - this.range_input.height / 2 - 20, this.range_input.width + 25, this.range_input.height + 25);

    this.range_input.x1 = this.range_input.x + this.range_input.width;
    this.range_input.y1 = this.range_input.y;
    // bar
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = this.config.COLOR.COLOR_SLIDER;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.range_input.x, this.range_input.y);
    this.ctx.lineTo(this.range_input.x1, this.range_input.y);
    this.ctx.stroke();
    // thumb
    this.ctx.beginPath();
    var thumbX_input = this.range_input.x + this.range_input.width * this.range_input.pct;
    this.ctx.moveTo(thumbX_input, this.range_input.y - this.range_input.height / 2);
    this.ctx.lineTo(thumbX_input, this.range_input.y + this.range_input.height / 2);
    this.ctx.strokeStyle = this.config.COLOR.COLOR_SLIDER_THUMB;
    this.ctx.stroke();

    this.ctx.clearRect(this.range_output.x - 12.5, this.range_output.y - this.range_output.height / 2 - 20, this.range_output.width + 25, this.range_output.height + 25);

    this.range_output.x1 = this.range_output.x + this.range_output.width;
    this.range_output.y1 = this.range_output.y;
    // bar
    this.ctx.lineWidth = 6;
    this.ctx.strokeStyle = this.config.COLOR.COLOR_SLIDER;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(this.range_output.x, this.range_output.y);
    this.ctx.lineTo(this.range_output.x1, this.range_output.y);
    this.ctx.stroke();
    // thumb
    this.ctx.beginPath();
    var thumbX_output = this.range_output.x + this.range_output.width * this.range_output.pct;
    this.ctx.moveTo(thumbX_output, this.range_output.y - this.range_output.height / 2);
    this.ctx.lineTo(thumbX_output, this.range_output.y + this.range_output.height / 2);
    this.ctx.strokeStyle = this.config.COLOR.COLOR_SLIDER_THUMB;
    this.ctx.stroke();
  }
}

export { TransactionView }