'use strict';
const _ = require('lodash');
const config = require('./environment/index');
const requestPromise = require('request-promise'),
      syncRequest = require('sync-request');
const CEP_SIZE = 8,
      VIACEP_URI = config.apiViaCep.url;

const callViaCep = (cep, options) => {
  let requestOptions = {
    json: true,
    uri: `${VIACEP_URI}/ws/${cep}/json`,
    timeout: options ? options.timeout : 5000
  };
  return requestPromise(requestOptions);
}

const invalidCep = cep => {
  return !cep || !isStringOrNumber(cep) || cep.toString().length !== CEP_SIZE;
}

const isStringOrNumber = value => {
  return typeof value === 'string' || value instanceof String || !isNaN(value);
}

const getValidationMessage = () => {
  return `The CEP should be a number or string of size ${CEP_SIZE}. Please check your parameter.`;
}

const getDataSync = (cep, options) => {
  let ret;
  try {
    if (invalidCep(cep)) {
      throw new Error(getValidationMessage());
    }
    ret = syncRequest('GET', `${VIACEP_URI}/ws/${cep}/json`);
    ret = JSON.parse(ret.getBody());
  } catch(e) {
    ret = {
      hasError: true,
      statusCode: e.statusCode,
      message: e.message
    };
  }
  
  return ret;
}

const getDataAsync = (cep, options) => {
   return new Promise((resolve, reject) => {
    if (invalidCep(cep)) {
      reject({ message: getValidationMessage() });
    } else {
      callViaCep(cep, options)
        .then(placeInfo => {
          resolve(placeInfo);
        })
        .catch(err => {
          reject( {statusCode: err.statusCode, message: err.error});
        });
    }
  });
}

module.exports = function getDetailsByZipCode (cep, sync, options) {
  if (!_.isEmpty(cep) && isNaN(cep)) {
    cep = cep.replace(/[-\s]/g, '');
  }
  return (sync === true || (arguments[1] && arguments[1].sync)) ?
    getDataSync(cep, options) :
    getDataAsync(cep, options);
};