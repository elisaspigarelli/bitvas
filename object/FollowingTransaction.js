class FollowingTransaction {
    constructor() {
    }

    draw(ctx) {
        ctx.lineWidth = 1;
        ctx.fillStyle = 'black';// this.COLOR.COLOR_BLACK
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x, this.y);
        ctx.fill()
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

export { FollowingTransaction }