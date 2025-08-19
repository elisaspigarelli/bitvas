
const slider_y = 400;
const slider_height = 25;
const COLOR_SLIDER_THUMB='#000000';
const COLOR_SLIDER='#829594';
let lineWidth= 6;

class Slider{
    constructor(slider_x, slider_width, s_y, h) {
        this.x= slider_x;
        if (s_y==null){
            this.y= slider_y;
        } else {
            this.y=s_y
        }
        if(h==null){
            this.height= slider_height;
        } else {
            this.height=h
            lineWidth=2;
        }  
        this.width =slider_width;
    }

    setPerc(perc){
        this.pct= perc;
    }
    calcolatePerc(mousePoint){
        return Math.max(0, Math.min(1, (mousePoint.x - this.x) / this.width));
    }
    get getPerc(){
        return this.pct;
    }
    isInteraction(mousePoint){
        return  (mousePoint.x > this.x && mousePoint.x < this.x + this.width && mousePoint.y > this.y - this.height / 2 && mousePoint.y < this.y + this.height / 2);
    }

    draw(ctx, sliderTime) {
        ctx.clearRect(this.x - 12.5, this.y - this.height / 2 - 20, this.width + 25, this.height + 25);

        this.x1 = this.x + this.width;
        this.y1 = this.y;
        // bar
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = COLOR_SLIDER;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x1, this.y);
        ctx.stroke();
        // thumb
        ctx.beginPath();
        var thumbX = this.x + this.width * this.pct;
        ctx.moveTo(thumbX, this.y - this.height / 2);
        ctx.lineTo(thumbX, this.y + this.height / 2);
        ctx.strokeStyle = COLOR_SLIDER_THUMB;
        ctx.stroke();
        // time
        ctx.fillStyle =COLOR_SLIDER_THUMB;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '20px arial';
        if (sliderTime != undefined)
            ctx.fillText(sliderTime, this.x + this.width / 2, this.y - this.height / 2-5);
    }
}

export{Slider}