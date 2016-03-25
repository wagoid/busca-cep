'use strict';

var rp = require('request-promise');

const CEP_SIZE = 8;
const VIACEP_URI = 'https://viacep.com.br';

function callViaCep(cep) {
  var requestOptions = {
    json: true,
    uri: `${VIACEP_URI}/ws/${cep}/json`
  };

  return rp(requestOptions);
}

function makePromise (method) {
  return new Promise(method);
}

function invalidCep (cep) {
  return !cep || !isStringOrNumber(cep) || cep.length !== CEP_SIZE;
}

function isStringOrNumber (value) {
  return typeof value === 'string' || value instanceof String;
}

module.exports = function (cep) {
  if (cep && isNaN(cep)) {
    cep = cep.replace(/[-\s]/g, '');
  }

  return makePromise((resolve, reject) => {
    if (invalidCep(cep)) {
      reject(`The CEP should be a number or string of size ${CEP_SIZE}. Please check your parameter.`);
    } else {
      callViaCep(cep)
        .then(placeInfo => {
          resolve(placeInfo);
        })
        .catch(err => {
          reject(`There was an error searching for the cep. The error is ${err}`);
        });
    }
  });
};