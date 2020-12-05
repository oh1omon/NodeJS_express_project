'use strict';

const CODES = {
    0: 'NOT_FOUND',
    1: 'INSERT_OK',
    2: 'ALREADY_IN_USE',
    3: 'NOT_INSERTED',
    4: 'UPDATE_OK',
    5: 'NOT_UPDATED',
    6: 'REMOVE_OK',
    7: 'NOT REMOVED',
    8: 'WRITE_OK',
    9: 'WRITE_ERROR',
};

const MESSAGES = {
    NOT_FOUND: () => ({
        message: 'The customer has not been found',
        code: CODES[0],
        type: 'error',
    }),
    INSERT_OK: (id) => ({
        message: `The customer with id ${id} has been inserted into database`,
        code: CODES[1],
        type: 'info',
    }),
    ALREADY_IN_USE: (id) => ({
        message: `The customer with id ${id} is not inserted, since it is already in the database`,
        code: CODES[2],
        type: 'error',
    }),
    NOT_INSERTED: () => ({
        message: 'The person has not been inserted into the database',
        code: CODES[3],
        type: 'error',
    }),
    UPDATE_OK: (id) => ({
        message: `The customer with id ${id} has been updated`,
        code: CODES[4],
        type: 'info',
    }),
    NOT_UPDATED: () => ({
        message: 'The customer has not been updated',
        code: CODES[5],
        type: 'error',
    }),
    REMOVE_OK: (id) => ({
        message: `The customer with id ${id} has been deleted`,
        code: CODES[6],
        type: 'info',
    }),
    NOT_REMOVED: () => ({
        message: 'The customer has not been removed',
        code: CODES[7],
        type: 'error',
    }),
    WRITE_OK: () => ({
        message: 'Write has been ok',
        code: CODES[8],
        type: 'info',
    }),
    WRITE_ERROR: (err) => ({
        message: `Error ${err} has occured`,
        code: CODES[9],
        type: 'error',
    }),
};

module.exports = {
    CODES,
    MESSAGES,
};
