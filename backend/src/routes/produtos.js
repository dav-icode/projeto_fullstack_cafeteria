const express = require("express");
const ProdutosController = require("../controllers/produtosController"); // Certifique-se de que o arquivo é produtosController.js
const router = express.Router();

// Listar todos os produtos disponíveis
router.get("/", ProdutosController.index);

// Listar todas as categorias ativas
router.get("/categorias", ProdutosController.getCategories);

// Buscar produtos com filtros (categoria, preço, busca, destaque)
router.get("/pesquisar", ProdutosController.search);

// Listar produtos por categoria específica
router.get("/categoria/:categoria", ProdutosController.getByCategory);

// Buscar produto por ID
router.get("/:id", ProdutosController.show);

// Criar novo produto
router.post("/", ProdutosController.store);

// Atualizar produto existente
router.put("/:id", ProdutosController.update);

// Deletar produto por ID
router.delete("/:id", ProdutosController.destroy);

// Rota não encontrada (404)
router.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota de produtos '${req.originalUrl}' não encontrada.`,
  });
});

module.exports = router;
