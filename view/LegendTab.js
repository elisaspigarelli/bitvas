import { ConfigView } from './ConfigView.js';

class LegendTab {

    constructor(f) {
        this.config = new ConfigView();
        this.buttonLegend = document.createElement("button");
        this.buttonLegend.innerHTML = "MINERS Color Legend"
        this.buttonLegend.className = "tablinks";
        this.buttonLegend.id = "legend";

        this.panelLegend = document.createElement("div");
        this.panelLegend.className = "tabcontent";
        this.panelLegend.id = "legend";
        this.rows=[];
        this._buildPanelTab(f);     
    }

    _buildPanelTab(f) {
        let table = document.createElement("table");
        table.className='legend'
        //legend name
        const miners_name = ['Unknown', 'SlushPool', 'ViaBTC', 'AntPool', 'F2Pool', 'Bitfury', 'Binance', 'Poolin', 'Huobi.pool', 'BTC.TOP'];
        let row_1 = document.createElement('tr');
        let row_2 = document.createElement('tr');
        for (var i = 0; i < miners_name.length; i++) {
            if (i < 5) {
                let row_1_line = document.createElement('td');
                
                let line = document.createElement('hr');
                line.style.backgroundColor=  this.config.getMinerColor(miners_name[i]).color_line;
                line.style.borderColor =  this.config.getMinerColor(miners_name[i]).color_line;

                row_1_line.appendChild(line);
                let row_1_data = document.createElement('td');
                row_1_data.innerHTML = miners_name[i]                
                this.rows.push(row_1_data);              
                row_1.appendChild(row_1_line);
                row_1.appendChild(row_1_data);
             } else {
                let row_2_line = document.createElement('td');
                let line = document.createElement('hr');
                line.style.backgroundColor = this.config.getMinerColor(miners_name[i]).color_line;
                line.style.borderColor = this.config.getMinerColor(miners_name[i]).color_line;
                row_2_line.appendChild(line);
                let row_2_data = document.createElement('td');
                row_2_data.innerHTML = miners_name[i]               
                this.rows.push(row_2_data);               
                row_2.appendChild(row_2_line);
                row_2.appendChild(row_2_data);

            }
        }
        table.appendChild(row_1);
        table.appendChild(row_2);
        this.panelLegend.appendChild(table);
        if(f!==undefined){
            //add listener for click only for the block View where pass a function
            this.addClickMiners(f)
        }
        
    }

    addClickMiners(callback) {
        console.log("LegendTab - addClickMiners")
        for(let i=0; i<this.rows.length; i++){
            this.rows[i].addEventListener('click', (e) =>{
                e.preventDefault();
                e.stopPropagation();
                //console.log("LegendTab - click")            
                callback(e.target.innerHTML)
            })
        }
    }

    get getPanel() {
        return this.panelLegend;
    }
    get getButton() {
        return this.buttonLegend;
    }

    show() {
        this.buttonLegend.className += " active"; //--> pigiato il bottone!
        this.panelLegend.className += " open"; //--> show panel
    }

    hide() {
        this.buttonLegend.className = this.buttonLegend.className.replace(" active", "");
        this.panelLegend.className = this.panelLegend.className.replace(" open", "");
    }

    clickMiner(miner) {
        //console.log("LegendTab - clickMiner: "+ miner)
        for(let i=0; i<this.rows.length; i++){
            this.rows[i].className  = "";
            if(miner==this.rows[i].innerHTML){
                this.rows[i].className = "clicked";
            }
        }
    }

}

export { LegendTab };