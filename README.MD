# Logistics RESTFull API

### to-do

- Implementar testes unitários e de integração
- Implementar 'migrations'
- Implementar sistema de mensageria (SMS e email, talvez implementar Redis)
- Se livrar da tipagem error:any, elaborando um tratamento de erro mais inteligente
- Implementar interfaces nas camadas de mensageria das entidades,
  permitindo a mudança de serviço de entrega de mensagens de forma
  rápida e eficiente.

### Notas

- Para iniciar a aplicação você deverá remover a verificação de permissões para criar as primeiras permissões e grupos de permissões.
- No arquivo index.js o comando AppDataSource.synchronize roda por default, mas você deve desabilitar o mesmo antes de subir o ambiente para produção ou staging.
