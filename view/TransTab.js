class TransTab {

    constructor(trans) {
        this.buttonTrans = document.createElement("button");

        this.buttonTrans.className = "tablinks";
        this.buttonTrans.id = trans.trans_name;

        this.panelTrans = document.createElement("div");
        this.panelTrans.className = "tabcontent";
        this.panelTrans.id = trans.trans_name;
        this.buildPanelTab(trans);

    }
    
    buildPanelTab(trans) {
        this.buttonTrans.innerHTML = trans.trans_name;

        let table = document.createElement("table");
        table.className = 'transTab';
        let row_1 = document.createElement('tr');
        let row_2 = document.createElement('tr');

        let row_1_head1 = document.createElement('th');
        row_1_head1.innerHTML = 'Block ID:'
        let row_1_data1 = document.createElement('td');
        row_1_data1.innerHTML = trans.block_id;
        row_1.appendChild(row_1_head1);
        row_1.appendChild(row_1_data1);
        
        let row_1_head4 = document.createElement('th');
        row_1_head4.innerHTML = '#Input:'
        let row_1_data4 = document.createElement('td');
        row_1_data4.innerHTML = trans.input_count + " (Tot: "+ trans.input_total+" BTC )";
        row_1.appendChild(row_1_head4);
        row_1.appendChild(row_1_data4);

        let row_2_head2 = document.createElement('th');
        row_2_head2.innerHTML = '#Output:'
        let row_2_data2 = document.createElement('td');
        row_2_data2.innerHTML = trans.output_count + " (Tot: "+ trans.output_total+" BTC )";;
        row_1.appendChild(row_2_head2);
        row_1.appendChild(row_2_data2);

        let row_1_head3 = document.createElement('th');
        row_1_head3.innerHTML = 'Fee: ';
        let row_1_data3 = document.createElement('td');
        row_1_data3.innerHTML = trans.fee+" BTC";
        row_1.appendChild(row_1_head3);
        row_1.appendChild(row_1_data3);

        let row_2_head1 = document.createElement('th');
        row_2_head1.innerHTML = 'Hash:'
        let row_2_data1 = document.createElement('td');
        row_2_data1.colSpan='5';
        row_2_data1.innerHTML = trans.hash;
        row_2.appendChild(row_2_head1);
        row_2.appendChild(row_2_data1);

        let row_1_head2 = document.createElement('th');
        row_1_head2.innerHTML = 'Time: ';
        let row_1_data2 = document.createElement('td');
        row_1_data2.innerHTML = trans.time;
        row_2.appendChild(row_1_head2);
        row_2.appendChild(row_1_data2);
   
        /*let row_1_head5 = document.createElement('th');
        row_1_head5.innerHTML = 'Input total:'
        let row_1_data5 = document.createElement('td');
        row_1_data5.innerHTML = trans.input_total+" BTC";
        row_2.appendChild(row_1_head5);
        row_2.appendChild(row_1_data5);

        let row_2_head3 = document.createElement('th');
        row_2_head3.innerHTML = 'Output total:'
        let row_2_data3 = document.createElement('td');
        row_2_data3.innerHTML = trans.output_total+" BTC";
        row_2.appendChild(row_2_head3);
        row_2.appendChild(row_2_data3);*/
     


        table.appendChild(row_1);
        table.appendChild(row_2);
        this.panelTrans.appendChild(table);
    }
    get getPanel() {
        return this.panelTrans;
    }
    get getButton() {
        return this.buttonTrans;
    }

    show() {
        this.buttonTrans.className += " active"; //--> pigiato il bottone!
        this.panelTrans.className += " open"; //--> show panel
    }
    hide() {
        this.buttonTrans.className = this.buttonTrans.className.replace(" active", "");
        this.panelTrans.className = this.panelTrans.className.replace(" open", "");
    }
}

export { TransTab };