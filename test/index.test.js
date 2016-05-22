'use strict';

const zipSearch = require('../index');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const nock = require('nock');

const expect = chai.expect;
const VIACEP_URI = 'https://viacep.com.br';
chai.use(chaiAsPromised);
const DEFAULT_CEP_REQ = '31652130';
const DEFAULT_RESPONSE = {
  cep: '31652-130',
  logradouro: 'Rua Isabel Maria Dias',
  complemento: '',
  bairro: 'Jardim dos Comerciários (Venda Nova)',
  localidade: 'Belo Horizonte',
  uf: 'MG',
  unidade: '',
  ibge: '3106200',
  gia: ''
};

function makeDefaultNock(cep) {
  nock(VIACEP_URI)
    .get(`/ws/${cep || DEFAULT_CEP_REQ}/json`)
    .reply(200, DEFAULT_RESPONSE);
}

describe('Zip search module', () => {
  it('Should get a valid response when passing a valid zip code', () => {
    makeDefaultNock();
    var zipCode = zipSearch('31652130', true);
    expect(zipCode).to.deep.equal(DEFAULT_RESPONSE);
  });
  
  it('Should work when passing the sync parameter', () => {
    makeDefaultNock();
    var zipCode = zipSearch('31652130', { sync: true });
    expect(zipCode).to.deep.equal(DEFAULT_RESPONSE);
  });
  
  it('Should get a valid response when returning promise', () => {
    makeDefaultNock();
    return expect(zipSearch('31652130')).to.eventually.deep.equal(DEFAULT_RESPONSE);
  });
  
  it('Should work when passing a zipCode with dash', () => {
    makeDefaultNock();
    return expect(zipSearch('31652-130')).to.eventually.deep.equal(DEFAULT_RESPONSE);
  });
  
  it('Should work when passing a number', () => {
    makeDefaultNock();
    return expect(zipSearch(31652130)).to.eventually.deep.equal(DEFAULT_RESPONSE);
  });
  
  it('Should return an error message when passing wrong parameter', () => {
    var result = zipSearch('wrong', true);
    expect(result.hasError).to.be.true;
    expect(result.message).to.equal('The CEP should be a number or string of size 8. Please check your parameter.'); 
  });
  
  it('Should return an error message when passing wrong parameter (async)', () => {
    var result = zipSearch('wrong').catch(err => err.message);
    return expect(result).to.eventually.equal('The CEP should be a number or string of size 8. Please check your parameter.'); 
  });
  
  it('Should handle wrong zip codes', () => {
    nock(VIACEP_URI)
      .get('/ws/123456ab/json')
      .reply(400, '<h2>Bad Request (400)</h2>');
    
    var result = zipSearch('123456ab').catch(err => err.statusCode);
    return expect(result).to.eventually.equal(400);
  });
});