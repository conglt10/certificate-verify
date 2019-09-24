'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');

let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// const configPath = path.join(process.cwd(), './config.json');
// const configJSON = fs.readFileSync(configPath, 'utf8');
// const config = JSON.parse(configJSON);

// //use this identity to query
// const appAdmin = config.appAdmin;

app.post('/auth', async (req, res) => {});

app.post('/verify', async (req, res) => {});

app.get('register/:id', async (req, res) => {});

app.get('/AllSubjects', async (req, res) => {});

app.post('/register', async (req, res) => {});

app.listen(process.env.PORT || 8000);
