# Project Overview

Bitvas (Bitcoin Visual Analytics System) is a "Proof of Concept" system developed for the visual analysis of Bitcoin transactions. The system provides a powerful and interactive web-based application to analyze key components of the Bitcoin Blockchain. 
It allows analysts to conduct four main types of investigations:

- General Block Analysis: Analyze blocks within a defined time range by selecting a specific timestamp.

- Miner Block Validation: Analyze blocks validated by a specific miner.

- Block Information Analysis: View and analyze information about a specific block.

- Transaction Analysis: Investigate detailed information regarding a specific Bitcoin transaction.

## Data 
The system uses real data from the Bitcoin Blockchain (https://gz.blockchair.com/bitcoin/blocks/) and serves as the foundation for interactive visualizations. To simulate interaction with a backend (BE) and a database that performs queries and retrieves data, the raw Bitcoin data has been aggregated and filtered through Python scripts. This preprocessing step mimics how data would typically be queried from a backend system. Once processed, the data is made available in the application as JSON files, which are stored in the dataset folder.

## Technologies Used

### Frontend:

Vanilla JavaScript, CSS, and HTML were used to build the web interface. The decision to use these technologies was made to avoid dependency on any specific frameworks, ensuring the application remains lightweight and flexible.

### Backend:

The application runs on Apache Tomcat as the web server for serving the frontend and handling the application requests.

### Data Processing:

Python scripts were used to process the raw Bitcoin Blockchain data. These scripts aggregate, filter, and transform the data into a usable format, which is then stored as JSON files in the dataset folder for use in the application.

## Run the Application
To run the application, follow these steps:

### Deploy to Apache Tomcat
First, you need to deploy the application on an Apache Tomcat server. You can follow the official guide for deployment [here](https://tomcat.apache.org/).

### Access the Application
Once the application is deployed, open your browser and navigate to the deployed directory in your Tomcat server. Typically, this would be something like http://localhost:8080/bitvas, but the exact URL depends on your Tomcat configuration.

### Interaction Parameters
Since this is a Proof of Concept, there are fixed parameters you can use to interact with the application. The available interaction parameters are:

<timestamp: 01/12/2021 11:42>

<hash/Transaction ID: ba11cd551c626aba0cb3c7a494981512d99d9dabb08c11168ad0c417b51d8ef9>

These parameters allow you to filter the data and simulate different types of queries on the Bitcoin Blockchain. 