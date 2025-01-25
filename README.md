# AI002 Project

This project provides a framework for [describe the project's purpose, e.g., building a search system with ElasticSearch integration].

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Environment Variables](#environment-variables)

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd AI002
```

Install dependencies:

Use the following command to install required packages:

```bash
npm install
```

Set up environment variables:

Create a `.env` file in the project root based on the `.env` template provided and set the required configurations.

## Usage

To run the server:

```bash
npm start
```

The application will initialize the server using the `server.js` file. Ensure that any required services, like ElasticSearch, are running and configured.

## Features
- **ElasticSearch Integration**: Manage and query an ElasticSearch index using the `elastic.js` module.
- **Keyword Search**: Perform efficient searches with the `keywordSearch.js` module.
- **Testing Framework**: A test file (`test.js`) is included for verifying functionality.

## Environment Variables

The `.env` file should contain:
- ElasticSearch host configuration
- OPENAI_API_KEY
- GEMINI_API_KEY
- TOGETHER_API_KEY

Refer to the `.env` file for specific variable requirements.

