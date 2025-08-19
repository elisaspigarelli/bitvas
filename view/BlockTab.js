class BlockTab {

    constructor(block) {
        this.buttonBlock = document.createElement("button");

        this.buttonBlock.className = "tablinks";
        this.buttonBlock.id = block.id;

        this.panelBlock = document.createElement("div");
        this.panelBlock.className = "tabcontent";
        this.panelBlock.id = block.id;
        this.buildPanelTab(block);

    }
    buildPanelTab(block) {
        this.buttonBlock.innerHTML = block.id;

        let table = document.createElement("table");
        table.className = 'blockTab';
        let row_1 = document.createElement('tr');
        let row_2 = document.createElement('tr');

        let row_1_head1 = document.createElement('th');
        row_1_head1.innerHTML = 'Block ID:'
        let row_1_data1 = document.createElement('td');
        row_1_data1.innerHTML = block.getBlockId;
        row_1.appendChild(row_1_head1);
        row_1.appendChild(row_1_data1);
        

        let row_1_head2 = document.createElement('th');
        row_1_head2.innerHTML = '#Transactions: ';
        let row_1_data2 = document.createElement('td');
        row_1_data2.innerHTML = block.getTransactionCount;
        row_1.appendChild(row_1_head2);
        row_1.appendChild(row_1_data2);



        let row_1_head5 = document.createElement('th');
        row_1_head5.innerHTML = '#Inputs:'
        let row_1_data5 = document.createElement('td');
        row_1_data5.innerHTML = block.getInputCount;
        row_1.appendChild(row_1_head5);
        row_1.appendChild(row_1_data5);

        //let row_1_head4 = document.createElement('th');
        //row_1_head4.innerHTML = 'Input total:'
        let row_1_data4 = document.createElement('td');
        row_1_data4.innerHTML ="(Tot: "+ block.getInputTotal+" BTC)";
        //row_1.appendChild(row_1_head4);
        row_1.appendChild(row_1_data4);

        let row_1_head3 = document.createElement('th');
        row_1_head3.innerHTML = 'Time: ';
        let row_1_data3 = document.createElement('td');
        row_1_data3.innerHTML = block.getBlockTime;
        row_2.appendChild(row_1_head3);
        row_2.appendChild(row_1_data3);

        let row_2_head1 = document.createElement('th');
        row_2_head1.innerHTML = 'Miner: '
        let row_2_data1 = document.createElement('td');
        row_2_data1.innerHTML = block.getMiner;
        row_2.appendChild(row_2_head1);
        row_2.appendChild(row_2_data1);


        let row_2_head3 = document.createElement('th');
        row_2_head3.innerHTML = '#Outputs:'
        let row_2_data3 = document.createElement('td');
        row_2_data3.innerHTML = block.getOutputCount;
        row_2.appendChild(row_2_head3);
        row_2.appendChild(row_2_data3);

       // let row_2_head2 = document.createElement('th');
        //row_2_head2.innerHTML = 'Output total:'
        let row_2_data2 = document.createElement('td');
        row_2_data2.innerHTML ="(Tot: "+ block.getOutputTotal+" BTC)";
       // row_2.appendChild(row_2_head2);
        row_2.appendChild(row_2_data2);

        let row_head = document.createElement('th');
        row_head.innerHTML = 'Reward:'
        row_head.rowSpan=2;
        let row_data = document.createElement('td');
        row_data.rowSpan=2;
        row_data.innerHTML = block.getReward+" BTC";
        row_1.appendChild(row_head);
        row_1.appendChild(row_data);
        
       /* let row_data2 = document.createElement('td');
        row_data2.colSpan=2;
        row_data2.innerHTML = "("+(block.getReward-6.25) +" BTC +" + '6.25 BTC)' ;
        console.log(block.getReward-6.25)
        //row_2.appendChild(row_data2)*/
        
        table.appendChild(row_1);
        table.appendChild(row_2);
        this.panelBlock.appendChild(table);
    }

    get getPanel() {
        return this.panelBlock;
    }
    get getButton() {
        return this.buttonBlock;
    }

    show() {
        this.buttonBlock.className += " active"; //--> pigiato il bottone!
        this.panelBlock.className += " open"; //--> show panel
    }
    hide() {
        this.buttonBlock.className = this.buttonBlock.className.replace(" active", "");
        this.panelBlock.className = this.panelBlock.className.replace(" open", "");
    }
}

export { BlockTab };