# busca-cep

[![Build Status](https://travis-ci.org/wagoid/busca-cep.svg?branch=master)](https://travis-ci.org/wagoid/busca-cep)
[![Coverage Status](https://coveralls.io/repos/github/wagoid/busca-cep/badge.svg?branch=master)](https://coveralls.io/github/wagoid/busca-cep?branch=master)

Busca por ceps do Brasil utilizando o serviço ViaCEP

### Instalação

```npm install --save busca-cep```

### Como usar

```javascript
var buscaCep = require('busca-cep');

buscaCep('01001-000')
  .then(endereco => {
    console.log(endereco);
  })
  .catch(erro => {
    console.log(`Erro: statusCode ${erro.statusCode} e mensagem ${erro.message}`);
  });
```

Ou, caso você queira uma requisição síncrona, passe true no segundo parâmetro:

```javascript
var resposta = buscaCep('01001-000', true);//Também pode ser usado buscaCep('01001-000', {sync: true});
if (!resposta.hasError) {
  console.log(resposta);
} else {
  console.log(`Erro: statusCode ${resposta.statusCode} e mensagem ${resposta.message}`);
}
```

Enjoy it!
