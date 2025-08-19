class PreviousTransactionBlock {
    constructor(position) {
        this.position = position
    }

    draw(ctx) {
        let space = 5;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';// this.COLOR.COLOR_BLACK
        ctx.beginPath();
        ctx.moveTo(this.x + this.width + space, this.y);
        ctx.lineTo(this.x + space, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width + space, this.y + this.height);
        ctx.stroke();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y);
        ctx.lineTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.stroke();
    }

    get getPosition() {
        return this.position;
    }
    get getClassName() {
        return this.constructor.name;
    }
    isInteraction(coord) {
        let result = false;
        if (coord.x >= this.x && coord.x <= this.x + this.width && coord.y >= this.y && coord.y <= this.y + this.height) {
            result = true;
        }
        return result;
    }
}

export{PreviousTransactionBlock}