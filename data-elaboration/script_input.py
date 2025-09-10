import json

# INPUT DATASET
input_dataset=[{}]
with open('./input/input_dataset.json', 'w') as outfile, open("./dataset/blockchair_bitcoin_inputs_20211201.tsv","r") as f:
    firstline = f.readline()
    columns = firstline.strip().split('\t')
    #columns.insert(4,'hour')
    #columns.insert(16, 'spending_hour')
    lines = f.readlines()[0:]
    for line in lines:
        values = line.strip().split('\t')
        entry = dict(zip(columns, values))
        input_dataset.append(entry)
    input_dataset.pop(0)
    json.dump(input_dataset, outfile)
########################################
## BLOCK DATASET
block_dataset=[{}]
with open('./input/block_dataset.json', 'w') as outfile, open("./dataset/blockchair_bitcoin_blocks_20211201.tsv","r") as f:
    firstline = f.readline()
    columns = firstline.strip().split('\t')
    lines = f.readlines()[0:]
    for line in lines:
        values = line.strip().split('\t')
        entry = dict(zip(columns, values))
        block_dataset.append(entry)
    block_dataset.pop(0)
    json.dump(block_dataset, outfile)
###############################
# OUTPUT DATASET
output_dataset=[{}]
with open('./input/output_dataset.json', 'w') as outfile, open("./dataset/blockchair_bitcoin_outputs_20211201.tsv","r") as f:
    firstline = f.readline()
    columns = firstline.strip().split('\t')
    lines = f.readlines()[0:]
    for line in lines:
        values = line.strip().split('\t')
        entry = dict(zip(columns, values))
        output_dataset.append(entry)
    output_dataset.pop(0)
    json.dump(output_dataset, outfile)
######################
# TRANSACTION DATASET
transaction_dataset=[{}]
with open('./input/transaction_dataset.json', 'w') as outfile, open("./dataset/blockchair_bitcoin_transactions_20211201.tsv","r") as f:
    firstline = f.readline()
    columns = firstline.strip().split('\t')
    lines = f.readlines()[0:]
    for line in lines:
        values = line.strip().split('\t')
        entry = dict(zip(columns, values))
        transaction_dataset.append(entry)
    transaction_dataset.pop(0)
    json.dump(transaction_dataset, outfile)


########
for d in input_dataset:
    if d.get("block_id")=='712011' and d.get("transaction_hash")=='5de70a710aab65fcb7da2cc53855cee4f7ecea9a2bcfb314c7850fdb2af17e27':
        print(d);