import json
import math

block_dataset = json.load(open("./files/input/block_dataset.json"))
input_dataset = json.load(open("./files/input/input_dataset.json"))
output_dataset= json.load(open("./files/input/output_dataset.json"))

#################################################################
##                          FUNCTION                           ##
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

################################################################
##                        BLOCK INFO                          ##
################################################################
block_id= '712080'

# take block's values
blocks = [];
for block in block_dataset:
    if block.get("id") ==block_id:
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
        number = int(block.get("reward")) / 100000000
        obj["reward"] = number

json.dump(obj, open("./files/output/neighbourMode_blockinfo0.json", "w"))

############################################################################
##   Trans neighbour data
############################################################################

trans_input=[]
trans_output=[]

for s in input_dataset:
    ## block in input a distanza 1
    if s.get("spending_block_id") == block_id:
        find = False
        for i in trans_input:
                if i.get("id_input")== s.get("block_id"):
                    i["count"]= i.get("count")+1
                    number = int(s.get("value")) / 100000000
                    i["value"]= i.get("value") +  number
                    find= True

        if find == False:
            obj = {}
            obj["id_input"] = s.get("block_id")
            obj["id_output"] = block_id
            number = int(s.get("value")) / 100000000
            obj["value"] = number
            obj["count"] = 1
            trans_input.append(obj)

    ## block in output a distanza 1
    if  s.get("block_id") == block_id and  s.get("spending_block_id") != block_id:
        find = False
        for i in trans_output:
            if i.get("id_output") == s.get("spending_block_id"):
                i["count"] = i.get("count") + 1
                number = int(s.get("value")) / 100000000
                i["value"] = i.get("value") + number
                find = True

        if find == False:
            obj = {}
            obj["id_input"] = block_id
            obj["id_output"] = s.get("spending_block_id")
            number = int(s.get("value")) / 100000000
            obj["value"] = number
            obj["count"] = 1
            trans_output.append(obj)

## ordino i blocchi
trans_input_output= sorted(trans_input, key=lambda x: x.get('id_input'))
trans_output_output= sorted(trans_output, key=lambda x: x.get('id_output'))

neighbour_trans = [*trans_input_output, *trans_output_output] ## concatena i due array per ottenere l'output

## calcola la lineWidth
max=0;
min= math.inf

for l in neighbour_trans:
    if(l.get("count")> max):
         max=l.get("count");
    if(l.get("count")<min):
         min=l.get("count");

for l in neighbour_trans:
    l["lineWidth"]= scaleBetween(l["count"], 2, 7, max, min);


json.dump(neighbour_trans, open("./files/output/neighbourMode_trans0.json", "w"))


## check con i valori presi dal dataset block - non tornano precisamente
count= 0
for l in trans_output_output:
   count= count+ l.get("count")

count= 0
value=0
for o in output_dataset:
    if o.get("block_id")== block_id :
        n= int(o.get("value")) / 100000000
        value=value+n
        count=count+1

############################################################################
##   Block neighbour data
############################################################################
input_blocks = []
output_blocks = []


for i in range(len(trans_input_output)-1):  #l'ultimo è il blocco ID che prendo dopo
    obj={}
    obj["id"]= trans_input_output[i].get("id_input")
    obj["type"] = 1
    input_blocks.append(obj)
    if int(trans_input_output[i].get("id_input"))<int(trans_input_output[i+1].get("id_input"))-2: ##distano più di 2
        obj = {}
        id1 = int(trans_input_output[i].get("id_input"))+1;
        id2=int(trans_input_output[i+1].get("id_input"))-1
        obj["id"] = idClusterBlock(str(id1), str(id2))
        obj["type"] = 0
        input_blocks.append(obj)
    elif int(trans_input_output[i].get("id_input"))==int(trans_input_output[i+1].get("id_input"))-2: #c'è un solo blocco che li divide
        obj = {}
        id= int(trans_input_output[i].get("id_input"))+1;
        obj["id"] = str(id)
        obj["type"] = 0
        input_blocks.append(obj)
        #print("UN SOLO BLOCCO "+trans_input_output[i].get("id_input")+ " " + trans_input_output[i+1].get("id_input")+"-> " + str(id))

#print(input_blocks[len(input_blocks)-1])

# BLOCK ID
obj = {}
obj["id"]= trans_input_output[len(trans_input_output)-1].get("id_input")
obj["type"] = 1
input_blocks.append(obj)

for i in range(len(trans_output_output)-1):
    obj={}
    obj["id"]= trans_output_output[i].get("id_output")
    obj["type"] = 1
    output_blocks.append(obj)
    if int(trans_output_output[i].get("id_output"))<int(trans_output_output[i+1].get("id_output"))-2: ##distano più di 2
        obj = {}
        id1 = int(trans_output_output[i].get("id_output"))+1;
        id2=int(trans_output_output[i+1].get("id_output"))-1
        obj["id"] = idClusterBlock(str(id1), str(id2))
        obj["type"] = 0
        output_blocks.append(obj)
    elif int(trans_output_output[i].get("id_output"))==int(trans_output_output[i+1].get("id_output"))-2: #c'è un solo blocco che li divide
        obj = {}
        id= int(trans_output_output[i].get("id_output"))+1;
        obj["id"] = str(id)
        obj["type"] = 0
        output_blocks.append(obj)
        #print("UN SOLO BLOCCO "+trans_input_output[i].get("id_input")+ " " + trans_input_output[i+1].get("id_input")+"-> " + str(id))

# l'ultimo che non prendo nel for a causa di len-1
obj={}
obj["id"]= trans_output_output[len(trans_output_output)-1].get("id_output")
obj["type"] = 1
output_blocks.append(obj)

neighbour_block = [*input_blocks, *output_blocks] ## concatena i due array per ottenere l'output

for n in neighbour_block:
    for b in block_dataset:
        if n.get("id")== b.get("id"):
            n["guessed_miner"]= b.get("guessed_miner")

json.dump(neighbour_block, open("./files/output/neighbourMode_dataset0.json", "w"))


