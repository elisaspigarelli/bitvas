class TransactionArrow {
    constructor(block_from, block_to, distance, transaction) {
        this.block_from = block_from;
        this.block_to = block_to;
        this.transaction = transaction;
        this.distance = distance;
    }
    get getDistance() {
        return this.distance;
    }
    get getBlock_from() {
        return this.block_from;
    }
    get getBlock_to() {
        return this.block_to;
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

    isInteractionRect(coord) {
        let result = { find: false };
        if (this.block_from != null && this.block_from.getShow && this.block_to != null && this.block_to.getShow) {
            let index = Math.max(this.block_from.transaction_index, this.block_to.transaction_index);
            if (coord.x >= this.transaction[index].rect.x && coord.x <= this.transaction[index].rect.x + this.transaction[index].rect.width && coord.y >= this.transaction[index].rect.y && coord.y <= this.transaction[index].rect.y + this.transaction[index].rect.height) {
                result.find = true;
                result.trans = this.transaction[index]
            }
        } else if (this.block_to == null) {
            for (let j = 0; j < this.transaction.length; j++) {
                if (coord.x >= this.transaction[j].rect.x && coord.x <= this.transaction[j].rect.x + this.transaction[j].rect.width && coord.y >= this.transaction[j].rect.y && coord.y <= this.transaction[j].rect.y + this.transaction[j].rect.height) {
                    result.find = true;
                    result.trans = this.transaction[j]
                }
            }
        }

        return result;
    }

    draw(ctx) {
        if (this.block_to != null) {
            let transaction_index = Math.max(this.block_from.transaction_index, this.block_to.transaction_index);
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.moveTo(this.transaction[transaction_index].p1.x, this.transaction[transaction_index].p1.y);
            ctx.quadraticCurveTo(this.transaction[transaction_index].p2.x, this.transaction[transaction_index].p2.y, this.transaction[transaction_index].p3.x, this.transaction[transaction_index].p3.y);
            ctx.stroke();
            var headlen = 10; // length of head in pixels
            var dx = this.transaction[transaction_index].p3.x - this.transaction[transaction_index].p2.x;
            var dy = this.transaction[transaction_index].p3.y - this.transaction[transaction_index].p2.y;
            var angle = Math.atan2(dy, dx);

            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.moveTo(this.transaction[transaction_index].p3.x, this.transaction[transaction_index].p3.y)
            ctx.lineTo(this.transaction[transaction_index].p3.x - headlen * Math.cos(angle - Math.PI / 7), this.transaction[transaction_index].p3.y - headlen * Math.sin(angle - Math.PI / 7));
            ctx.lineTo(this.transaction[transaction_index].p3.x - headlen * Math.cos(angle + Math.PI / 7), this.transaction[transaction_index].p3.y - headlen * Math.sin(angle + Math.PI / 7));
            ctx.lineTo(this.transaction[transaction_index].p3.x, this.transaction[transaction_index].p3.y)
            ctx.lineTo(this.transaction[transaction_index].p3.x - headlen * Math.cos(angle - Math.PI / 7), this.transaction[transaction_index].p3.y - headlen * Math.sin(angle - Math.PI / 7));
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.lineTo(this.transaction[transaction_index].p3.x - headlen * Math.cos(angle - Math.PI / 7), this.transaction[transaction_index].p3.y - headlen * Math.sin(angle - Math.PI / 7));
            ctx.lineTo(this.transaction[transaction_index].p3.x - headlen * Math.cos(angle + Math.PI / 7), this.transaction[transaction_index].p3.y - headlen * Math.sin(angle + Math.PI / 7));
            ctx.lineTo(this.transaction[transaction_index].p3.x, this.transaction[transaction_index].p3.y)
            ctx.lineTo(this.transaction[transaction_index].p3.x - headlen * Math.cos(angle - Math.PI / 7), this.transaction[transaction_index].p3.y - headlen * Math.sin(angle - Math.PI / 7));
            ctx.fill();
            if (this.block_from.getShow == true && this.block_to.getShow == true) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.fillRect(this.transaction[transaction_index].rect.x, this.transaction[transaction_index].rect.y, this.transaction[transaction_index].rect.width, this.transaction[transaction_index].rect.height);
            }
        } else {
            for (let i = 0; i < this.transaction.length; i++) {
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.strokeStyle = this.color
                ctx.moveTo(this.transaction[i].p1.x, this.transaction[i].p1.y);
                ctx.lineTo(this.transaction[i].p3.x, this.transaction[i].p3.y);
                ctx.stroke();
                var headlen = 10; // length of head in pixels
                var dx = this.transaction[i].p3.x - this.transaction[i].p2.x;
                var dy = this.transaction[i].p3.y - this.transaction[i].p2.y;
                var angle = Math.atan2(dy, dx);

                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.moveTo(this.transaction[i].p3.x, this.transaction[i].p3.y)
                ctx.lineTo(this.transaction[i].p3.x - headlen * Math.cos(angle - Math.PI / 7), this.transaction[i].p3.y - headlen * Math.sin(angle - Math.PI / 7));
                ctx.lineTo(this.transaction[i].p3.x - headlen * Math.cos(angle + Math.PI / 7), this.transaction[i].p3.y - headlen * Math.sin(angle + Math.PI / 7));
                ctx.lineTo(this.transaction[i].p3.x, this.transaction[i].p3.y)
                ctx.lineTo(this.transaction[i].p3.x - headlen * Math.cos(angle - Math.PI / 7), this.transaction[i].p3.y - headlen * Math.sin(angle - Math.PI / 7));
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = this.color;
                ctx.lineTo(this.transaction[i].p3.x - headlen * Math.cos(angle - Math.PI / 7), this.transaction[i].p3.y - headlen * Math.sin(angle - Math.PI / 7));
                ctx.lineTo(this.transaction[i].p3.x - headlen * Math.cos(angle + Math.PI / 7), this.transaction[i].p3.y - headlen * Math.sin(angle + Math.PI / 7));
                ctx.lineTo(this.transaction[i].p3.x, this.transaction[i].p3.y)
                ctx.lineTo(this.transaction[i].p3.x - headlen * Math.cos(angle - Math.PI / 7), this.transaction[i].p3.y - headlen * Math.sin(angle - Math.PI / 7));
                ctx.fill();
                // rect I/O
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.fillRect(this.transaction[i].rect.x, this.transaction[i].rect.y, this.transaction[i].rect.width, this.transaction[i].rect.height);
            }
        }

    }
}
export { TransactionArrow }