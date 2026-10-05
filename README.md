# Sistema de Alocação de Professores - FAFIRE

Aplicação web desenvolvida em React com Vite para a atividade avaliativa da disciplina de Frontend da FAFIRE. O sistema permite o gerenciamento completo (CRUD) de professores, cursos, departamentos e suas respectivas alocações acadêmicas.

---

## 👨‍🎓 Autor do Projeto

- **Nome:** Ruan Ítalo da Silva Santos
- **Curso:** Engenharia de Software - FAFIRE
- **Disciplina:** Frontend

---

## 🛠️ Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção de interfaces.
- **Vite**: Build tool e dev server de alta performance.
- **React Router DOM v6**: Gerenciamento de rotas e navegação da SPA.
- **Material UI (MUI v5)**: Sistema de design e componentes visuais responsivos.
- **HTML5 & CSS3**: Estrutura e estilização.
- **LocalStorage**: Persistência de dados local no navegador.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
Possuir o **Node.js** (versão 18 ou superior) e o **NPM** instalados na sua máquina.

### 1. Clonar o repositório ou acessar a pasta do projeto
```bash
cd atividade_frontend
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Executar a aplicação em ambiente de desenvolvimento
```bash
npm run dev
```

Acesse a aplicação no navegador através do endereço informado pelo terminal (geralmente `http://localhost:3000`).

---

## 📦 Como Gerar a Build de Produção

Para compilar e gerar os arquivos otimizados para produção:

```bash
npm run build
```

Os arquivos finais serão gerados na pasta `dist/`. Para visualizar a build localmente, execute:

```bash
npm run preview
```

---

## 📌 Rotas Disponíveis

- `/`: Landing Page com apresentação do projeto e atalhos de navegação.
- `/allocation`: Visualização e gerenciamento (CRUD) das alocações.
- `/professores`: Visualização e gerenciamento (CRUD) dos professores.
- `/cursos`: Visualização e gerenciamento (CRUD) dos cursos.
- `/departamentos`: Visualização e gerenciamento (CRUD) dos departamentos.

---

## 📋 Funcionalidades Implementadas

- **CRUD Completo**: Cadastro, listagem, edição e exclusão de Professores, Cursos, Departamentos e Alocações.
- **Persistência Local**: Uso de `localStorage` para manter os dados mesmo após atualizar a página.
- **Relacionamentos**: Alocação de Professores a Cursos e Departamentos com seletores dinâmicos.
- **Validações de Formulário**: Validação de campos obrigatórios e formato de e-mail com mensagens de erro intuitivas.
- **Feedback Visual**: Mensagens de confirmação (Snackbars) e modal de confirmação antes de exclusões.
- **Interface Responsiva**: Layout totalmente adaptável a telas de Desktop, Tablet e Celular.