
class Dataset {
    constructor() {
      this.start_visualization='./dataset/start_visualization.json'

        this.dayMode = {
            dataset: './dataset/dayBlocks.json',
            url_0: './dataset/dayBlocks_0.json',
            url_01: './dataset/dayBlocks_01.json',
            url_02: './dataset/dayBlocks_02.json',
            url_03: './dataset/dayBlocks_03.json',
            url_04: './dataset/dayBlocks_04.json',
            url_05: './dataset/dayBlocks_05.json',
            url_06: './dataset/dayBlocks_06.json',
            url_07: './dataset/dayBlocks_07.json',
            url_08: './dataset/dayBlocks_08.json',
            url_09: './dataset/dayBlocks_09.json',
            url_1: './dataset/dayBlocks_1.json'
        }
        this.transactionMode = {
            dataset0: "./dataset/transactionMode_dataset0.json",
            transactions0: "./dataset/transactionMode_trans0.json",
            trasInfo0: "./dataset/transactionMode_info0.json",
            dataset1: "./dataset/transactionMode_dataset1.json",
            transactions1: "./dataset/transactionMode_trans1.json",
            trasInfo1: "./dataset/transactionMode_info1.json"
        }

        this.neighbourMode = {
            dataset0: "./dataset/neighbourMode_dataset0.json",
            transactions0: "./dataset/neighbourMode_trans0.json",
            blockInfo0: "./dataset/neighbourMode_blockinfo0.json",
            dataset1: "./dataset/neighbourMode_dataset1.json",
            transactions1: "./dataset/neighbourMode_trans1.json",
            blockInfo1: "./dataset/neighbourMode_blockinfo1.json"
        }
        this.minerMode = {
            Unknown: './dataset/miner_blocks_Unknown.json',
            SlushPool: './dataset/miner_blocks_SlushPool.json',
            ViaBTC: './dataset/miner_blocks_ViaBTC.json',
            AntPool: './dataset/miner_blocks_AntPool.json',
            F2Pool: './dataset/miner_blocks_F2Pool.json',
            Bitfury: './dataset/miner_blocks_Bitfury.json',
            Poolin: './dataset/miner_blocks_Poolin.json',
            Huobipool: './dataset/miner_blocks_Huobi.pool.json',
            BTCTOP: './dataset/miner_blocks_BTC.TOP.json',
            Binance: './dataset/miner_blocks_Binance.json'
        }
    }
    getStartVisualization(){
        return this.start_visualization;
    }
    
    getDayBlocks() {
        return this.dayMode.dataset;
    }
    
    getDayPosition(pct) {
        let url;
        let perc = Math.round(pct * 10) / 10;
        console.log(perc)
        if (perc == 0) {
            url = this.dayMode.url_0
        } else if (perc == 0.1) {
            url = this.dayMode.url_01
        } else if (perc == 0.2) {
            url = this.dayMode.url_02
        } else if (perc == 0.3) {
            url = this.dayMode.url_03
        } else if (perc == 0.4) {
            url = this.dayMode.url_04
        } else if (perc == 0.5) {
            url = this.dayMode.url_05
        } else if (perc == 0.6) {
            url = this.dayMode.url_06
        } else if (perc == 0.7) {
            url = this.dayMode.url_07;
        } else if (perc == 0.8) {
            url = this.dayMode.url_08
        } else if (perc == 0.9) {
            url = this.dayMode.url_09;
        } else if (perc == 1) {
            url = this.dayMode.url_1;
        }
        return url
    }

    setDayDataset(input) {
        let find = false
        if (input == "2021-12-01T11:42") {
            find = true;
        }
        return find;
    }
    setTransactionDataset(input) {
        let find = false
        if (input == "2a68c8a5859b500675cdcbdbd09b9f7ea32e6c8532cadfbb2a7955bc6d77c4ea") {
            this.transaction = {
                dataset: this.transactionMode.dataset0,
                transactions: this.transactionMode.transactions0,
                trasInfo: this.transactionMode.trasInfo0
            };
            find = true;
        } else if (input == "ba11cd551c626aba0cb3c7a494981512d99d9dabb08c11168ad0c417b51d8ef9") {
            this.transaction = {
                dataset: this.transactionMode.dataset1,
                transactions: this.transactionMode.transactions1,
                trasInfo: this.transactionMode.trasInfo1
            };
            find = true;
        }
        return find;
    }

    getTransactionDataset() {
        return this.transaction.dataset;
    }
    getTransactionTrans() {
        return this.transaction.transactions;
    }
    getTransactionTransInfo() {
        return this.transaction.trasInfo;
    }

    setNeighbourDataset(id) {
        let find = false
        if (id == "712080" || id=='00000000000000000001e1a29bce3a7bb5917a1dae825268746418dee765ca11') {
            this.neighbour = {
                dataset: this.neighbourMode.dataset0,
                transactions: this.neighbourMode.transactions0,
                blockInfo: this.neighbourMode.blockInfo0
            };
            find = true;
        }
        return find;
    }
    getNeighbourDataset() {
        return this.neighbour.dataset;
    }
    getNeighbourTrans() {
        return this.neighbour.transactions;
    }
    getNeighbourBlockInfo() {
        return this.neighbour.blockInfo;
    }

    setMinerDataset(miner) {
        let find = false
        if (miner == "Unknown") {
            this.miner = {
                dataset: this.minerMode.Unknown
            };
            find = true;
        } else if (miner == 'SlushPool') {
            this.miner = {
                dataset: this.minerMode.SlushPool
            };
            find = true;
        } else if (miner == 'ViaBTC') {
            this.miner = {
                dataset: this.minerMode.ViaBTC
            };
            find = true;
        } else if (miner == 'AntPool') {
            this.miner = {
                dataset: this.minerMode.AntPool
            };
            find = true;
        } else if (miner == 'F2Pool') {
            this.miner = {
                dataset: this.minerMode.F2Pool
            };
            find = true;
        } else if (miner == 'Bitfury') {
            this.miner = {
                dataset: this.minerMode.Bitfury
            };
            find = true;
        } else if (miner == 'Poolin') {
            this.miner = {
                dataset: this.minerMode.Poolin
            };
            find = true;
        } else if (miner == 'Huobi.pool') {
            this.miner = {
                dataset: this.minerMode.Huobipool
            };
            find = true;
        } else if (miner == 'BTC.TOP') {
            this.miner = {
                dataset: this.minerMode.BTCTOP
            };
            find = true;
        } else if (miner == 'Binance') {
            this.miner = {
                dataset: this.minerMode.Binance
            };
            find = true;
        }
        return find;
    }
    getMinerDataset() {
        return this.miner.dataset;
    }
}

export { Dataset }