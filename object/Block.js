let radius_rect = 15;
let lineWidth = 7;
let font='24px helvetica';

class Block {
    constructor(block) {
        this.id = block.id;
        this.guessed_miner = block.guessed_miner
        this.time = block.time
        this.hash = block.hash
        this.transaction_count = block.transaction_count;
        this.input_count = block.input_count;
        this.output_count = block.output_count;
        this.input_total = block.input_total;
        this.output_total = block.output_total;
        this.reward = block.reward;       
    }

    get getBlockId() {
        return this.id;
    }
    get getBlockTime() {
        return this.time;
    }
    get getMiner() {
        return this.guessed_miner;
    }
    get getHash() {
        return this.hash;
    }
    get getTransactionCount() {
        return this.transaction_count;
    }
    get getInputCount() {
        return this.input_count;
    }
    get getOutputCount() {
        return this.output_count;
    }
    get getInputTotal() {
        return this.input_total;
    }
    get getOutputTotal() {
        return this.output_total;
    }
    get getReward() {
        return this.reward;
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

    draw(ctx, radius, line, f) {
        if(radius!=null){
            radius_rect=radius
        }
        if(line!=null){
            lineWidth=line
        }
        if(f!=null){
            font=f
        }
        ctx.fillStyle = this.color.color_backg;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + radius_rect);
        ctx.arcTo(this.x, this.y + this.height, this.x + radius_rect, this.y + this.height, radius_rect);
        ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height - radius_rect, radius_rect);
        ctx.arcTo(this.x + this.width, this.y, this.x + this.width - radius_rect, this.y, radius_rect);
        ctx.arcTo(this.x, this.y, this.x, this.y + radius_rect, radius_rect);
        ctx.fill();

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = this.color.color_line;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + radius_rect);
        ctx.arcTo(this.x, this.y + this.height, this.x + radius_rect, this.y + this.height, radius_rect);
        ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height - radius_rect, radius_rect);
        ctx.arcTo(this.x + this.width, this.y, this.x + this.width - radius_rect, this.y, radius_rect);
        ctx.arcTo(this.x, this.y, this.x, this.y + radius_rect, radius_rect);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = font;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(this.id, this.x + this.width / 2, this.y + this.height / 2);
    }
}


export { Block };