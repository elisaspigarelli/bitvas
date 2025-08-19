import { View } from './View.js';
import { Slider } from '../object/Slider.js';

const slider_x_input = 123;
const slider_x_output = 803;
const slider_width = 440;

class NeighbourView extends View {
    constructor() {
        super();
        this.font_clusterBlock = '14px helvetica';
        this.gap_lineCluster = 6;
        this.gap_textCluster = 15;

        this.max_numb = 4;
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
            console.log("NeighbourView - mousedown")
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
                // console.log("perc_input: " + pct_input)
                pct = { input: pct_input, output: this.range_output.getPerc }
            } else {
                let pct_output = this.range_output.calcolatePerc(mousePoint);
                // console.log("pct_output: " + pct_output)
                pct = { input: this.range_input.getPerc, output: pct_output }
            }

            callback(pct);
        })

        this.canvas.addEventListener('mouseup', (e) => {
            //console.log("NeighbourView - mouseup")
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            this.isDown_input = false;
            this.isDown_output = false;
        })

        this.canvas.addEventListener('mouseout', (e) => {
            //console.log("NeighbourView - mouseout")
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
            console.log("NeighbourView - mousemove")
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

    drawCanvas = (blocks, transaction, input) => {
        this._resetView();
        this.blockId = input;
        if (Array.isArray(blocks) && blocks.length) {
            this.range_input.draw(this.ctx);
            this.range_output.draw(this.ctx);
            this._setCoordinates(blocks);
            this._setCoordinatesArrowBlock(transaction)
            this._drawingArrowsBlocks(transaction);
            this._drawingBlocks(blocks);
        } else {
            let message = "No data to display"
            this._drawMessage(message);
        }
    }

    _setCoordinates(blocks) {
        //set coordinates to central Block 
        let centralBlock;
        let index;
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].getClassName == "Block" && blocks[i].getBlockId == this.blockId) {
                centralBlock = blocks[i];
                index = i;
            }
        }
        let width_half_canvas = this.fixed_width / 2;
        centralBlock.width = this.width_rect;
        centralBlock.x = width_half_canvas - centralBlock.width / 2;
        centralBlock.y = this.height_start;
        centralBlock.height = this.height_rect;
        centralBlock.color = this.config.getMinerColor(centralBlock.getMiner);

        let allBlocks_input = true;
        let number_input_block = 0;
        for (var k = index - 1; k >= 0; k--) {
            if (blocks[k].getClassName == "Block") {
                number_input_block++;
            } else if (blocks[k].getClassName == "ClusterBlock") {
                number_input_block++;
                allBlocks_input = false;
            }
        }

        let gap_input_before = 0;
        let gap_input_after = 0;
        if (number_input_block == this.max_numb) {
            this.cursor_x_rect = centralBlock.x;
            if (allBlocks_input) {
                gap_input_before = 5;
                gap_input_after = this.width_gap_little / 2
            } else {
                gap_input_before = this.width_gap_little / 2;
                gap_input_after = 0;
            }


        } else {
            this.cursor_x_rect = centralBlock.x - this.width_gap_little; //metto un gap per centrare il disegno
        }

        for (var k = index - 1; k >= 0; k--) {
            if (blocks[k].getClassName == "Block") {
                blocks[k].y = this.height_start;
                blocks[k].width = this.width_rect;
                blocks[k].height = this.height_rect;
                blocks[k].color = this.config.getMinerColor(blocks[k].getMiner);
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
            } else if (blocks[k].getClassName == "FollowingBlock") {
                //come prima posizione (index-1) se ci sono following in input
                blocks[k].y = this.previuos_following_y;
                blocks[k].triHeight = this.triHeight;
                blocks[k].height = this.previuos_following_h;
                blocks[k].width = ((blocks[k].height / 2) * this.triHeight);
                this.cursor_x_rect = this.cursor_x_rect - blocks[k].width - gap_input_before;
                blocks[k].x = this.cursor_x_rect;
                this.cursor_x_rect = this.cursor_x_rect + gap_input_after;
            }

        }

        let allBlocks_output = true;
        let number_output_block = 0;
        for (var k = index + 1; k < blocks.length; k++) {
            if (blocks[k].getClassName == "Block") {
                number_output_block++;
            } else if (blocks[k].getClassName == "ClusterBlock") {
                number_output_block++;
                allBlocks_output = false;
            }
        }

        let gap_output_before = 0
        let gap_output_after = 0;
        if (number_output_block == this.max_numb) {
            this.cursor_x_rect = centralBlock.x + centralBlock.width + this.width_gap_little;
            if (allBlocks_output) {
                gap_output_before = this.width_gap_little - 5;
                gap_output_after = this.width_gap_little / 2
            } else {
                gap_output_before = this.width_gap_little / 2;
                gap_output_after = this.width_gap_little;
            }
        } else {
            this.cursor_x_rect = centralBlock.x + centralBlock.width + this.width_gap_little * 2; //metto un gap per centrare il disegno
            gap_output_after = this.width_gap_little;
            gap_output_before = this.width_gap_little;
        }
        //console.log(this.cursor_x_rect)
        for (var k = index + 1; k < blocks.length; k++) {
            if (blocks[k].getClassName == "Block") {
                blocks[k].y = this.height_start;
                blocks[k].width = this.width_rect;
                blocks[k].height = this.height_rect;
                blocks[k].x = this.cursor_x_rect;
                blocks[k].color = this.config.getMinerColor(blocks[k].getMiner)
                this.cursor_x_rect = this.cursor_x_rect + blocks[k].width + this.width_gap_little;

            } else if (blocks[k].getClassName == "ClusterBlock") {
                blocks[k].y = this.height_start_cluster;
                blocks[k].width = this._calculateWidth(blocks[k].getBlockId)
                blocks[k].height = this.height_cluster;
                blocks[k].index = k; //altrimenti tiene come indice quello in this.data (come accade nel Model)
                blocks[k].x = this.cursor_x_rect;
                this.cursor_x_rect = this.cursor_x_rect + blocks[k].width + this.width_gap_little;
            } else if (blocks[k].getClassName == "PreviousBlock") {
                //come prima posizione(index+1) se ci sono previuos in output
                blocks[k].y = this.previuos_following_y;
                blocks[k].triHeight = this.triHeight;
                blocks[k].height = this.previuos_following_h;
                blocks[k].width = ((blocks[k].height / 2) * this.triHeight);
                blocks[k].x = this.cursor_x_rect - gap_output_before;
                this.cursor_x_rect = this.cursor_x_rect - gap_output_before + blocks[k].width + gap_output_after;
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
            //let lineWidth = transaction[i].getLineWidth;
            //let lineRect = 5;
            let width_from = block_from.width;
            let width_to = block_to.width;
            let d = transaction[i].getDistance;
            let step_from;
            let step_to;
            let i_from;
            let i_to;
            let block_to_x = block_to.x;
            let p1_y = block_from.y;
            let p2_y = block_from.y;
            let p3_y = block_to.y;

            if (block_to.getBlockId != this.blockId || block_from.getBlockId != this.blockId) {
                if (block_to.getBlockId == this.blockId) {
                    // transazione che entra nel blockID
                    step_from = width_from / 2;
                    step_to = width_to / (this.max_numb + 1);
                    i_from = 1;
                    i_to = d;
                    p1_y = p1_y;
                    p3_y = p3_y //- lineRect + lineWidth / 4;
                    //p2_y = p2_y - (block_from.y * d / 4) + lineWidth * 2;
                } else if (block_from.getBlockId == this.blockId) {
                    step_from = width_from / (this.max_numb + 1);
                    step_to = width_to / 2;
                    i_from = d;
                    i_to = 1;
                    p1_y = p1_y + block_from.height;
                    p2_y = p2_y + block_from.height; // + (block_from.y * d / 4) - lineWidth * 2;
                    p3_y = p3_y + block_from.height //- lineRect + lineWidth / 4;

                }

                transaction[i].color_arrow = this.config.getMinerColor(block_to.guessed_miner).color_line;

                let p1_x = block_from.x + width_from - (step_from * i_from);
                let p3_x = block_to_x + step_to * (i_to);
                let p2_x = p1_x + (p3_x - p1_x) / 2;

                if (block_to.getBlockId == this.blockId) {
                    p2_y = p2_y - (p3_x - p1_x) / 3;
                } else if (block_from.getBlockId == this.blockId) {
                    p2_y = p2_y + (p3_x - p1_x) / 3;
                }

                transaction[i].p1 = { x: p1_x, y: p1_y }
                transaction[i].p2 = { x: p2_x, y: p2_y }
                transaction[i].p3 = { x: p3_x, y: p3_y }
            }

        }
    }

    /*_drawSlider() {
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
    }*/
}
export { NeighbourView }