import json
import math

block_dataset = json.load(open("./input/block_dataset.json"))
input_dataset = json.load(open("./input/input_dataset.json"))

#################################################################
##                          FUNCTIONS                          ##
################################################################
def scaleBetween (num, scaledMin, scaledMax, max, min):
  if (max-min)==0:
      num =6
  else:
      num=((scaledMax-scaledMin)*(num-min)/(max-min))+scaledMin
  return num;

def idClusterBlock(id1, id2):
    idName = id1;
    for i in range(len(id1)):
        if(id1[i]!=id2[i]):
            idName=id1 +"-" + id2[i:len(id2)]
            break;
    return idName;

def _isValid(blockId):
    flag=False;
    for b in blocks_miner:
        if b["id"] == blockId:
            flag=True
    return flag;

################################################################

## MINERS NAMES
miners_name = ['Unknown', 'Binance', 'SlushPool', 'ViaBTC', 'AntPool', 'F2Pool', 'Bitfury', 'Poolin', 'Huobi.pool', 'BTC.TOP']

#################################################################
##                         ANALYSIS                           ##
################################################################
total_count=[];
for m in miners_name:
    obj={}
    obj["miner"]=m
    obj["count"] = 0
    total_count.append(obj)

for b in block_dataset:
    find= False
    for i in range(len(miners_name)):
        if b.get("guessed_miner")== miners_name[i]:
            total_count[i]["count"]=total_count[i].get("count")+1
            find=True
        if i==len(miners_name)-1 and find==False:
            print(b.get("guessed_miner"))
            total_count[0]["count"] = total_count[0].get("count") + 1

for find_miner in miners_name:

    ############################################################################
    ##   Miner data
    ############################################################################

    blocks_miner=[]

    for block in block_dataset:
        if block.get("guessed_miner") ==find_miner:
            obj = {};
            obj["id"] = block.get("id");
            obj["type"] = 1
            obj["hash"] = block.get("hash");
            obj["time"] = block.get("time");
            obj["guessed_miner"] = block.get("guessed_miner");
            obj["transaction_count"] = block.get("transaction_count");
            obj["input_count"] = block.get("input_count")
            obj["output_count"] = block.get("output_count")
            number = int(block.get("input_total")) / 100000000
            obj["input_total"] = number
            number = int(block.get("output_total")) / 100000000
            obj["output_total"] = number
            #number = int(block.get("fee_total")) / 100000000
            #obj["fee_total"] = number
            number = int(block.get("reward")) / 100000000
            obj["reward"] = number
            blocks_miner.append(obj);


    print("ELISA LEN")
    print(len(blocks_miner));
    ############################################################################
    ##   TRANSAZIONI
    ############################################################################
    if len(blocks_miner)>0:
        max=0;
        min= math.inf

        for obj in blocks_miner:
            list =[];
            for trans in input_dataset:
                if (trans.get("spending_block_id") == obj.get("id") and trans.get("block_id") != obj.get("id")
                and _isValid(trans.get("block_id"))):
                    list.append({"id": trans.get("block_id"), "value": trans.get("value")})
            #print(list)
            arrows = [];
            if list:
                for s in blocks_miner:
                    arrow = {};
                    arrow["block_in"] = s["id"];
                    arrow["count"] = 0;
                    arrow["value"]=0;
                    for l in list:
                        if (l.get("id")==s["id"]):
                            arrow["count"]=arrow["count"]+1;
                            number = int(l.get("value")) / 100000000
                            arrow["value"] = arrow.get("value") + number
                    if(arrow["count"]!=0):
                        arrows.append(arrow);
            obj["transaction_in"]=arrows;

        for obj in blocks_miner:
            for l in obj["transaction_in"]:
                if(l["count"]> max):
                    max=l["count"];
                if(l["count"]<min):
                    min=l["count"];

        for obj in blocks_miner:
            for l in obj["transaction_in"]:
                l["lineWidth"]= scaleBetween(l["count"], 2, 7, max, min);

        ############################################################################
        ##   ADD CLUSTER in the between
        ############################################################################
        miner_output=[];
        index =0;

        for m in blocks_miner:

            if int(m.get("id")) > int(block_dataset[index].get("id"))+2: ##distano più di 2
                obj = {}
                id1 = int(block_dataset[index].get("id"));
                id2 = int(m.get("id")) - 1
                obj["id"] = idClusterBlock(str(id1), str(id2))
                obj["type"] = 0
                miner_output.append(obj)
                index=index+(int(m.get("id")) -int(block_dataset[index].get("id")))
                miner_output.append(m)
                index = index + 1
            elif int(m.get("id")) == int(block_dataset[index].get("id"))+2: ##c'è un solo blocco che li divide
                obj = {}
                id = int(m.get("id")) - 1;
                obj["id"] = str(id)
                obj["type"] = 0
                miner_output.append(obj)
                index=index+(int(m.get("id")) -int(block_dataset[index].get("id")));
                miner_output.append(m)
                index = index + 1
            elif int(m.get("id")) == int(block_dataset[index].get("id")) + 1:  ##c'è un solo blocco che li divide (ad esempio all'inizio
                obj = {}
                id = int(m.get("id")) - 1;
                obj["id"] = str(id)
                obj["type"] = 0
                miner_output.append(obj)
                index = index + (int(m.get("id")) - int(block_dataset[index].get("id")));
                miner_output.append(m)
                index = index + 1
            elif int(m.get("id"))  == int(block_dataset[index].get("id")):
                miner_output.append(m)
                index = index + 1

    

        ##attacca il cluster finale se non era l'ultimo rect
        if int(blocks_miner[len(blocks_miner)-1].get("id"))< int(block_dataset[len(block_dataset)-1].get("id"))-1:
            obj = {}
            id1 =int(blocks_miner[len(blocks_miner)-1].get("id"))+1;
            id2 = int(block_dataset[len(block_dataset)-1].get("id"))
            obj["id"] = idClusterBlock(str(id1), str(id2))
            obj["type"] = 0
            miner_output.append(obj)
        elif int(blocks_miner[len(blocks_miner)-1].get("id"))== int(block_dataset[len(block_dataset)-1].get("id"))-1:
            obj = {}
            id = int(block_dataset[len(block_dataset)-1].get("id"));
            obj["id"] = str(id)
            obj["type"] = 0
            miner_output.append(obj)

        json.dump(miner_output, open("./output/miner_blocks_"+find_miner+".json", "w"))
    else:
        with open("./output/miner_blocks_"+find_miner+".json", 'x') as file:
            pass
