'use strict';

const fs = require('fs/promises');
const http = require('http');
const path = require('path');
const express = require('express');

const { port, host, storage } = require('./serverConfig.json');
const { stat } = require('fs');
const { Data } = require(path.join(__dirname, storage.storageFolder, storage.dataLayer));
const menuPath = path.join(__dirname, 'index.html');

const Storage = new Data();
const app = express();

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'viewPages'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(menuPath);
});

app.get('/getAll', (req, res) => {
    Storage.getAll().then((result) =>
        res.render('getAll', {
            title: 'All persons',
            header: 'Here are all customers',
            result: result.map((customer) => createPerson(customer)),
        })
    );
});

app.get('/getById', (req, res) => {
    res.render('getById', {
        title: 'Insert ID',
        header: 'Getting by ID',
        action: '/getByID',
        submit: 'Get the person!',
    });
});

app.post('/getById', (req, res) => {
    if (!req.body) res.sendStatus(500);
    const idToFind = req.body.personId;
    Storage.get(idToFind)
        .then((result) =>
            res.render('personPage', {
                title: 'Found person',
                header: 'Here is the result',
                result: createPerson(result),
            })
        )
        .catch((err) => sendErrPage(res, err));
});

app.get('/insert', (req, res) => {
    res.render('form', {
        title: 'Insert',
        header: 'New customers inserting',
        action: '/insert',
        submit: 'Insert',
        personId: { value: '', readonly: '' },
        firstname: { value: '', readonly: '' },
        lastname: { value: '', readonly: '' },
        address: { value: '', readonly: '' },
        favoriteIceCream: { value: '', readonly: '' },
    });
});

app.post('/insert', (req, res) => {
    if (!req.body) res.sendStatus(500);
    const newCustomer = createCustomer(req.body);
    Storage.insert(newCustomer)
        .then((status) => sendStatusPage(res, status))
        .catch((err) => sendErrPage(res, err));
});

app.get('/update', (req, res) => {
    res.render('form', {
        title: 'Update',
        header: 'Update customer by ID',
        action: '/update',
        submit: 'Update',
        personId: { value: '', readonly: '' },
        firstname: { value: '', readonly: 'readonly' },
        lastname: { value: '', readonly: 'readonly' },
        address: { value: '', readonly: 'readonly' },
        favoriteIceCream: { value: '', readonly: 'readonly' },
    });
});

app.post('/update', (req, res) => {
    if (!req.body) res.sendStatus(500);
    Storage.get(req.body.personId)
        .then((customer) => createPerson(customer))
        .then((person) =>
            res.render('form', {
                title: 'Update',
                header: `Edit customer ${person.personId} data`,
                action: '/updatePerson',
                submit: 'Update',
                personId: { value: person.personId, readonly: 'readonly' },
                firstname: { value: person.firstname, readonly: '' },
                lastname: { value: person.lastname, readonly: '' },
                address: { value: person.address, readonly: '' },
                favoriteIceCream: { value: person.favoriteIceCream, readonly: '' },
            })
        )
        .catch((err) => sendErrPage(res, err));
});

app.post('/updatePerson', (req, res) => {
    if (!req.body) res.sendStatus(500);
    Storage.update(createCustomer(req.body))
        .then((status) => sendStatusPage(res, status))
        .catch((err) => sendErrPage(res, err));
});

app.get('/remove', (req, res) => {
    res.render('getById', {
        title: 'Person removing',
        header: 'Remove by ID',
        action: '/remove',
        submit: 'Delete this perkele!',
    });
});

app.post('/remove', (req, res) => {
    if (!req.body) res.sendStatus(500);
    Storage.remove(req.body.personId)
        .then((status) => sendStatusPage(res, status))
        .catch((err) => sendErrPage(res, err));
});

server.listen(port, host, () => console.log(`server ${host}:${port} is serving`));

// Functions Status || Error sending

const sendStatusPage = (res, status, title = 'Status', header = 'Status', errClass = '') => {
    res.render('statusPage', { title, header, status, errClass: errClass });
};

const sendErrPage = (res, error, title = 'Error', header = 'Error') => {
    sendStatusPage(res, error, title, header, 'error');
};

// Functions (customer => person || person => customer)

function createCustomer(person) {
    return {
        customerId: person.personId,
        firstname: person.firstname,
        lastname: person.lastname,
        address: person.address,
        favoriteIceCream: person.favoriteIceCream,
    };
}

function createPerson(customer) {
    return {
        personId: customer.customerId,
        firstname: customer.firstname,
        lastname: customer.lastname,
        address: customer.address,
        favoriteIceCream: customer.favoriteIceCream,
    };
}
