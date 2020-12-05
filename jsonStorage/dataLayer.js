'use strict';

const fs = require('fs').promises;
const path = require('path');

const storageConfig = require('./storageConfig.json');
const { readStorage, getById, insertCustomer, updateCustomer, removeCustomer } = require(path.join(
    __dirname,
    storageConfig.privateAPI
));

const { CODES, MESSAGES } = require(path.join(__dirname, storageConfig.errors));

class Data {
    constructor() {}

    getAll() {
        return readStorage();
    }
    get(id) {
        return new Promise(async (resolve, reject) => {
            if (!id) {
                reject(MESSAGES.NOT_FOUND('<empty Id>'));
            } else {
                const result = await getById(id);
                resolve(result);
                if (result) {
                    resolve(result);
                } else {
                    reject(MESSAGES.NOT_FOUND(id));
                }
            }
        });
    }

    insert(customer) {
        return new Promise(async (resolve, reject) => {
            if (
                !(
                    customer.customerId &&
                    customer.firstname &&
                    customer.lastname &&
                    customer.address &&
                    customer.favoriteIceCream
                )
            ) {
                reject(MESSAGES.NOT_INSERTED());
            } else {
                if (await insertCustomer(customer)) {
                    resolve(MESSAGES.INSERT_OK(customer.customerId));
                } else {
                    reject(MESSAGES.ALREADY_IN_USE(customer.customerId));
                }
            }
        });
    }

    update(customer) {
        return new Promise(async (resolve, reject) => {
            if (
                !(
                    customer.customerId &&
                    customer.firstname &&
                    customer.lastname &&
                    customer.address &&
                    customer.favoriteIceCream
                )
            ) {
                reject(MESSAGES.NOT_UPDATED());
            } else {
                if (await updateCustomer(customer)) {
                    resolve(MESSAGES.UPDATE_OK(customer.customerId));
                } else {
                    reject(MESSAGES.NOT_UPDATED(customer.customerId));
                }
            }
        });
    }

    remove(customerId) {
        return new Promise(async (resolve, reject) => {
            if (!customerId) {
                reject(MESSAGES.NOT_REMOVED());
            } else {
                if (await removeCustomer(customerId)) {
                    resolve(MESSAGES.REMOVE_OK(customerId));
                } else {
                    reject(MESSAGES.NOT_REMOVED());
                }
            }
        });
    }
}

module.exports = { Data };

// TESTS
/* const storage = new Data(); */
/* storage.getAll().then((data) => console.log(data)); */
/* storage
    .get(1000)
    .then((data) => console.log(data))
    .catch((err) => console.log(err)); */
/* storage.insert({
    customerId: 1004,
    firstname: 'Abel',
    lastname: 'Garcia',
    address: 'Bugpath 42',
    favoriteIceCream: 'strawberry',
}); */
/* storage.update({
    customerId: 1003,
    firstname: 'Abel',
    lastname: 'Garcia',
    address: 'Bugpath 42',
    favoriteIceCream: 'vanilla',
}); */
/* storage.remove(1003); */

/* async function test() {
    const result = await storage1.checkStorage();
    console.log(result);
}
test();
 */
