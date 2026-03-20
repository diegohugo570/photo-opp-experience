# 📸 Photo Opp Interactive Experience — API & Frontend

Aplicação full-stack desenvolvida para captura de fotos via dispositivos móveis, processamento de imagens, autenticação de usuários e gerenciamento administrativo.

O sistema permite experiências interativas de captura de fotos com aplicação de bordas personalizadas, armazenamento e controle de acesso baseado em perfis (Admin e Promotor).

---

## 🚀 Tecnologias Utilizadas

### 🔙 Backend
- Node.js  
- Express  
- MongoDB  
- Mongoose  
- JWT (Autenticação)  
- Sharp (processamento de imagem)  
- Multer (upload de arquivos)  
- CORS  

### 🔜 Frontend
- React  
- Vite  
- TailwindCSS  

---

## ⚙️ Como Rodar o Projeto Localmente

### 1️⃣ Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd photo-opp-experience
```
2️⃣ Configurar Variáveis de Ambiente
Backend (/backend/.env)

Crie um arquivo .env dentro da pasta backend:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/photo-opp
JWT_SECRET=super_secret_key_123!
FRONTEND_URL=http://localhost:5173
```
Certifique-se de que o MongoDB está rodando localmente ou utilize uma string do MongoDB Atlas.

Frontend (/frontend/.env) (opcional)
```
VITE_API_URL=http://localhost:5000/api
```
3️⃣ Rodar o Backend
```
cd backend
npm install
npm run dev
```
O servidor será iniciado em:
👉 http://localhost:5000

4️⃣ Criar Usuários Iniciais (Seed)

Com o backend rodando, execute:
```
curl -X POST http://localhost:5000/api/seed
```
Usuários criados:

Admin

Email: admin@nex.lab

Senha: admin123

Promotor

Email: promo@nex.lab

Senha: promo123

5️⃣ Rodar o Frontend
```
cd frontend
npm run dev
```
Acesse:
👉 http://localhost:5173

🧠 Decisões Técnicas

Node.js + Express foram escolhidos pela simplicidade, performance e grande ecossistema para construção de APIs.

MongoDB foi utilizado pela flexibilidade no armazenamento de dados não estruturados, ideal para logs e registros de interações.

JWT implementado para autenticação segura e escalável entre frontend e backend.

Sharp utilizado para processamento eficiente de imagens, permitindo aplicar bordas e otimizações.

Multer responsável pelo upload seguro das imagens enviadas pelos usuários.

React + Vite escolhidos para um frontend rápido, moderno e com excelente experiência de desenvolvimento.

TailwindCSS utilizado para criação rápida de interfaces responsivas com abordagem mobile-first.

RBAC (Role-Based Access Control) implementado para separar permissões entre Admin e Promotor.

Middleware de Logging desenvolvido para registrar ações do sistema, garantindo rastreabilidade e controle.

A arquitetura segue boas práticas de separação por camadas (rotas, serviços, middlewares), facilitando manutenção e escalabilidade.

---

📦 Funcionalidades Implementadas

📱 Interface mobile-first com fluxo interativo de captura

📸 Captura de imagem via câmera do dispositivo

🖼️ Processamento de imagem com aplicação de bordas (branding)

🔐 Autenticação com controle de acesso por perfil (Admin / Promotor)

📊 Painel administrativo para gestão

🧾 Sistema de logs para auditoria

📁 Armazenamento local de imagens

---

🚀 Deploy
Backend (Render / Railway)

Suba o projeto no GitHub

Crie um Web Service no Render ou Railway

Configure:

Build Command
```
npm install
```
Start Command
```
node src/index.js
```
Variáveis de ambiente:

MONGODB_URI

JWT_SECRET

FRONTEND_URL

---

⚠️ Armazenamento de Imagens (Importante)

Atualmente, as imagens são salvas localmente em:
```
./public/photos
```
Em ambientes como Render/Railway (efêmeros), os arquivos são perdidos ao reiniciar.

👉 Recomendação para produção:

AWS S3

Firebase Storage

Atualizar o serviço de imagem para enviar o buffer diretamente para storage externo.

---

Frontend (Vercel)

Importar repositório no Vercel

Definir diretório raiz:
```
/frontend
```
Configurar variável:
```
VITE_API_URL=https://seu-backend.com/api
```
Deploy

---
