'use strict';

var requestPromise = require('request-promise');
var syncRequest = require('sync-request');

const CEP_SIZE = 8;
const VIACEP_URI = 'https://viacep.com.br';

function callViaCep(cep) {
  let requestOptions = {
    json: true,
    uri: `${VIACEP_URI}/ws/${cep}/json`
  };

  return requestPromise(requestOptions);
}

function invalidCep (cep) {
  return !cep || !isStringOrNumber(cep) || cep.toString().length !== CEP_SIZE;
}

function isStringOrNumber (value) {
  return typeof value === 'string' || value instanceof String || !isNaN(value);
}

function getValidationMessage() {
  return `The CEP should be a number or string of size ${CEP_SIZE}. Please check your parameter.`;
}

function getDataSync (cep) {
  let ret;
  try {
    if (invalidCep(cep)) {
      throw new Error(getValidationMessage());
    }
    ret = syncRequest('GET', `${VIACEP_URI}/ws/${cep}/json`);
    ret = JSON.parse(ret.getBody()) || {};
  } catch(e) {
    ret = {
      hasError: true,
      statusCode: e.statusCode,
      message: e.message
    };
  }
  
  return ret;
}

function getDataAsync (cep) {
   return new Promise((resolve, reject) => {
    if (invalidCep(cep)) {
      reject({ message: getValidationMessage() });
    } else {
      callViaCep(cep)
        .then(placeInfo => {
          resolve(placeInfo);
        })
        .catch(err => {
          reject( {statusCode: err.statusCode, message: err.error});
        });
    }
  });
}

module.exports = function getZipCode(cep, sync) {
  if (cep && isNaN(cep)) {
    cep = cep.replace(/[-\s]/g, '');
  }
  let ret;
  
  if (sync === true || (arguments[1] && arguments[1].sync)) {
    ret = getDataSync(cep);
  } else {
    ret = getDataAsync(cep);
  }
  
  return ret;
};