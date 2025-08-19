import { View } from './View.js';
import { Slider } from '../object/Slider.js';

const slider_x = 143;
const slider_width = 1080; 

class MinerView extends View {
    constructor(miner) {
        super();
        this.miner = miner;
        this.isDown = false;
        this.range = new Slider(slider_x, slider_width);
        this.font_clusterBlock = '14px helvetica';
        this.gap_lineCluster = 6;
        this.gap_textCluster = 20;
        this.max_numb = 9;
    }

    setPercentage({ perc, number }) {
        this.range.setPerc(perc);
        this.sliderTime = number;
    }

    clickSlider(callback) {
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            //console.log("MinerView - mousedown")
            let mousePoint = this._getMouseCoordinates(e);
            this.isDown = this.range.isInteraction(mousePoint)
        })

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.isDown) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            let mousePoint = this._getMouseCoordinates(e);
            //impostato dal model come all'inizio
            let pct = this.range.calcolatePerc(mousePoint);
            // console.log("perc: " + pct)
            callback(pct);
        })

        this.canvas.addEventListener('mouseup', (e) => {
            //console.log("MinerView - mouseup")
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            this.isDown = false;
        })
        this.canvas.addEventListener('mouseout', (e) => {
            //console.log("MinerView - mouseout")
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            this.isDown = false;
        })
    }
    mouseMoveCanvas(callback) {
        this.canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            e.stopPropagation();
            //console.log("View - mousemove")
            let mousePoint = this._getMouseCoordinates(e);
            if (this.range.isInteraction(mousePoint)) {
                this.canvas.style.cursor = "pointer"
            } else {
                callback({ x: mousePoint.x, y: mousePoint.y });
            }

        })
    }

    drawToolTip(toolTip) {
        if (toolTip.find) {
            var BB = this.canvas.getBoundingClientRect();
            this.tipCtx.clearRect(0, 0, this.tipCanvas.width, this.tipCanvas.height);
            this.tipCtx.font = '18px helvetica';
            var text1 = "From: " + toolTip.trans.block_from.id + " to: " + toolTip.trans.block_to.id;
            var text3 = "Value: " + toolTip.trans.value + " BTC";
            var text2 = "Count: " + toolTip.trans.count;
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
            this.tipCtx.fillText(text1, 5, 8);
            this.tipCtx.fillText(text3, 5, 33);
            this.tipCtx.fillText(text2, 5, 58);

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

    drawCanvas = (blocks, transaction) => {
        this._resetView();
        if (Array.isArray(blocks) && blocks.length) {
            this.range.draw(this.ctx, this.sliderTime);
            this._setCoordinates(blocks);
            this._setCoordinatesArrowBlock(transaction);
            this._drawingArrowsBlocks(transaction);
            this._drawingBlocks(blocks);
        } else {
            let message = "This miner hasn't validate blocks in this Timestamp period"
            this._drawMessage(message);
        }
    }
     
    _setCoordinates(blocks) {
        //set coordinates to central Block 
        let centralBlock;
        let index;
        let count = 0;
        let total = 0;
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].getClassName == "Block" || blocks[i].getClassName == "ClusterBlock") {
                total++;
            }
        }
        let maxCount;
    
        if (total == this.max_numb) { //=9 (schermata piena con il 5° al centro)
            maxCount = Math.floor(total / 2) + 1
        } else if (total%2==0) {
            maxCount= total / 2+1
        } else  {
            maxCount= Math.floor(total / 2)+1
        }

        //console.log( maxCount)
        for (var i = 0; i <= blocks.length && count < maxCount; i++) {
            if (blocks[i].getClassName == "Block") {
                centralBlock = blocks[i];
                index = i;
                count = count + 1;
            } else if (blocks[i].getClassName == "ClusterBlock") {
                //if(i!=0){
                    count = count + 1; 
                //}
            }
        }
        let width_half_canvas = this.fixed_width / 2;
        centralBlock.width = this.width_rect;
        centralBlock.x = width_half_canvas - centralBlock.width / 2;
        centralBlock.y = this.height_start;
        centralBlock.height = this.height_rect;
        centralBlock.color=this.config.getMinerColor(centralBlock.getMiner)

        this.cursor_x_rect = centralBlock.x;

        for (var k = index - 1; k >= 0; k--) {
            if (blocks[k].getClassName == "Block") {
                blocks[k].y = this.height_start;
                blocks[k].width = this.width_rect;
                blocks[k].height = this.height_rect;
                blocks[k].color=this.config.getMinerColor( blocks[k].getMiner)
                this.cursor_x_rect = this.cursor_x_rect - blocks[k].width - this.width_gap_little;
                blocks[k].x = this.cursor_x_rect;
            } else if (blocks[k].getClassName == "ClusterBlock") {
                blocks[k].y = this.height_start_cluster;
                blocks[k].width = this._calculateWidth(blocks[k].getBlockId)
                blocks[k].height = this.height_cluster;
                blocks[k].index = k; //altrimenti tiene come indice quello in this.data (come accade nel Model)
                this.cursor_x_rect = this.cursor_x_rect - blocks[k].width - this.width_gap_little;
                blocks[k].x = this.cursor_x_rect;
            } else if (blocks[k].getClassName == "PreviousBlock") {
                //come ultima posizione se ci sono previuos in input
                blocks[k].y = this.previuos_following_y;
                blocks[k].triHeight = this.triHeight;
                blocks[k].height = this.previuos_following_h;
                blocks[k].width = ((blocks[k].height / 2) * this.triHeight);
                blocks[k].x = this.cursor_x_rect / 2 - blocks[k].width / 2; //si adatta a metà dello spazio che rimane in cima
            }
        }

        this.cursor_x_rect = centralBlock.x + centralBlock.width + this.width_gap_little

        for (var k = index + 1; k < blocks.length; k++) {
            if (blocks[k].getClassName == "Block") {
                blocks[k].y = this.height_start;
                blocks[k].width = this.width_rect;
                blocks[k].height = this.height_rect;
                blocks[k].x = this.cursor_x_rect;
                blocks[k].color=this.config.getMinerColor( blocks[k].getMiner)

                this.cursor_x_rect = this.cursor_x_rect + blocks[k].width + this.width_gap_little;

            } else if (blocks[k].getClassName == "ClusterBlock") {
                blocks[k].y = this.height_start_cluster;
                blocks[k].width = this._calculateWidth(blocks[k].getBlockId)
                blocks[k].height = this.height_cluster;
                blocks[k].index = k; //altrimenti tiene come indice quello in this.data (come accade nel Model)
                blocks[k].x = this.cursor_x_rect;
                this.cursor_x_rect = this.cursor_x_rect + blocks[k].width + this.width_gap_little;
            } else if (blocks[k].getClassName == "FollowingBlock") {
                //alla ultima posizione index-1 se ci sono following in output
                blocks[k].y = this.previuos_following_y;
                blocks[k].triHeight = this.triHeight;
                blocks[k].height = this.previuos_following_h;
                blocks[k].width = ((blocks[k].height / 2) * this.triHeight);
                this.cursor_x_rect = this.cursor_x_rect - this.width_gap_little;
                blocks[k].x = this.cursor_x_rect - blocks[k].width / 2 + (this.fixed_width - this.cursor_x_rect) / 2;
            }
        }
    }
    
    _setCoordinatesArrowBlock(transaction) {
        for (var i = 0; i < transaction.length; i++) {
            let block_from = transaction[i].getBlock_from;
            let block_to = transaction[i].getBlock_to;
            let width_from = block_from.width;
            //let width_to = block_to.width;
            let d = transaction[i].getDistance;
            let step = width_from / this.max_numb;
            let block_to_x = block_to.x;
            let p1_y = block_from.y;
            let p2_y = block_from.y;
            let p3_y = block_to.y;

            let block_gap = Math.floor(this.max_numb / 2) + 1
            if (d <= block_gap) {
                p1_y = p1_y;
                p3_y = p3_y;

            } else {
                p1_y = p1_y + block_from.height;
                p3_y = p3_y + block_to.height + 2;
            }
            transaction[i].color_arrow = this.config.getMinerColor(block_to.guessed_miner).color_line;
            let p1_x = block_from.x + width_from - (step * d);
            let p3_x = block_to_x + step * (d);
            let p2_x = p1_x + (p3_x - p1_x) / 2;
            if (d <= block_gap) {
                p2_y = p2_y - (p3_x - p1_x) / 3;
            } else {
                p2_y = p2_y + (p3_x - p1_x) / 4;
            }

            transaction[i].p1 = { x: p1_x, y: p1_y }
            transaction[i].p2 = { x: p2_x, y: p2_y }
            transaction[i].p3 = { x: p3_x, y: p3_y }
        }
    }

   /* _drawSlider() {
        this.ctx.clearRect(this.range.x - 12.5, this.range.y - this.range.height / 2 - 20, this.range.width + 25, this.range.height + 25);

        this.range.x1 = this.range.x + this.range.width;
        this.range.y1 = this.range.y;
        // bar
        this.ctx.lineWidth = 6;
        this.ctx.strokeStyle = this.config.COLOR.COLOR_SLIDER;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(this.range.x, this.range.y);
        this.ctx.lineTo(this.range.x1, this.range.y);
        this.ctx.stroke();
        // thumb
        this.ctx.beginPath();

        var thumbX = this.range.x + this.range.width * this.range.pct;
        this.ctx.moveTo(thumbX, this.range.y - this.range.height / 2);
        this.ctx.lineTo(thumbX, this.range.y + this.range.height / 2);
        this.ctx.strokeStyle = this.config.COLOR.COLOR_SLIDER_THUMB;
        this.ctx.stroke();

        // time
        this.ctx.fillStyle = this.config.COLOR.COLOR_SLIDER_THUMB;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.font = '20px arial';
        if (this.sliderTime != undefined)
            this.ctx.fillText(this.sliderTime, this.range.x + this.range.width / 2, this.range.y - this.range.height / 2 - 5);
    }*/
}


export { MinerView }