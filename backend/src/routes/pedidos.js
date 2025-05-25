const express = require("express");
const router = express.Router();
const PedidosController = require("../controllers/pedidosController");

// Rotas públicas (não precisam de autenticação)
router.post("/", PedidosController.criar);
router.get("/:id", PedidosController.buscarPorId);

// Rotas protegidas (precisam de autenticação - implementar depois)
router.get("/", PedidosController.listar);
router.patch("/:id/status", PedidosController.atualizarStatus);
router.delete("/:id", PedidosController.cancelar);
router.get("/admin/relatorio", PedidosController.relatorio);
router.get("/admin/estatisticas", PedidosController.estatisticas);

module.exports = router;
