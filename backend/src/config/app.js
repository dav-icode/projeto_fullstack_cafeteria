// Configuração principal do Express - Aqui definimos middlewares e rotas
const express = require("express");
const cors = require("cors");

// Importação das rotas (vamos criar depois)
const produtosRoutes = require("../routes/produtos");
const pedidosRoutes = require("../routes/pedidos");

// Cria a aplicação Express
const app = express();

// MIDDLEWARES - Funções que executam antes das rotas

// 1. CORS - Permite requisições do frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // URL do React
    credentials: true, // Permite cookies e headers de autenticação
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
  })
);

// 2. Parser JSON - Converte o body das requisições para JSON
app.use(express.json({ limit: "10mb" })); // Limite de 10MB por segurança

// 3. Parser URL - Para formulários tradicionais (se necessário)
app.use(express.urlencoded({ extended: true }));

// 4. Log das requisições - Ajuda no desenvolvimento
app.use((req, res, next) => {
  console.log(
    `📡 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`
  );
  next(); // Passa para o próximo middleware
});

// ROTAS DA API

// Rota de teste - Para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.json({
    message: "☕ API da Cafeteria funcionando!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Rota de saúde - Para monitoramento
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Rotas da aplicação
app.use("/api/produtos", produtosRoutes); // Todas as rotas de produtos
app.use("/api/pedidos", pedidosRoutes); // Todas as rotas de pedidos

// MIDDLEWARE DE ERRO - Captura erros não tratados
app.use((err, req, res, next) => {
  console.error("❌ Erro na aplicação:", err);

  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Erro interno do servidor",
    // Em produção, não mostramos o stack trace por segurança
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// MIDDLEWARE 404 - Rota não encontrada
app.use("*", (req, res) => {
  res.status(404).json({
    error: true,
    message: `Rota ${req.originalUrl} não encontrada`,
  });
});

module.exports = app;
