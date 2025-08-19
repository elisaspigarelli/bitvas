class ConfigView {

  constructor() {

    this.COLOR = {
      //COLOR_CLUSTER_BLOCK: "#dad6d6",
      COLOR_BLACK: "#000000",
      COLOR_RED_TRANS: '#ff0000',
      //COLOR_TRANS: '#ffffe0',
      COLOR_GREEN_TRANS: 'green',
      //COLOR_SLIDER: '#829594',
      //COLOR_SLIDER_THUMB: '#000000',

      COLOR_GREY: '#757575',
      COLOR_GREY_BKG: '#a4a4a4',
      COLOR_RED: '#d70b00',
      COLOR_RED_BKG: '#ffa19c',
      COLOR_GREEN: "#34c13b",
      COLOR_GREEN_BKG: "#C0DFB1",
      COLOR_BLUE: "#006dd8",
      COLOR_BLUE_BKG: "#BFD9DC",
      COLOR_ORANGE: "#f78913",
      COLOR_ORANGE_BKG: "#fccb98",
      COLOR_PINK: '#feafc6',
      COLOR_PINK_BKG: '#fee1ea',
      COLOR_PURPLE: "#957DAD",
      COLOR_PURPLE_BKG: "#bbaccb",
      COLOR_YELLOW: "#fcf337",
      COLOR_YELLOW_BKG: "#FEFBBE",
      COLOR_BROWN: "#c25418",
      COLOR_BROWN_BKG: "#f0ac87",
      COLOR_GREEN_N: "#7d7e4d",
      COLOR_GREEN_N_BKG: "#aeb07e",

      COLOR_LIGHTGREY: "#E0E0E0",
    };
  }

  getMinerColor(nameMiner) {
    let color = {};
    switch (nameMiner) {
      case 'Unknown':

        color.color_backg = this.COLOR.COLOR_GREEN_BKG;
        color.color_line = this.COLOR.COLOR_GREEN;
        break;
      case 'SlushPool':
        color.color_backg = this.COLOR.COLOR_PINK_BKG;
        color.color_line = this.COLOR.COLOR_PINK;
        break;
      case 'ViaBTC':
        color.color_backg = this.COLOR.COLOR_ORANGE_BKG;
        color.color_line = this.COLOR.COLOR_ORANGE;
        break;
      case 'AntPool':
        color.color_backg = this.COLOR.COLOR_BLUE_BKG;
        color.color_line = this.COLOR.COLOR_BLUE;
        break;
      case 'Poolin':
        color.color_backg = this.COLOR.COLOR_GREY_BKG;
        color.color_line = this.COLOR.COLOR_GREY;
        break;
      case 'Bitfury':
        color.color_backg = this.COLOR.COLOR_BROWN_BKG;
        color.color_line = this.COLOR.COLOR_BROWN;
        break;
      case 'F2Pool':
        color.color_backg = this.COLOR.COLOR_RED_BKG;
        color.color_line = this.COLOR.COLOR_RED;
        break;
      case 'Huobi.pool':
        color.color_backg = this.COLOR.COLOR_PURPLE_BKG;
        color.color_line = this.COLOR.COLOR_PURPLE;
        break;
      case 'Binance':
        color.color_backg = this.COLOR.COLOR_YELLOW_BKG;
        color.color_line = this.COLOR.COLOR_YELLOW;
        break;
      case 'BTC.TOP':
        color.color_backg = this.COLOR.COLOR_GREEN_N_BKG;
        color.color_line = this.COLOR.COLOR_GREEN_N;
        break;
      default:
        color.color_backg = this.COLOR.COLOR_GREEN_BKG;
        color.color_line = this.COLOR.COLOR_GREEN;
        break;
    }
    return color;
  }
}

export { ConfigView }