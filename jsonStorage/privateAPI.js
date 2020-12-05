'use strict';

const fs = require('fs').promises;
const { read, write } = require('fs');
const path = require('path');
const { CODES, MESSAGES } = require('./errors');

const storageConfig = require('./storageConfig.json');

const storageFile = path.join(__dirname, storageConfig.storageFile);

const readStorage = async () => {
    try {
        const storage = await fs.readFile(storageFile, 'utf8');
        return JSON.parse(storage);
    } catch (err) {
        console.log(err);
        return [];
    }
};

const writeStorage = async (data) => {
    try {
        await fs.writeFile(storageFile, JSON.stringify(data, null, 4));
        return MESSAGES.WRITE_OK;
    } catch (err) {
        return MESSAGES.WRITE_ERROR(err.message);
    }
};

const getById = async (id) => {
    return (await readStorage()).find((customer) => customer.customerId == id) || null;
};

const insertCustomer = async (newCustomer) => {
    const storage = await readStorage();
    if (storage.find((customer) => customer.customerId == newCustomer.customerId)) {
        return false;
    } else {
        storage.push({
            customerId: +newCustomer.customerId,
            firstname: newCustomer.firstname,
            lastname: newCustomer.lastname,
            address: newCustomer.address,
            favoriteIceCream: newCustomer.favoriteIceCream,
        });
        await writeStorage(storage);
        return true;
    }
};

const updateCustomer = async (customerToUpd) => {
    const storage = await readStorage();
    const oldVer = storage.find((customer) => customer.customerId == customerToUpd.customerId);
    if (oldVer) {
        Object.assign(oldVer, {
            customerId: +customerToUpd.customerId,
            firstname: customerToUpd.firstname,
            lastname: customerToUpd.lastname,
            address: customerToUpd.address,
            favoriteIceCream: customerToUpd.favoriteIceCream,
        });
        await writeStorage(storage);
        return true;
    } else {
        return false;
    }
};

const removeCustomer = async (oldId) => {
    const storage = await readStorage();
    const customerToRemoveIndex = storage.findIndex((customer) => customer.customerId == oldId);
    if (customerToRemoveIndex > 0) {
        storage.splice(customerToRemoveIndex, 1);
        await writeStorage(storage);
        return true;
    } else {
        return false;
    }
};

module.exports = {
    readStorage,
    getById,
    writeStorage,
    insertCustomer,
    updateCustomer,
    removeCustomer,
};
