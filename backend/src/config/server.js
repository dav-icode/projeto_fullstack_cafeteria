require("dotenv").config(); // Carrega as variáveis de ambiente do arquivo .env
const app = require("./app"); // Importa a configuração do Express

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Erro não tratado:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Exceção não capturada:", err);
  process.exit(1);
});
