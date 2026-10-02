# Foco+ — projeto Web para demonstração de Git

Um gerenciador de tarefas feito em HTML, CSS e JavaScript. Permite criar, concluir, excluir e filtrar tarefas. O progresso aparece em uma barra, e as tarefas persistem no `localStorage` do navegador.

## Abrir

Abra `index.html` no navegador. Não precisa instalar pacotes, iniciar servidor ou criar conta. O app usa `localStorage`. Se o acesso direto por arquivo limitar o armazenamento no seu navegador, rode `python -m http.server 8000` nessa pasta e abra `http://localhost:8000`.

## Arquivos

- `index.html`: estrutura e acessibilidade da interface.
- `assets/style.css`: cores, layout e responsividade.
- `assets/app.js`: estado das tarefas, filtros e armazenamento.
- `.gitignore`: padrões de arquivos que não devem ir para o repositório.
- `.env.example`: exemplo público de configuração.
- `.env`, `logs/app.log`, `node_modules/`: arquivos fictícios para demonstrar as regras de exclusão.

O projeto está sem a pasta `.git` para permitir `git init` ao vivo. A regra `.primary-button` em `assets/style.css` usa `background: #ffcc45`: altere para `#48e5c2` e use `git diff` para mostrar essa mudança antes do commit. O texto do botão em `index.html` pode ser alterado de `Adicionar tarefa` para `Criar tarefa` na etapa de correção da mensagem com `git commit --amend`
