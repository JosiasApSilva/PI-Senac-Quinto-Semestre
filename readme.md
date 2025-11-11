# MVP TI Web

## Descrição
O **MVP TI Web** é um sistema simples para **gestão de chamados de TI**, desenvolvido como parte do **Projeto Integrador (Grupo 2)**.  
Permite cadastrar, listar e encerrar chamados, com armazenamento local em um arquivo JSON.

---

## Funcionalidades
- Cadastro de chamados  
- Listagem de chamados  
- Visualização de detalhes  
- Encerramento de chamados  
- Armazenamento local (JSON)

---

## Tecnologias Utilizadas
- Node.js  
- Express.js  
- HTML / CSS / JavaScript  

---

## Estrutura do Projeto
mvp-ti-web/
│
├── data/
│ └── tickets.json
├── public/
│ ├── index.html
│ ├── create.html
│ ├── dashboard.html
│ ├── ticket.html
│ ├── script.js
│ └── style.css
├── routes/
│ └── tickets.js
├── db.js
├── server.js
└── package.json

---

## Instalação e Execução

### 1 Instalar Node.js
Baixe em: [https://nodejs.org](https://nodejs.org)  
Verifique a instalação:
```bash
node -v
npm -v

### 2 Instalar Dependências
No terminal, dentro da pasta do projeto:

bash
npm install

### 3 Executar o Projeto
bash
npm start
Acesse no navegador:
http://localhost:3000

Equipe – Grupo 2
Josias Aparecido da Silva
Cintia Simoni
Sandra Larissa Marques Couto
Newton Silvestre de Mello
Marcos Vinicius Araújo Santana
