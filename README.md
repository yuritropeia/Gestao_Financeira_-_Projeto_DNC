# Gestão Financeira - Fullstack

## Sobre o Projeto
Este projeto consiste no desenvolvimento fullstack de uma aplicação de gestão financeira. A aplicação possui um back-end desenvolvido com Node.js e um front-end utilizando React e Next.js. O projeto está estruturado em duas pastas principais:
- **Backend**: Contém toda a lógica de negócios, autenticação e conexão com banco de dados.
- **Frontend**: Interface do usuário para interação com a aplicação.

## Tecnologias Utilizadas
O projeto utiliza diversas bibliotecas e frameworks para garantir robustez e segurança:
- **Backend**:
  - Node.js: Plataforma para execução do JavaScript no lado do servidor.
  - Express: Framework minimalista para Node.js, utilizado para construir a API.
  - Knex: Query builder para interagir com o banco de dados de forma estruturada (ORM para banco de dados SQL).
  - MySQL2: Banco de dados relacional utilizado para armazenar informações.
  - JWT (jsonwebtoken): Autenticação baseada em tokens.
  - Bcrypt: Biblioteca para hashing de senhas.
  - Docker: Utilizado para containerização da aplicação.
  - Dotenv: Gerenciamento de variáveis de ambiente.
  - CORS: Permite que o frontend acesse a API backend.
  - Nodemon: Reinicializa automaticamente o servidor durante o desenvolvimento.
  - Express Bearer Token: Middleware para validar tokens JWT.
  
- **Frontend**:
  - React: Biblioteca para construção de interfaces interativas.
  - Next.js: Framework para React que facilita a renderização no servidor.
  - Material UI (@mui): Biblioteca de componentes estilizados para React.
  - Emotion: Biblioteca para estilização utilizando CSS-in-JS.
  - Axios: Cliente HTTP para realizar chamadas à API.
  - Zod: Biblioteca para validação de schemas de dados.
  
## Estrutura do Projeto

### Backend
- `migrations/` - Arquivos de migração do banco de dados.
- `docker-compose.yml` - Arquivo para configuração e execução do container.
- `knexfile.js` - Configuração do Knex.js.
- `src/`
  - `config/database.js` - Configuração de conexão com o banco de dados.
  - `middleware/authMiddleware.js` - Middleware para verificação de token JWT.
  - `modules/`
    - `auth/` - Autenticação de usuários.
    - `user/` - Gerenciamento de usuários.
  - `services/knex.js` - Configuração do Knex.
  - `server.js` - Arquivo principal do servidor Express.

## Estrutura do Projeto

### Backend (`/backend`)
A estrutura do backend segue um padrão modular organizado da seguinte forma:

```
/backend
│── docker-compose.yml
│── knexfile.js
│── package.json
│── src
│   ├── config
│   │   ├── database.js  # Configuração do banco de dados
│   ├── modules
│   │   ├── auth         # Módulo de autenticação (login/registro)
│   │   ├── user         # Módulo de usuários
│   ├── services
│   │   ├── knex.js      # Configuração de conexão do Knex
│   ├── middleware
│   │   ├── authMiddleware.js  # Middleware para rotas protegidas
│   ├── server.js       # Configuração principal do servidor
│── migrations          # Migrations do banco de dados
```


#### `server.js`
Configuração do servidor Express, definindo rotas para autenticação e usuários:
```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
import userRouter from './modules/user/user.route.js'
import authRouter from './modules/auth/auth.route.js'

const app = express();
app.use(express.json());
app.use(cors());

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.get('/health', (_, res) => {
    return res.send('Sistema está operacional!');
});

app.listen(8080, async () => {
    console.log('Servidor rodando na porta 8080.');
});
```

#### `database.js`
Configuração da conexão com MySQL utilizando `knex`:
```javascript
const knexConfig = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: 3306,
        user: process.env.DB_USER || 'user',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'db'
    },
};

export default knexConfig;
```
### Rotas Protegidas
No backend, as rotas protegidas exigem um token JWT válido para serem acessadas. O middleware `authMiddleware.js` é utilizado para garantir que apenas usuários autenticados possam acessar certas funcionalidades.

#### `authMiddleware.js`
Este middleware é responsável por proteger rotas que exigem autenticação, verificando o token JWT do usuário:
```javascript
import jwt from 'jsonwebtoken';
import { get } from '../modules/user/index.js'

export const authMiddleware = async (req, res, next) => {
    try {
        const isValid = jwt.verify(req.token, process.env.JWT_SECRET);
        const user = await get(isValid.id)
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido.' })
    }
};

export default authMiddleware;
```

Exemplo de requisição para rota protegida:
```javascript
axios.get('http://localhost:8080/users/me', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
}).then(response => {
    console.log(response.data.data);
}).catch(error => {
    console.error('Acesso negado:', error);
});
```
### Frontend (`/frontend`)
A estrutura do frontend segue um padrão organizado para componentes reutilizáveis:

```
/frontend
│── package.json
│── src
│   ├── app
│   │   ├── auth
│   │   ├── guest
│   │       ├── login
│   │       │   ├── page.js   # Página de login
│   │       │   ├── style.jsx # Estilização da página de login
│   │       ├── register
│   ├── components
│   │   ├── LoginForm
│   │   │   ├── index.jsx     # Componente do formulário de login
│   │   │   ├── style.jsx     # Estilização do formulário
│   │   ├── RegisterForm
```

#### `LoginForm/index.jsx`
Este é o componente responsável pelo login do usuário:
```javascript
'use client'

import * as S from './style.jsx'
import axios from 'axios'
import { useState } from 'react'

export const LoginForm = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: ''
    });

    const onChangeValue = (e) => {
        const { name, value } = e.target
        if (name === 'email') setEmail(value)
        if (name === 'password') setPassword(value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://localhost:8080/auth/login', { email, password })
            localStorage.setItem('token', response.data.data.token)
            setNotification({
                open: true,
                message: `Usuário ${email} autenticado com sucesso!`,
                severity: 'success'
            })
        } catch (error) {
            setNotification({
                open: true,
                message: error.response.data.error,
                severity: 'error'
            })
        }
    };

    return (
        <>
            <S.Form onSubmit={onSubmit}>
                <S.H1>Login</S.H1>
                <S.TextField onChange={onChangeValue} name="email" label="E-mail" variant="outlined" fullWidth/>
                <S.TextField onChange={onChangeValue} name="password" type="password" label="Password" variant="outlined" fullWidth/>
                <S.Button variant="contained" type="submit">Enviar</S.Button>
            </S.Form>
        </>
    )
}

export default LoginForm;
```

## Como Rodar o Projeto
### Backend
1. Clone o repositório
   ```sh
   git clone https://github.com/seu-usuario/finance-app.git
   cd finance-app/backend
   ```
2. Instale as dependências
   ```sh
   npm install
   ```
3. Configure o `.env` com suas credenciais do banco de dados.
4. Rode as migrações
   ```sh
   npx knex migrate:latest
   ```
5. Inicie o servidor
   ```sh
   npm start
   ```

### Frontend
1. Navegue até a pasta do frontend
   ```sh
   cd ../frontend
   ```
2. Instale as dependências
   ```sh
   npm install
   ```
3. Inicie o frontend
   ```sh
   npm run dev
   ```
