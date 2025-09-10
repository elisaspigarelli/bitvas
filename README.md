# Project Overview

Bitvas (Bitcoin Visual Analytics System) is a "Proof of Concept" system developed for the visual analysis of Bitcoin transactions. The system provides a powerful and interactive web-based application to analyze key components of the Bitcoin Blockchain. 
It allows analysts to conduct four main types of investigations:

- General Block Analysis: Analyze blocks within a defined time range by selecting a specific timestamp.

- Miner Block Validation: Analyze blocks validated by a specific miner.

- Block Information Analysis: View and analyze information about a specific block.

- Transaction Analysis: Investigate detailed information regarding a specific Bitcoin transaction.


## Technologies Used

### Frontend:

Vanilla JavaScript, CSS, and HTML were used to build the web interface. The decision to use these technologies was made to avoid dependency on any specific frameworks, ensuring the application remains lightweight and flexible.

### Backend:

The application runs on Apache Tomcat as the web server for serving the frontend and handling the application requests.

### Data Processing:

Python scripts were used to process the raw Bitcoin Blockchain data. These scripts aggregate, filter, and transform the data into a usable format, which is then stored as JSON files in the dataset folder for use in the application.

## Data Processing
The system uses real data from the [Bitcoin Blockchain](https://gz.blockchair.com/bitcoin/blocks/) and serves as the foundation for interactive visualizations. To simulate interaction with a backend (BE) and a database that performs queries and retrieves data, the raw Bitcoin data has been aggregated and filtered through Python scripts. This preprocessing step mimics how data would typically be queried from a backend system. Once processed, the data is made available in the application as JSON files, which are stored in the dataset folder.

### Dataset Processing:
This project allows you to process a selected dataset and generate JSON files that are used in the application. All the data processing scripts are located in the data-elaboration folder. The main script that runs the entire data processing pipeline is run_script.py.

#### Structure

- data-elaboration/: Folder containing the data processing scripts.

- run_script.py: Main script that processes all the other scripts.

- files/: Folder containing input, dataset, output folder and the processing scripts

    - dataset/: Folder containing the datasets to be processed, real data from the Bitcoin Blockchain
    - input/: Folder containing JSON file that are made from a script as input file for others scripts
    - output/: Folder where the resulting JSON files from the data processing are saved.

#### How to Use
1) Set up the environment

Make sure you have an active Python environment, preferably within a virtual environment. If you haven’t created one yet, you can do so with the following commands:

```sh
python3 -m venv venv
source venv/bin/activate

```
2) Run the run_script.py script

To run the data processing, execute the run_script.py script from the terminal:
```sh
python3 data-elaboration/run_script.py

```
3) Check the results

Once the script has completed, you will find the resulting JSON files in the data-elaboration/files/output/ folder. These files are the same used in the application in the dataset project folder.

## Run the Application
To run the application, follow these steps:

### Deploy to Apache Tomcat
First, you need to deploy the application on an Apache Tomcat server. You can follow the official guide for deployment [here](https://tomcat.apache.org/).

### Access the Application
Once the application is deployed, open your browser and navigate to the deployed directory in your Tomcat server. Typically, this would be something like http://localhost:8080/bitvas, but the exact URL depends on your Tomcat configuration.

### Interaction Parameters
Since this is a Proof of Concept, there are fixed parameters you can use to interact with the application. The available interaction parameters for each analysis are:

- General Block Analysis: Timestamp 01/12/2021 11:42
- Miner Block Validation: everyone available
- Block Information Analysis: Block ID 712080
- Transaction Analysis: Hash/Transaction ID ba11cd551c626aba0cb3c7a494981512d99d9dabb08c11168ad0c417b51d8ef9

These parameters allow you to filter the data and simulate different types of queries on the Bitcoin Blockchain. 