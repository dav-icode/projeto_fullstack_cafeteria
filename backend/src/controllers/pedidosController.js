const Pedidos = require("../models/pedidos");

class PedidosController {
  // Listar todos os pedidos
  static async listar(req, res) {
    try {
      const { status, limite = 50, pagina = 1 } = req.query;

      const filtros = {};
      if (status) filtros.status = status;

      const pedidos = await Pedidos.listarTodos(filtros, limite, pagina);

      res.json({
        success: true,
        data: pedidos,
        message: "Pedidos listados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar pedido por ID
  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const pedido = await Pedidos.buscarPorId(id);

      if (!pedido) {
        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado",
        });
      }

      res.json({
        success: true,
        data: pedido,
        message: "Pedido encontrado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Criar novo pedido
  static async criar(req, res) {
    try {
      const {
        cliente_nome,
        cliente_email,
        cliente_telefone,
        itens,
        observacoes,
      } = req.body;

      // Validações básicas
      if (
        !cliente_nome ||
        !cliente_telefone ||
        !itens ||
        !Array.isArray(itens) ||
        itens.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Dados obrigatórios: nome, telefone e itens do pedido",
        });
      }

      // Calcular total do pedido
      let total = 0;
      for (const item of itens) {
        if (!item.preco || !item.quantidade) {
          return res.status(400).json({
            success: false,
            message: "Cada item deve ter preço e quantidade válidos",
          });
        }
        total += parseFloat(item.preco) * parseInt(item.quantidade);
      }

      const dadosPedido = {
        cliente_nome,
        cliente_email: cliente_email || null,
        cliente_telefone,
        itens: JSON.stringify(itens),
        total: total.toFixed(2),
        observacoes: observacoes || null,
      };

      const pedido = await Pedidos.criar(dadosPedido);

      res.status(201).json({
        success: true,
        data: pedido,
        message: "Pedido criado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Atualizar status do pedido
  static async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const statusValidos = [
        "pendente",
        "preparando",
        "pronto",
        "entregue",
        "cancelado",
      ];

      if (!status || !statusValidos.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status inválido. Use: " + statusValidos.join(", "),
        });
      }

      const pedidoAtualizado = await Pedidos.atualizarStatus(id, status);

      if (!pedidoAtualizado) {
        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado",
        });
      }

      res.json({
        success: true,
        data: pedidoAtualizado,
        message: `Status do pedido atualizado para: ${status}`,
      });
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Cancelar pedido
  static async cancelar(req, res) {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      const pedidoCancelado = await Pedidos.cancelar(id, motivo);

      if (!pedidoCancelado) {
        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado ou não pode ser cancelado",
        });
      }

      res.json({
        success: true,
        data: pedidoCancelado,
        message: "Pedido cancelado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Relatório de pedidos
  static async relatorio(req, res) {
    try {
      const { data_inicio, data_fim } = req.query;

      const relatorio = await Pedidos.relatorio(data_inicio, data_fim);

      res.json({
        success: true,
        data: relatorio,
        message: "Relatório gerado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Estatísticas do dashboard
  static async estatisticas(req, res) {
    try {
      const stats = await Pedidos.estatisticas();

      res.json({
        success: true,
        data: stats,
        message: "Estatísticas obtidas com sucesso",
      });
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = PedidosController;
