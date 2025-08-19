import { View } from './View.js';
import { Slider } from '../object/Slider.js';

const slider_x = 143;
const slider_width = 1080;

class CombinedView extends View {
    constructor() {
        super();
        this.isDown = false;
        this.range = new Slider(slider_x, slider_width);
        this.font_clusterBlock = '24px helvetica';
        this.gap_textCluster = 30;
        this.gap_lineCluster = 8;
    }

    setPercentage({ perc, number }) {
        this.range.setPerc(perc);
        this.sliderTime = number;
    }


    clickSlider(callback) {
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            //console.log("BlockView - mousedown")
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
            //console.log("BlockView - mouseup")
            // tell the browser we're handling this event
            e.preventDefault();
            e.stopPropagation();
            this.isDown = false;
        })
        this.canvas.addEventListener('mouseout', (e) => {
            //console.log("BlockView - mouseout")
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
            //console.log("BlockView - mousemove")
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
            let message = "No data to display"
            this._drawMessage(message);
        }
    }

    _setCoordinates(rects) {
        // check firts and last visualization for setting right values
        this.max_numb_rect = 6; //lo potrei calcolare andando a contare il numero di Block!
        if (rects[0].getClassName == 'Block' || rects[rects.length - 1].getClassName == 'Block') {
            this.max_numb_rect = 7;
            this.cursor_x_rect = this.cursor_x_rect + 20;
        }
        for (var i = 0; i < rects.length; i++) {
            rects[i].x = this.cursor_x_rect;
            if (rects[i].getClassName == 'Block' ) {
                rects[i].y = this.height_start;
                rects[i].width = this.width_rect;
                rects[i].height = this.height_rect;
                rects[i].color=this.config.getMinerColor(rects[i].getMiner)

            } else if (rects[i].getClassName == 'ClusterBlock') {
                rects[i].y = this.height_start;
                rects[i].width = this._calculateWidth(rects[i].getBlockId)
                rects[i].height = this.height_rect;
            }
            this.cursor_x_rect = this.cursor_x_rect + rects[i].width + this.width_gap_little
        }
    }

    _setCoordinatesArrowBlock(transaction) {
        for (var i = 0; i < transaction.length; i++) {
            let block_from = transaction[i].getBlock_from;
            let block_to = transaction[i].getBlock_to;
            let lineWidth = transaction[i].getLineWidth;
            let lineRect = 5;
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

            if (block_from.getClassName == 'Block' && block_to.getClassName == 'ClusterBlock') {
                block_to_x = block_to_x + ((block_to.height / 2) * this.triHeight);
                width_to = width_to - ((block_to.height / 2) * this.triHeight);
                step_from = width_from / 3;
                step_to = width_to / (this.max_numb_rect + 1);
                i_from = 1;
                i_to = d;
                transaction[i].color_arrow = this.config.COLOR.COLOR_GREY;
                p2_y = p2_y + block_from.height + (block_from.y * d / 4) - lineWidth * 2;
                p1_y = p1_y + block_from.height;
                p3_y = p3_y + block_to.height + 6;
            } else if (block_from.getClassName == 'ClusterBlock' && block_to.getClassName == 'Block') {
                width_from = width_from - ((block_from.height / 2) * this.triHeight)
                step_from = width_from / (this.max_numb_rect + 1);
                step_to = width_to / 3;
                i_from = d;
                i_to = 1;
                transaction[i].color_arrow = this.config.getMinerColor(block_to.guessed_miner).color_line;
                p2_y = p2_y + block_from.height + (block_from.y * d / 4) - lineWidth * 2;
                p1_y = p1_y + block_from.height + 6;
                p3_y = p3_y + block_to.height + lineRect - lineWidth / 4;
            } else if (block_from.getClassName == 'ClusterBlock' && block_to.getClassName == 'ClusterBlock') {
                block_to_x = block_to_x + ((block_to.height / 2) * this.triHeight);
                width_to = width_to - ((block_to.height / 2) * this.triHeight);
                width_from = width_from - ((block_from.height / 2) * this.triHeight)
                step_from = width_from / 2;
                step_to = width_to / 2;
                i_from = 1;
                i_to = 1;
                transaction[i].color_arrow = this.config.COLOR.COLOR_GREY;
                p2_y = p2_y - (block_from.y * d / 4) + lineWidth * 2;
                p1_y = p1_y - 7;
                p3_y = p3_y - 7;
            } else {
                step_from = width_from / this.max_numb_rect;
                step_to = width_to / this.max_numb_rect;
                i_from = d;
                i_to = d;
                transaction[i].color_arrow = this.config.getMinerColor(block_to.guessed_miner).color_line;
                p2_y = p2_y - (block_from.y * d / 4) + lineWidth * 2;
                p1_y = p1_y;
                p3_y = p3_y - lineRect + lineWidth / 4;
            }

            let p1_x = block_from.x + width_from - (step_from * i_from);
            let p3_x = block_to_x + step_to * (i_to);
            let p2_x = p1_x + (p3_x - p1_x) / 2;

            transaction[i].p1 = { x: p1_x, y: p1_y }
            transaction[i].p2 = { x: p2_x, y: p2_y }
            transaction[i].p3 = { x: p3_x, y: p3_y }
        }
    }

    
}

export { CombinedView }