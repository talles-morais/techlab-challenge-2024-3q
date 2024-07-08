# Tech Lab Challenge 2024 3q

## Sobre minha jornada no desafio

Para começar, gostaria de agradecer ao pessoal da Tech4Humans pelo apoio e mentorias, foram de grande ajuda e se mostraram interessados e disponíveis em ajudar.

Minhas principais dificuldades foram:
 - **Tempo:** O período de realização do desafio coincidiu com o fim do semestre e, consequentemente, época de provas, o que gerou alguns obstáculos e eu não consegui dedicar tanto tempo quanto desejava. Porém, com algumas medidas de gestão de tempo, acredito que consegui realizar o necessário para satisfazer os critérios do desafio.
 - **Novas tecnologias:** Algumas tecnologias utilizadas no projeto são novas para mim, tive alguma dificuldade em aprender a interpretá-las, mas acredito que me adaptei bem e consegui utilizá-las de forma satisfatória.

Meus principais acertos e avanços:
 - **Docker:** Sempre ouvi falar da ferramenta e tentei utilizá-la em outras ocasiões, porém sem sucesso. Neste projeto decidi aproveitar a possibilidade de usá-lo e me desafiar a aprender, considero que foi um grande sucesso, pois a facilidade que trouxe em configurar um container para rodar o banco de dados e poder acessá-lo apenas passando a URL foi um grande diferencial.
 - **Revisão de código:** Ter a possibilidade de pegar um projeto iniciado e ter que revê-lo, identificar seus problemas e resolvê-los foi uma experiência nova pra mim durante a graduação, a oportunidade de ver quão diferente pode ser o processo de estruturação de um aplicativo como esse me motivou a me aprofundar mais na área e procurar outras soluções para ferramentas que já estava acostumado a usar.
 - **Uso do Trello:** Devido a necessidade de organizar minha gestão de tempo devido as tarefas da universidade e pouco tempo disponível, fiz uso do Trello para criar um quadro Kanban e categorizar, por níveis de prioridade, as funcionalidades e bugs que eu desejava desenvolver ou consertar primeiro. Esta decisão foi crucial para conseguir terminar o que foi proposto.

 ## Problemas resolvidos

- ### Falha de segurança - Senha no banco de dados
  Minha primeira ação depois de iniciar o migration dos dados, foi explorar o banco de dados, e logo quando visualizei os dados armazenados na tabela users me deparei com a senha do usuário root armazenado em texto pleno, sem criptografia.
  **Solução:** Utilizei o pacote bcrypt para fazer a hash da senha no momento da migração.
  **Commit referente:** [Commit: hash password](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/534e3fe7969e30f9e1765ca368d58daa7a6da82a)

  Também adicionei a criptografia para a rota de criação de novos usuários.
  **Commit referente:** [Commit: new user hash password](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/9b74f4eb783418f32341d8610c5f7f89bc182df0)

- ### Falha de segurança - Permissão de usuário
  O usuário standard tinha a possibilidade de criar um novo usuário, (até mesmo um usuário com permissão sudo), o que pode gerar uma brecha para invasores escalarem privilégios no sistema.
  **Solução:** Remover as permissões do atendente e ocultar a área de edição de usuários, deixando essa tarefa apenas para administradores.
  **Commit referente:** [Commit: user permissions](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/24b60d2a20f2dc005e25033f9511d4c9b32e6c23)

- ### User Story - O Atendente ver apenas conversas atribuidas a ele
  **Solução:** Adicionei uma verificação na página onde estão disponíveis as conversas onde usuários sudo podem ver todas e atendentes apenas podem ver conversas atribuídas ao seu id.
  **Commit referente:** [Commit](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/156eecc705e276772f803fef8c1fd735e17511e9)

- ### User Story - Sistema de distribuição de atendimento
  **Solução:** Utilizei uma fila circular (inspirado no algoritmo round robin), para distribuir igualmente as conversas conforme elas forem iniciadas. O que pode ser aprimorado futuramente com um sistema de disponibilidade dos atendentes.
  **Commit referente:** [Commit: round robin](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/5ebae8a6c61e3e1b275cbdd75161a47380ddd25f)

- ### Bug - Atualização de usuários não está funcionando
  O erro encontrado era porque o método PUT estava tentando sobrescrever **todos** os campos do usuário, o que gerava conflito com a chave configurada no banco de dados(o campo userId).
  **Solução:** Substitui o método PUT pelo PATCH, que aplica transformações parciais no destino, o que não altera o id do usuário.
  **Commit referente:** [Commit: update user](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/688502af44a05094d32fab6087740a7985275048)
  **Extra:** A rota de atualização do usuário também não encriptava a senha antes de salvá-lo, a solução para este problema também está no commit acima.

- ### User Story - Criação de outros usuários
  **Solução:** Foi criado um componente de formulário para a criação de novos usuários, que também contou com a função para criptografar a senha do novo usuário.
  **Commit referente:** [Commit: new user form](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/67a4c55df06fe7cf1a6ee8ccf9a581e9e0772fac)

- ### User Story - Persistencia na sessão do atendente
  **Solução:** Uma solução simples para persistir a sessão do atendente é armazenar o token de acesso localmente no navegador, o que pode ser aprimorado futuramente com o uso de cookies httpOnly para prevenir possíveis ataques XSS e CSRF.
  **Commit referente:** [Commit: local storage](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/d65c4ce4684c53701010f30392864046cf2d50dc)

- ### Bug - Não está sendo carregado mais que 25 resultados na api
  Esse bug se deve a requisição ao banco de dados em ConversationsController que limita o número de objetos requisitados 25.
  **Solução:** Uma solução possível para esse problema é agrupar estas conversas em páginas para poder visualizar separadamente os dados sem poluição visual.
  **Commit referente:** [Commit: pagination](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/c35b3ae9a30bbe9b66f8c4e903ecdde51f963ba1)
  Configurei apenas 15 por lista por uma questão prática, isto pode ser facilmente alterado, colocando o número desejado de itens por página na constante referente.

- ### User Story - Entrega de mensagens em tempo real como Consumidor
- ### User Story - Entrega de mensagens e conversas em tempo real como Atendente
  Minha primeira tentativa foi tentar abaixar o tempo de refresh da página, porém percebi que isso poderia criar problemas de desempenho, então tentei seguir por outro caminho.
  **Solução:** Essas funcionalidades podem ser resolvidas adotando o uso da biblioteca Socket.IO, que possibilita a comunicação entre cliente e servidor através de uma conexão WebSocket.
  **Commit referente:** [Commit: websocket](https://github.com/talles-morais/techlab-challenge-2024-3q/commit/2ca047382343ab8a32628a9101886c820b6a2559)
