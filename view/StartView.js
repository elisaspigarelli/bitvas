import { Slider } from '../object/Slider.js';
import { ConfigView } from './ConfigView.js';

/*const slider_x = 25;
const slider_width = 250;
const slider_y = 140;
const slider_height = 10;*/
const slider_x = 143;
const slider_width = 1080;

class StartView {

    constructor() {
        this.buttons = document.getElementsByTagName('button');
        this.inputs = document.getElementsByTagName('input');
        this.welcome = document.getElementById('welcome');
        this.start = 0;

        this.canvas = document.getElementById('combine_visualization')
        this.ctx = this.canvas.getContext('2d');
        this.width_canvas = this.canvas.width
        this.height_canvas = this.canvas.height
        this.fixed_width = 1366;
        this.fixed_height = 420;
        this.scale_w = this.width_canvas / this.fixed_width;
        this.scale_h = this.height_canvas / this.fixed_height;
        this.ctx.scale(this.scale_w, this.scale_h)
        this.ctx.save();

        this.config = new ConfigView();
        /*this.font_clusterBlock = '8px helvetica';
        this.gap_textCluster = 6;
        this.gap_lineCluster = 4;*/
        this.font_clusterBlock = '24px helvetica';
        this.gap_textCluster = 30;
        this.gap_lineCluster = 8;


        this.gap_start = 40;
        this.width_gap_big = 50;
        this.width_gap_little = 25;
    
        this.width_rect = 120;
        this.height_rect = 80;
        this.height_start = 150;
        this.triHeight = Math.tan(45 * Math.PI / 180);
        /*this.width_rect = 30;
        this.height_rect = 30;
        this.height_start = (this.height_canvas - 20 - this.height_rect) / 2;
        this.width_gap_little = 5;*/
    }

    clickButton(callback) {
        this.buttons[0].addEventListener('click', (e) => {
            e.preventDefault()
            console.log("StartView - click DATE")
            this._removeWelcome();
            callback(0, this.inputs[0].value)
        })
        this.buttons[1].addEventListener('click', (e) => {
            e.preventDefault()
            console.log("StartView - click TRANS");
            this._removeWelcome();
            callback(1, this.inputs[1].value)
        })
    }

    _removeWelcome() {
        if (this.start == 0) {
            this.welcome.remove();
        }
        this.start++;
    }

    drawStarting(blocks, transaction) {
        console.log("drawStarting")
        this.range = new Slider(slider_x, slider_width);
        this.range.setPerc(0.5);
        this._setCoordinates(blocks);
        this._setCoordinatesArrowBlock(transaction);

        this.range.draw(this.ctx);
        for (var i = 0; i < transaction.length; i++) {
            transaction[i].draw(this.ctx);
        }
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].getClassName == 'ClusterBlock') {
                let index = blocks[i].getIndexBlock;
                let start = true;
                let end = true;
                if (index == 0) {
                    end = false;
                } else if (index == blocks.length - 1) {
                    start = false;
                }
                blocks[i].draw(this.ctx, start, end, this.gap_lineCluster, this.font_clusterBlock);
            } else if (blocks[i].getClassName == 'Block') {
                blocks[i].draw(this.ctx);
            } else {
                blocks[i].draw(this.ctx);
            }
        }
    }
    _setCoordinates(rects) {
        this.max_numb_rect = 6;
        this.cursor_x_rect = this.gap_start;
        for (var i = 0; i < rects.length; i++) {
            rects[i].x = this.cursor_x_rect;
            if (rects[i].getClassName == 'Block') {
                rects[i].y = this.height_start;
                rects[i].width = this.width_rect;
                rects[i].height = this.height_rect;
                rects[i].color = this.config.getMinerColor(rects[i].getMiner)

            } else if (rects[i].getClassName == 'ClusterBlock') {
                rects[i].y = this.height_start;
                this.ctx.font = this.font_clusterBlock;
                var text_ctx = this.ctx.measureText(rects[i].getBlockId);
                rects[i].width = text_ctx.width + this.gap_textCluster;
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

export { StartView };