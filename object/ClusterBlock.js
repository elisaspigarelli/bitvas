const  triHeight = Math.tan(45 * Math.PI / 180);

class ClusterBlock {
    constructor(block, index) {
        this.id = block.id;
        this.index = index;
       
    }

    get getBlockId() {
        return this.id;
    }
    get getIndexBlock() {
        return this.index;
    }
    get getClassName() {
        return this.constructor.name;
    }

    draw(ctx, start, end, gap_lineCluster, font_clusterBlock) {
        let triangle_x = ((this.height / 2) * triHeight);
        let width = this.width - triangle_x;
        if (start == true && end == true) {
          width = width - triangle_x;
        }
    
        let x = this.x;
        if (end) {
          x = x + triangle_x;
        }
    
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(x, this.y);
        ctx.lineTo(x + width, this.y);
        if (start) {
          ctx.lineTo(x + width + triangle_x, this.y + this.height / 2);
        }
        ctx.lineTo(x + width, this.y + this.height);
        ctx.lineTo(x, this.y + this.height);
        if (end) {
          ctx.lineTo(x - triangle_x, this.y + this.height / 2);
        }
        ctx.lineTo(x, this.y);
        ctx.stroke();
        var x1 = x - gap_lineCluster / 2;
        var y1 = this.y - gap_lineCluster / 2;
        var width1 = width + gap_lineCluster;
        var height1 = this.height + gap_lineCluster;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + width1, y1);
        if (start) {
          ctx.lineTo(x1 + width1 + ((height1 / 2) * triHeight), y1 + height1 / 2);
        }
        ctx.lineTo(x1 + width1, y1 + height1);
        ctx.lineTo(x1, y1 + height1);
        if (end) {
          ctx.lineTo(x1 - ((height1 / 2) * triHeight), y1 + height1 / 2);
        }
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.fillStyle = "#dad6d6";
        ctx.beginPath();
        ctx.moveTo(x, this.y);
        ctx.lineTo(x + width, this.y);
        if (start) {
          ctx.lineTo(x + width + triangle_x, this.y + this.height / 2);
        }
        ctx.lineTo(x + width, this.y + this.height);
        ctx.lineTo(x, this.y + this.height);
        if (end) {
          ctx.lineTo(x - triangle_x, this.y + this.height / 2);
        }
        ctx.lineTo(x, this.y);
        ctx.fill();
    
        ctx.fillStyle = 'black';
        ctx.font =font_clusterBlock;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(this.id, this.x + this.width / 2, this.y + (this.height / 2));
      }
    
}

export {  ClusterBlock};