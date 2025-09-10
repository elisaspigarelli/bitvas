import json

block_dataset = json.load(open("./input/block_dataset.json"))
input_dataset = json.load(open("./input/input_dataset.json"))
output_dataset= json.load(open("./input/output_dataset.json"))
transaction_dataset= json.load(open("./input/transaction_dataset.json"))

#################################################################
##                          FUNCTION                           ##
################################################################
def idClusterBlock(id1, id2):
    idName = id1;
    for i in range(len(id1)):
        if(id1[i]!=id2[i]):
            idName=id1 +"-" + id2[i:len(id2)]
            break;
    return idName;

def _isValid(blockId, list):
    flag=False;
    for b in list:
        if b["id"] == blockId:
            flag=True
    return flag;

################################################################


# get all transactions in block_id=712080
trans_inBlock_output=[];
find_Block='712080';
for trans in transaction_dataset:
    if (trans.get("block_id")==find_Block):
        trans_inBlock_output.append(trans)
#json.dump(trans_inBlock_output, open("./output/transaction_inBlock.json", "w"))

find_transaction_hash='2a68c8a5859b500675cdcbdbd09b9f7ea32e6c8532cadfbb2a7955bc6d77c4ea'
name="TX";
transaction_hash={};
for trans in transaction_dataset:
    if (trans.get("hash") == find_transaction_hash):
        #transaction_hash=trans;
        transaction_hash["trans_name"] = name
        transaction_hash["block_id"]=trans.get("block_id")
        transaction_hash["hash"] = trans.get("hash")
        transaction_hash["time"] = trans.get("time")
        transaction_hash["input_count"] =trans.get("input_count")
        transaction_hash["output_count"] = trans.get("output_count")
        number = int(trans.get("input_total"))/100000000
        transaction_hash["input_total"] =number
        number = int(trans.get("output_total"))/100000000
        transaction_hash["output_total"] = number
        number = int(trans.get("fee")) / 100000000
        transaction_hash["fee"] = number

json.dump(transaction_hash, open("./output/transactionMode_info0.json", "w"))

## find input of transaction in input_dataset to find transactions in input
input_trans_output=[]
for s in input_dataset:
   # if s.get("spending_block_id") == find_Block:
        if s.get("spending_transaction_hash") == find_transaction_hash:
            input_trans={};
            input_trans["block_id_input"] = s.get("block_id")
            input_trans["transaction_hash_input"] = s.get("transaction_hash")
            input_trans["block_id_output"] = s.get("spending_block_id")
            input_trans["transaction_hash_output"] = s.get("spending_transaction_hash")
            input_trans["index_input"] = s.get("index")
            input_trans["index_output"] = s.get("spending_index") # a che serve?
            input_trans["recipient"] = s.get("recipient")
            number = int(s.get("value")) / 100000000
            input_trans["value"] = number
            #da appendere solo se non l'ho già messo (caso di più trans nello stesso blocco)
            #if _isValid(input_trans["block_id_input"], input_trans_output)==False:
            input_trans_output.append(input_trans)


## find output of transaction in input_dataset to find transaction in output
output_trans_output=[]
for s in input_dataset:
   # if s.get("block_id") == find_Block:
        if s.get("transaction_hash") == find_transaction_hash:
            output_trans={};
            output_trans["block_id_input"] = s.get("block_id")
            output_trans["transaction_hash_input"] = s.get("transaction_hash")
            output_trans["block_id_output"] = s.get("spending_block_id")
            output_trans["transaction_hash_output"] = s.get("spending_transaction_hash")
            output_trans["index_input"] = s.get("index")
            output_trans["index_output"] = s.get("spending_index")
            output_trans["recipient"] = s.get("recipient")
            number = int(s.get("value")) / 100000000
            output_trans["value"] = number
            output_trans_output.append(output_trans)


## find output of transaction - usefull for unspent transaction
output_transaction=[];
for o in output_dataset:
    if (o.get("transaction_hash") == find_transaction_hash):
       # output_transaction.append(o);
       output = {};
       output["block_id"] = o.get("block_id")
       output["transaction_hash"] = o.get("transaction_hash")
       output["index"] = o.get("index")
       output["recipient"] = o.get("recipient")
       #output["is_spendable"] = o.get("is_spendable")
       number = int(o.get("value")) / 100000000
       output["value"] = number
       output_transaction.append(output)


### build first file JSON 

blocks = [];

num=1;
for i in range(len(block_dataset)-1):
    # take block in input
    for inp_tr in input_trans_output:
        if inp_tr.get("block_id_input")==block_dataset[i].get("id") :
            if _isValid(inp_tr.get("block_id_input"),blocks)==False:
                obj= {};
                obj["id"]=block_dataset[i].get("id");
                obj["hash"] = block_dataset[i].get("hash");
                obj["time"] = block_dataset[i].get("time");
                obj["guessed_miner"] = block_dataset[i].get("guessed_miner");
                obj["type"] = 2;
                trans=[]
                t = {};
                t["trans_name"]=name+str(num)
                num=num+1;
                t["trans_hash"]=inp_tr.get("transaction_hash_input")
                t["position"] = -1;
                trans.append(t)
                obj["transaction"]= trans;
                blocks.append(obj);
            else :
                for b in blocks:
                    if b.get("id")== block_dataset[i].get("id") :
                        t = {};
                        t["trans_name"] = name + str(num)
                        num = num + 1;
                        t["trans_hash"] = inp_tr.get("transaction_hash_input")
                        t["position"] = -1;
                        b["transaction"].append(t)

    # take block of transaction
    if transaction_hash.get("block_id") == block_dataset[i].get("id"):
        obj = {};
        obj["id"] = block_dataset[i].get("id");
        obj["hash"] = block_dataset[i].get("hash");
        obj["time"] = block_dataset[i].get("time");
        obj["guessed_miner"] = block_dataset[i].get("guessed_miner");
        obj["type"] = 2;
        trans=[]
        t={};
        t["trans_name"] = name;
        t["trans_hash"] =transaction_hash.get("hash");
        t["position"]=0;
        trans.append(t)
        obj["transaction"] = trans;
        blocks.append(obj);
    # take block in output
    for outp_tr in output_trans_output:
        if outp_tr.get("block_id_output")==block_dataset[i].get("id"):
            if _isValid(outp_tr.get("block_id_output"), blocks) == False:
                obj= {};
                obj["id"]=block_dataset[i].get("id");
                obj["hash"] = block_dataset[i].get("hash");
                obj["time"] = block_dataset[i].get("time");
                obj["guessed_miner"] = block_dataset[i].get("guessed_miner");
                obj["type"] = 2;
                trans = []
                t = {};
                t["trans_name"] = name + str(num)
                num = num + 1;
                t["trans_hash"] = outp_tr.get("transaction_hash_output")
                t["position"] = 1;
                trans.append(t)
                obj["transaction"] = trans;
                blocks.append(obj);
            else :
                for b in blocks:
                    if b.get("id")== block_dataset[i].get("id") :
                        t = {};
                        t["trans_name"] = name + str(num)
                        num = num + 1;
                        t["trans_hash"] = outp_tr.get("transaction_hash_output")
                        t["position"] = 1;
                        b["transaction"].append(t)



blocks_transaction_output=[];

for i in range(len(blocks)-1):
    blocks_transaction_output.append(blocks[i])
    if int(blocks[i].get("id")) < int(blocks[i + 1].get("id")) - 2:  ##distano più di 2
        obj = {}
        id1 = int(blocks[i].get("id")) + 1;
        id2 = int(blocks[i + 1].get("id")) - 1
        obj["id"] = idClusterBlock(str(id1), str(id2))
        obj["type"] = 0
        blocks_transaction_output.append(obj)
    elif int(blocks[i].get("id"))==int(blocks[i+1].get("id"))-2: #c'è un solo blocco che li divide
        obj = {}
        id= int(blocks[i].get("id"))+1;
        obj["id"] = str(id)
        obj["type"] = 0
        blocks_transaction_output.append(obj)

blocks_transaction_output.append(blocks[len(blocks)-1])

json.dump(blocks_transaction_output, open("./output/transactionMode_dataset0.json", "w"))

## build second file JSON for transaction info
transaction=[]

for inp_tr in input_trans_output:
    if transaction:
        for t in transaction:
            if inp_tr.get("block_id_input")==t.get("id_input"):
                trans={};
                trans["index"] = inp_tr.get("index_output");
                trans["value"] = inp_tr.get("value");
                trans["address"] = inp_tr.get("recipient");
                t.get("transaction").append(trans)
                break;
            else :
                obj={}
                obj["id_input"]=inp_tr.get("block_id_input");
                obj["id_output"] = inp_tr.get("block_id_output");
                listTrans=[]
                trans = {};
                trans["index"] = inp_tr.get("index_output");
                trans["value"] = inp_tr.get("value");
                trans["address"] = inp_tr.get("recipient");
                listTrans.append(trans)
                obj["transaction"]=listTrans
                transaction.append(obj);
                break;
    else :
        obj = {}
        obj["id_input"] = inp_tr.get("block_id_input");
        obj["id_output"] = inp_tr.get("block_id_output");
        listTrans = []
        trans = {};
        trans["index"] = inp_tr.get("index_output");
        trans["value"] = inp_tr.get("value");
        trans["address"] = inp_tr.get("recipient");
        listTrans.append(trans)
        obj["transaction"] = listTrans
        transaction.append(obj);

for outp_tr in output_trans_output:
    for t in transaction:
        if outp_tr.get("block_id_output") == t.get("id_output"):
            trans = {};
            trans["index"] = outp_tr.get("index_output");
            trans["value"] = outp_tr.get("value");
            trans["address"] = outp_tr.get("recipient");
            t.get("transaction").append(trans)
            break
        else:
            obj = {}
            obj["id_input"] = outp_tr.get("block_id_input");
            obj["id_output"] = outp_tr.get("block_id_output");
            listTrans = []
            trans = {};
            trans["index"] = outp_tr.get("index_input");
            trans["value"] = outp_tr.get("value");
            trans["address"] = outp_tr.get("recipient");
            listTrans.append(trans)
            obj["transaction"] = listTrans
            transaction.append(obj);
            break

if (len(output_trans_output)!=len(output_transaction)):
    obj = {}
    obj["id_input"] = output.get("block_id");
    obj["id_output"] = "-";
    obj["transaction"]=[];
    for outp_tr in output_trans_output:
        for output in output_transaction:
            if(outp_tr.get("index_input")!= output.get("index")):
                trans={}
                trans["index"] = output.get("index");
                trans["value"] = output.get("value");
                trans["address"] = output.get("recipient");
                obj["transaction"].append(trans);
    transaction.append(obj);

json.dump(transaction, open("./output/transactionMode_trans0.json", "w"))




