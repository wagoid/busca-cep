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

module.exports = function (cep, sync) {
  if (cep && isNaN(cep)) {
    cep = cep.replace(/[-\s]/g, '');
  }
  let ret;
  
  if (sync) {
    try {
      ret = syncRequest('GET', `${VIACEP_URI}/ws/${cep}/json`);
      ret = JSON.parse(ret.getBody()) || {};
    } catch(e) {
      ret = {
        statusCode: e.statusCode,
        error: e.message
      };
    }
  } else {
    ret = new Promise((resolve, reject) => {
      if (invalidCep(cep)) {
        reject(`The CEP should be a number or string of size ${CEP_SIZE}. Please check your parameter.`);
      } else {
        callViaCep(cep)
          .then(placeInfo => {
            resolve(placeInfo);
          })
          .catch(err => {
            reject( {statusCode: err.statusCode, error: err.error});
          });
      }
    });
  }
  
  return ret;
  
};