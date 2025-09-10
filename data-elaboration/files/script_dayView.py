import json
import math
import numpy as np

block_dataset = json.load(open("./files/input/block_dataset.json"))
input_dataset = json.load(open("./files/input/input_dataset.json"))
#output_dataset= json.load(open("./input/output_dataset.json"))
#transaction_dataset= json.load(open("./input/transaction_dataset.json"))


#################################################################
##                          FUNCTION                           ##
################################################################
def _isValid(blockId):
    flag=False;
    for b in small_blocks:
        if b["id"] == blockId:
            flag=True
    return flag;

def _isStartCluster(blockId):
    flag=False;
    for i in range(start_index-1):
        if block_dataset[i]["id"] == blockId:
            flag=True
    return flag;

def _isEndCluster(blockId):
    flag=False;
    for i in range(end_index+1, len(block_dataset)-1):
        if block_dataset[i]["id"] == blockId:
            flag=True
    return flag;

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

################################################################
#             Block dataset
################################################################
# take block's values
blocks = [];
for block in block_dataset:
    obj= {};
    obj["id"]=block.get("id");
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
    blocks.append(obj);

json.dump(blocks, open("./files/output/dayBlocks.json", "w"))

################################################################
#            processing
################################################################

# slider position to get corrispondent data
range_per = np.arange(0, 1.1, 0.1)


for p in range_per :
    if (p == 0):
        perc=0;
        max_number_rect = 7
        blockIndex=0;
        start_index= blockIndex;
        end_index=start_index+max_number_rect-1
    elif (p == 1):
        perc = 1;
        max_number_rect = 7
        blockIndex = round((len(blocks) - 2) * perc) + 1;
        start_index= blockIndex-max_number_rect+1
        end_index=blockIndex
    else :
        perc= p
        max_number_rect = 6
        middle = int(max_number_rect / 2)
        blockIndex = round((len(blocks) - 2) * perc) + 1;
        start_index = blockIndex - 2
        end_index = blockIndex + 3


    blocks_output =[];
    small_blocks=[];

    for i in range(len(blocks)):
         if(i==start_index-1 ) :
            obj = {};
            obj["id"]=blocks[0].get("id")+"-"+blocks[start_index-1].get("id"); #idClusterBlock() ??
            obj["type"]=0;
            blocks_output.append(obj);
         elif (i>=start_index and i<=end_index):
            obj = {};
            obj=blocks[i];
            small_blocks.append(obj);
            obj["type"]=1;
            blocks_output.append(obj);
         elif (i==end_index+1):
            obj = {};
            obj["id"] = blocks[end_index+1].get("id") + "-" + blocks[len(blocks)-1].get("id");#idClusterBlock() ??
            obj["type"] = 0;
            blocks_output.append(obj);

    ### build arrow single rects
    max=0;
    min= math.inf

    for obj in small_blocks:
        list =[];
        for trans in input_dataset:
            if (trans.get("spending_block_id") == obj.get("id") and trans.get("block_id") != obj.get("id") and _isValid(trans.get("block_id"))):
                list.append({"id": trans.get("block_id"), "value": trans.get("value")})
        #print(list)
        arrows = [];
        if list:
            for s in small_blocks:
                arrow = {};
                arrow["block_in"] = s["id"];
                arrow["count"] = 0;
                arrow["value"] = 0;
                for l in list:
                    if (l.get("id")==s["id"]):
                        arrow["count"]=arrow["count"]+1;
                        number = int(l.get("value")) / 100000000
                        arrow["value"] = arrow.get("value") + number
                if(arrow["count"]!=0):
                    arrows.append(arrow);
        obj["transaction_in"]=arrows;

    for obj in small_blocks:
        for l in obj["transaction_in"]:
            if(l["count"]> max):
                max=l["count"];
            if(l["count"]<min):
                min=l["count"];

    for obj in small_blocks:
        for l in obj["transaction_in"]:
            l["lineWidth"]= scaleBetween(l["count"], 2, 7, max, min);

    ### arrows in Cluster Blocks
    max=0;
    min= math.inf

    ### build arrow in end block
    if( perc != 1):
        arrows = [];
        for obj in small_blocks:
             list =[];
             arrow = {};
             for trans in input_dataset:
                if (trans.get("block_id") == obj.get("id") and trans.get("spending_block_id") != obj.get("id") and _isValid(trans.get("spending_block_id"))==False):
                    list.append({"id": trans.get("block_id"), "value": trans.get("value")})
             #print(list)
             if list:
                arrow["block_in"] = obj.get("id")
                arrow["count"] = len(list);
                arrow["value"] =0
                for v in list:
                    number = int(v.get("value")) / 100000000
                    arrow["value"] = arrow.get("value") + number

                if (arrow["count"] > max):
                    max = arrow["count"];
                if (arrow["count"] < min):
                    min = arrow["count"];
                arrows.append(arrow);
        #find num of trans between clusterRects
        arrow = {};
        c=0;
        value=0
        if blocks_output[len(blocks_output)-1].get("type")==0 and blocks_output[0].get("type")==0:
            for trans in input_dataset:
                if _isStartCluster(trans.get("block_id")) and _isEndCluster(trans.get("spending_block_id")):
                    #print(trans.get("block_id") +" - "+ trans.get("spending_block_id"));
                    number = int(trans.get("value")) / 100000000
                    value = value + number
                    c=c+1;
            if(c!=0):
                arrow["block_in"] = blocks_output[0].get("id");
                arrow["count"] = c;
                arrow["value"] = value;
                arrow["lineWidth"]= 7;
                arrows.append(arrow);

        blocks_output[len(blocks_output)-1]["transaction_in"] = arrows;

    ### build arrow in start block
    if(perc != 0):
        for obj in small_blocks:
            list =[];
            arrow = {};
            for trans in input_dataset:
                if (trans.get("spending_block_id") == obj.get("id") and trans.get("block_id") != obj.get("id") and _isValid(trans.get("block_id"))==False):
                    list.append({"id": trans.get("block_id"), "value": trans.get("value")})

            arrow["block_in"] = blocks_output[0].get("id")
            arrow["count"] = len(list);
            arrow["value"] = 0
            for v in list:
                number = int(v.get("value")) / 100000000
                arrow["value"] = arrow.get("value") + number

            if (arrow["count"] > max):
                max = arrow["count"];
            if (arrow["count"] < min):
                min = arrow["count"];

            obj["transaction_in"].append(arrow);

    for obj in blocks_output:
        if "transaction_in" in obj.keys():
            for l in obj["transaction_in"]:
                if "lineWidth" not in l.keys():
                    l["lineWidth"]= scaleBetween(l["count"], 2, 7, max, min);
                    #print(l)

    if p==0 or p==1:
        json.dump(blocks_output, open("./files/output/dayBlocks_"+str(perc)+".json", "w"))
    else :
        json.dump(blocks_output, open("./files/output/dayBlocks_0" + str(int(p * 10)) + ".json", "w"))




######## deep on fee e reward

for d in block_dataset:
    if d.get("id")=='712080':
        blockOttanta= d;


number = int(blockOttanta.get("fee_total")) / 100000000
fee = number
number = int(blockOttanta.get("reward")) / 100000000
reward= number
number = int(blockOttanta.get("input_total")) / 100000000
input_total = number
number = int(blockOttanta.get("output_total")) / 100000000
output_total= number
number = int(blockOttanta.get("generation")) / 100000000
generation= number

tot= reward+fee+input_total

if reward+fee+input_total==output_total:
    print("YES")