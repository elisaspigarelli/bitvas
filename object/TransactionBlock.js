import { Block } from './Block.js';
import { PreviousTransaction } from './PreviousTransaction.js';
import { FollowingTransaction } from './FollowingTransaction.js';

const COLOR_TRANS= '#ffffe0';
const COLOR_BLACK= "#000000";
const  radius_rect = 15;
const  radius_trans = 5;

class TransactionBlock extends Block {
    constructor(block, transaction) {
        super(block);
        this.transaction = transaction
        this.transaction_index = 0;
        this.position = this.transaction[0].position;
        for (let i = 0; i < this.transaction.length; i++) {
            if (this.transaction[i].position == 0) {
                this.position = 0;
                break
            }
        }
        if (this.position == 0) {
            this.show = true;
        } else {
            this.show = false;
        }
    }

    checkFollowing() {
        if (this.transaction.length > 1 && this.transaction_index < this.transaction.length - 1) {
            this.following = new FollowingTransaction();
        } else {
            this.following = null
        }
    }

    checkPrevious() {
        if (this.transaction_index != 0) {
            this.previous = new PreviousTransaction();
        } else {
            this.previous = null
        }
    }
    changeShow() {
        this.show = !this.show;
    }
    clickFollowing() {
        this.transaction_index = this.transaction_index + 1;
    }

    clickPrevious() {
        this.transaction_index = this.transaction_index - 1;
    }
    get getFollowing() {
        return this.following
    }
    get getPrevious() {
        return this.previous
    }
    get getShow() {
        return this.show;
    }
    get getClassName() {
        return this.constructor.name;
    }

    isInteractionTrans(coord) {
        let result = { find: false };
        if (coord.x >= this.transaction[this.transaction_index].x && coord.x <= this.transaction[this.transaction_index].x + this.transaction[this.transaction_index].width && coord.y >= this.transaction[this.transaction_index].y && coord.y <= this.transaction[this.transaction_index].y + this.transaction[this.transaction_index].height) {
            result.find = true;
            result.trans = this.transaction[this.transaction_index]
        }
        return result;
    }

    draw(ctx) {
        if (this.show) {
            ctx.fillStyle = this.color.color_backg;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + radius_rect);
            ctx.arcTo(this.x, this.y + this.height, this.x + radius_rect, this.y + this.height, radius_rect);
            ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height - radius_rect,radius_rect);
            ctx.arcTo(this.x + this.width, this.y, this.x + this.width - radius_rect, this.y,radius_rect);
            ctx.arcTo(this.x, this.y, this.x, this.y + radius_rect, radius_rect);
            ctx.fill();

            ctx.lineWidth = 7;
            ctx.strokeStyle = this.color.color_line;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + radius_rect);
            ctx.arcTo(this.x, this.y + this.height, this.x +radius_rect, this.y + this.height, radius_rect);
            ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width, this.y + this.height - radius_rect, radius_rect);
            ctx.arcTo(this.x + this.width, this.y, this.x + this.width - radius_rect, this.y, radius_rect);
            ctx.arcTo(this.x, this.y, this.x, this.y + radius_rect, radius_rect);
            ctx.stroke();
            ctx.fillStyle = COLOR_BLACK;

            ctx.textBaseline = 'top';
            ctx.textAlign = 'center';
            if (this.position == 0) {
                ctx.font = '28px helvetica';
                ctx.fillText(this.id, this.x + this.width / 2, this.y + 20);
            } else {
                ctx.font = '24px helvetica';
                ctx.fillText(this.id, this.x + this.width / 2, this.y + 10);
            }
            // disegna la transazione
            let i = this.transaction_index;

            ctx.lineWidth = 3;
            ctx.strokeStyle = COLOR_BLACK;
            ctx.beginPath();
            ctx.moveTo(this.transaction[i].x, this.transaction[i].y + radius_trans);
            ctx.arcTo(this.transaction[i].x, this.transaction[i].y + this.transaction[i].height, this.transaction[i].x + radius_trans, this.transaction[i].y + this.transaction[i].height, radius_trans);
            ctx.arcTo(this.transaction[i].x + this.transaction[i].width, this.transaction[i].y + this.transaction[i].height, this.transaction[i].x + this.transaction[i].width, this.transaction[i].y + this.transaction[i].height - radius_trans, radius_trans);
            ctx.arcTo(this.transaction[i].x + this.transaction[i].width, this.transaction[i].y, this.transaction[i].x + this.transaction[i].width - radius_trans, this.transaction[i].y, radius_trans);
            ctx.arcTo(this.transaction[i].x, this.transaction[i].y, this.transaction[i].x, this.transaction[i].y + radius_trans, radius_trans);
            ctx.stroke();
            ctx.fillStyle = COLOR_TRANS;
            ctx.beginPath();
            ctx.moveTo(this.transaction[i].x, this.transaction[i].y + radius_trans);
            ctx.arcTo(this.transaction[i].x, this.transaction[i].y + this.transaction[i].height, this.transaction[i].x +radius_trans, this.transaction[i].y + this.transaction[i].height, radius_trans);
            ctx.arcTo(this.transaction[i].x + this.transaction[i].width, this.transaction[i].y + this.transaction[i].height, this.transaction[i].x + this.transaction[i].width, this.transaction[i].y + this.transaction[i].height - radius_trans, radius_trans);
            ctx.arcTo(this.transaction[i].x + this.transaction[i].width, this.transaction[i].y, this.transaction[i].x + this.transaction[i].width - radius_trans, this.transaction[i].y, radius_trans);
            ctx.arcTo(this.transaction[i].x, this.transaction[i].y, this.transaction[i].x, this.transaction[i].y + radius_trans, radius_trans);
            ctx.fill();
            ctx.fillStyle = COLOR_BLACK;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            if (this.transaction[i].position == 0) {
                ctx.font = 'bold 24px helvetica';
                ctx.fillText(this.transaction[i].trans_name, this.x + this.width / 2, this.transaction[i].y + this.transaction[i].height / 2);
            } else {
                ctx.font = 'bold 20px helvetica';
                ctx.fillText(this.transaction[i].trans_name, this.x + this.width / 2, this.transaction[i].y + this.transaction[i].height / 2);
                if (this.getFollowing != null) {
                    // console.log("DRAW FOLLOWING")
                    this.getFollowing.draw(ctx);
                }
                if (this.getPrevious != null) {
                    // console.log("DRAW Previous")
                    this.getPrevious.draw(ctx);
                }
            }
        } else {
            super.draw(ctx);
        }
    }
}

export { TransactionBlock };