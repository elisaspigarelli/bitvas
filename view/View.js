
import { ConfigView } from './ConfigView.js';

class View {

  constructor() {
    this.config = new ConfigView();

    this.root = document.getElementById("root");

    this.canvas = document.createElement("canvas");
    this.canvas.className = "myCanvas";
    this.tabWrap = document.getElementById("myTabs");
    this.fixed_width = 1366;
    this.fixed_height = 420;
    this.fixed_par = 2 / 3;
    this.width_canvas = this.canvas.width = window.innerWidth;
    this.height_canvas = this.canvas.height = window.innerHeight * this.fixed_par;
    this.scale_w = this.width_canvas / this.fixed_width;
    this.scale_h = this.height_canvas / this.fixed_height;

    this.ctx = this.canvas.getContext('2d'); //to get drawing context
    this.ctx.scale(this.scale_w, this.scale_h)
    this.ctx.save();
    this.root.insertBefore(this.canvas, this.tabWrap);
    this.tipCanvas = document.getElementById("tip");
    this.tipCtx = this.tipCanvas.getContext("2d");

    this.shift_cursor = 0;
    this.max_numb_rect;
    this.gap_start = 40;

    this.width_gap_big = 50;
    this.width_gap_little = 25;

    this.width_rect = 120;
    this.height_rect = 80;
    this.height_start = 150;

    this.extra_expands_h = 50;
    this.height_start_expands = this.height_start - (this.extra_expands_h / 2);
    this.height_rect_expands = this.height_rect + this.extra_expands_h;
    this.width_rect_expands = this.width_rect + this.extra_expands_h;
    this.transaction_rect_x = 120;
    this.transaction_rect_y = 50;
    this.transaction_rect_gap_y = 10;
    this.triHeight = Math.tan(45 * Math.PI / 180);
    //this.radius_rect = 15;
    this.radius_trans = 5;

    this.height_cluster = this.height_rect / 2;
    this.height_start_cluster = this.height_start + this.height_cluster / 2;
    this.previuos_following_h = 30;
    this.previuos_following_y = this.height_start + (this.height_rect - this.previuos_following_h) / 2;

  }

  _getMouseCoordinates(e) {
    var BB = this.canvas.getBoundingClientRect();
    var BBoffsetX = BB.left;
    var BBoffsetY = BB.top;
    // calculate the mouse position
    let mousePoint = {
      x: (e.clientX - BBoffsetX) / this.scale_w,
      y: (e.clientY - BBoffsetY) / this.scale_h
    };
    return mousePoint;
  }

  clickCanvas(callback) {
    this.canvas.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      //console.log("View - click")
      let mousePoint = this._getMouseCoordinates(e);
      callback({ x: mousePoint.x, y: mousePoint.y });
    })
  }

  toolTip(callback) {
    this.canvas.addEventListener('mousemove', (e) => {
      //  console.log("View.toolTip - mousemove")
      e.preventDefault();
      e.stopPropagation();
      let mousePoint = this._getMouseCoordinates(e);
      callback({ x: mousePoint.x, y: mousePoint.y, x_real: e.clientX, y_real: e.clientY });
    });
  }

  mouseMove(cursor) {
    //change cursor if true
    if (cursor) {
      this.canvas.style.cursor = "pointer"
    } else {
      this.canvas.style.cursor = "default"
    }
  }

  removeCanvas() {
    //console.log("remove canvas");
    this.canvas.remove();
  }
  _resetView() {
    this.ctx.clearRect(0, 0, this.width_canvas, this.height_canvas);
    this.ctx.restore();
    this.ctx.save();
    this.cursor_x_rect = this.gap_start;
  }

  resizeWindow() {
    window.addEventListener('resize', () => {
      this.scale_w = window.innerWidth / this.fixed_width;
      this.scale_h = window.innerHeight * this.fixed_par / this.fixed_height;
      this.ctx.scale(this.scale_w, this.scale_h)
    })
  }

  _calculateWidth(text) {
    this.ctx.font = this.font_clusterBlock;
    var text_ctx = this.ctx.measureText(text);
    return text_ctx.width + this.gap_textCluster;
  }

  _drawingBlocks(rects) {
    for (var i = 0; i < rects.length; i++) {
      if (rects[i].getClassName == 'ClusterBlock') {
        let index = rects[i].getIndexBlock;
        let start = true;
        let end = true;
        if (index == 0) {
          end = false;
        } else if (index == rects.length - 1) {
          start = false;
        }
        rects[i].draw(this.ctx, start, end, this.gap_lineCluster, this.font_clusterBlock);
      } else {
        rects[i].draw(this.ctx);
      }
    }
  }
  _drawingArrowsBlocks(transaction) {
    for (var i = 0; i < transaction.length; i++) {
      transaction[i].draw(this.ctx);
    }
  }
  _drawMessage(message) {
    let width_half_canvas = this.fixed_width / 2;
    let height_half_canvas = this.fixed_height / 2;
    this.ctx.font = '18px helvetica';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(message, width_half_canvas, height_half_canvas);
  }

}
export { View };