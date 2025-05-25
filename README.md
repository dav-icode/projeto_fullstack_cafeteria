# projeto_fullstack_cafeteria

# 🍵 Sistema Fullstack para Cafeteria

Sistema completo de gerenciamento para cafeteria com backend em Node.js/Express, frontend em React e banco de dados MySQL.

## 📋 Funcionalidades

### Para Clientes

- **Catálogo de Produtos**: Visualização de bebidas, doces, salgados e combos
- **Carrinho de Compras**: Adicionar/remover itens e calcular total
- **Pedidos Online**: Fazer pedidos com dados de contato
- **Acompanhamento**: Status do pedido em tempo real

### Para Administradores

- **Dashboard**: Resumo de vendas e pedidos
- **Gestão de Produtos**: CRUD completo de produtos
- **Gestão de Pedidos**: Acompanhar e atualizar status
- **Relatórios**: Análise de vendas e produtos mais vendidos

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** - Ambiente de execução
- **Express.js** - Framework web
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Nodemailer** - Envio de emails
- **Multer** - Upload de arquivos

### Frontend

- **React** - Biblioteca UI
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS
- **React Hook Form** - Formulários
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

### Banco de Dados

- **MySQL** - Sistema de gerenciamento
- Estrutura otimizada com índices
- Dados de exemplo inclusos

## 🚀 Como Executar

### Pré-requisitos

- Node.js (v16 ou superior)
- MySQL (v8 ou superior)
- npm ou yarn

### 1. Configuração do Banco de Dados

```bash
# Criar banco e tabelas
mysql -u root -p < mysql/schema.sql

# Inserir dados de exemplo
mysql -u root -p < mysql/seed.sql
```

### 2. Configuração do Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Executar servidor
npm run dev
```

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
echo "VITE_API_URL=http://localhost:3000/api" > .env.local

# Executar aplicação
npm run dev
```

## 📁 Estrutura do Projeto

```
projeto_fullstack_cafeteria/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── app.js              # Configuração do Express
│   │   │   └── server.js           # Servidor principal
│   │   ├── controllers/
│   │   │   ├── produtosController.js
│   │   │   └── pedidosController.js
│   │   ├── models/
│   │   │   ├── database.js         # Conexão com MySQL
│   │   │   ├── produtos.js         # Model de produtos
│   │   │   └── pedidos.js          # Model de pedidos
│   │   ├── routes/
│   │   │   ├── produtos.js         # Rotas de produtos
│   │   │   └── pedidos.js          # Rotas de pedidos
│   │   └── services/
│   │       ├── authService.js      # Autenticação JWT
│   │       └── emailService.js     # Serviço de email
│   ├── .env                        # Variáveis de ambiente
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/             # Componentes reutilizáveis
│   │   ├── pages/                  # Páginas da aplicação
│   │   ├── services/
│   │   │   └── api.js              # Configuração da API
│   │   ├── context/
│   │   │   └── CartContext.jsx     # Context do carrinho
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── mysql/
│   ├── schema.sql                  # Estrutura do banco
│   ├── seed.sql                    # Dados iniciais
│   └── queries.sql                 # Queries úteis
└── README.md
```

## 🗄️ Banco de Dados

### Principais Tabelas

- **produtos**: Catálogo de itens da cafeteria
- **pedidos**: Pedidos realizados pelos clientes
- **usuarios**: Usuários do sistema (admin/funcionários)
- **configuracoes**: Configurações gerais da cafeteria

### Relacionamentos

- Pedidos contêm itens (JSON) referenciando produtos
- Usuários têm roles (admin/funcionario)
- Configurações armazenam dados da cafeteria

## 🔧 Variáveis de Ambiente

### Backend (.env)

```
# Banco de dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=cafeteria_db

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
SMTP_FROM=Cafeteria <seu_email@gmail.com>

# Servidor
PORT=3000
NODE_ENV=development
```

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:3000/api
```

## 🔐 Autenticação

### Usuários Padrão

- **Admin**: admin@cafeteria.com / admin123
- **Funcionário**: funcionario@cafeteria.com / admin123

### Rotas Protegidas

- `/admin/*` - Requer autenticação
- Algumas rotas requerem nível admin

## 📊 API Endpoints

### Produtos

- `GET /api/produtos` - Listar produtos
- `GET /api/produtos/:id` - Buscar produto
- `POST /api/produtos` - Criar produto (admin)
- `PUT /api/produtos/:id` - Atualizar produto (admin)
- `DELETE /api/produtos/:id` - Deletar produto (admin)

### Pedidos

- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/:id` - Buscar pedido
- `POST /api/pedidos` - Criar pedido
- `PATCH /api/pedidos/:id/status` - Atualizar status
- `DELETE /api/pedidos/:id` - Cancelar pedido

## 🎨 Interface do Usuário

### Páginas Principais

- **Home**: Apresentação e produtos em destaque
- **Menu**: Catálogo completo com filtros
- **Carrinho**: Gestão do carrinho de compras
- **Contato**: Informações e formulário de contato
- **Admin**: Dashboard administrativo

### Recursos Visuais

- Design responsivo (mobile-first)
- Tema escuro/claro
- Animações suaves
- Feedback visual para ações
- Loading states

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🚀 Deploy

### Backend (Heroku/Railway)

1. Configure as variáveis de ambiente
2. Configure banco MySQL (PlanetScale/ClearDB)
3. Execute `npm run build`
4. Deploy com `git push heroku main`

### Frontend (Vercel/Netlify)

1. Configure `VITE_API_URL` para produção
2. Execute `npm run build`
3. Deploy da pasta `dist`

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📈 Melhorias Futuras

- [ ] Sistema de avaliações
- [ ] Programa de fidelidade
- [ ] Integração com WhatsApp
- [ ] Pagamento online
- [ ] Sistema de delivery
- [ ] App mobile nativo
- [ ] Análise de dados avançada
- [ ] Sistema de promoções

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para facilitar a gestão de cafeterias.

---

**🍵 Desfrute do seu café e do seu código!**
