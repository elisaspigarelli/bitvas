class BlockArrow {
    constructor(block_from, block_to, arrow, d) {
        this.block_from = block_from;
        this.block_to = block_to;
        this.guessed_miner = block_to.guessed_miner
        this.count = arrow.count;
        this.value = arrow.value;
        this.lineWidth = arrow.lineWidth;
        this.distance = d;
        this.p1;
        this.p2;
        this.p3;
    }
    get getBlock_from() {
        return this.block_from;
    }
    get getBlock_to() {
        return this.block_to;
    }
    get getBlock_from_Id() {
        return this.block_from.getBlockId;
    }
    get getBlock_to_Id() {
        return this.block_to.getBlockId;
    }
    get getMiner() {
        return this.guessed_miner;
    }
    get getLineWidth() {
        return this.lineWidth;
    }
    get getCount() {
        return this.count;
    }
    get getDistance() {
        return this.distance;
    }
    get getClassName() {
        return this.constructor.name;
    }

    isInteraction(coord) {
        let result = false;
        for (var k = 0; k < 100; k++) {
            var t = k / 100;
            var t2 = (1 - t) * (1 - t)
            let x = t2 * this.p1.x + 2 * (1 - t) * t * this.p2.x + t * t * this.p3.x;
            let y = t2 * this.p1.y + 2 * (1 - t) * t * this.p2.y + t * t * this.p3.y;
            if (coord.x >= x - 3 && coord.x <= x + 3 && coord.y >= y - 3 && coord.y <= y + 3) {
                result = true;
            }
        }
        return result;
    }

    draw(ctx) {
        if (this.block_from.getBlockId != this.block_to.getBlockId) {
            ctx.beginPath();
            ctx.strokeStyle = this.color_arrow;
            ctx.lineWidth = this.getLineWidth;
            ctx.lineCap = 'round';
            ctx.moveTo(this.p1.x, this.p1.y);
            ctx.quadraticCurveTo(this.p2.x, this.p2.y, this.p3.x, this.p3.y);
            ctx.stroke();
            var headlen = 10; // length of head in pixels
            var dx = this.p3.x - this.p2.x;
            var dy = this.p3.y - this.p2.y;
            var angle = Math.atan2(dy, dx);

            ctx.beginPath();
            ctx.strokeStyle = this.color_arrow;
            ctx.moveTo(this.p3.x, this.p3.y)
            ctx.lineTo(this.p3.x - headlen * Math.cos(angle - Math.PI / 7), this.p3.y - headlen * Math.sin(angle - Math.PI / 7));
            ctx.lineTo(this.p3.x - headlen * Math.cos(angle + Math.PI / 7), this.p3.y - headlen * Math.sin(angle + Math.PI / 7));
            ctx.lineTo(this.p3.x, this.p3.y)
            ctx.lineTo(this.p3.x - headlen * Math.cos(angle - Math.PI / 7), this.p3.y - headlen * Math.sin(angle - Math.PI / 7));
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = this.color_arrow;
            ctx.lineTo(this.p3.x - headlen * Math.cos(angle - Math.PI / 7), this.p3.y - headlen * Math.sin(angle - Math.PI / 7));
            ctx.lineTo(this.p3.x - headlen * Math.cos(angle + Math.PI / 7), this.p3.y - headlen * Math.sin(angle + Math.PI / 7));
            ctx.lineTo(this.p3.x, this.p3.y)
            ctx.lineTo(this.p3.x - headlen * Math.cos(angle - Math.PI / 7), this.p3.y - headlen * Math.sin(angle - Math.PI / 7));
            ctx.fill();
        }
    }
}

export { BlockArrow };