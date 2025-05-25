// Model do Pedido - Responsável por todas as operações com pedidos no banco
const { executeQuery, executeTransaction } = require("./database");

class Pedido {
  // Busca todos os pedidos com seus itens
  static async findAll() {
    const query = `
            SELECT 
                p.id,
                p.cliente_nome,
                p.cliente_telefone,
                p.total,
                p.status,
                p.observacoes,
                p.created_at,
                p.updated_at
            FROM pedidos p 
            ORDER BY p.created_at DESC
        `;

    const pedidos = await executeQuery(query);

    // Para cada pedido, busca os itens
    for (let pedido of pedidos) {
      pedido.itens = await this.getItensPedido(pedido.id);
    }

    return pedidos;
  }

  // Busca pedido por ID com seus itens
  static async findById(id) {
    const query = `
            SELECT 
                p.id,
                p.cliente_nome,
                p.cliente_telefone,
                p.total,
                p.status,
                p.observacoes,
                p.created_at,
                p.updated_at
            FROM pedidos p 
            WHERE p.id = ?
        `;

    const results = await executeQuery(query, [id]);
    const pedido = results[0];

    if (!pedido) {
      return null;
    }

    // Busca os itens do pedido
    pedido.itens = await this.getItensPedido(id);

    return pedido;
  }

  // Busca os itens de um pedido específico
  static async getItensPedido(pedidoId) {
    const query = `
            SELECT 
                ip.id,
                ip.produto_id,
                ip.quantidade,
                ip.preco_unitario,
                ip.subtotal,
                pr.nome as produto_nome,
                pr.categoria as produto_categoria
            FROM itens_pedido ip
            INNER JOIN produtos pr ON ip.produto_id = pr.id
            WHERE ip.pedido_id = ?
            ORDER BY pr.nome
        `;

    return await executeQuery(query, [pedidoId]);
  }

  // Cria um novo pedido com seus itens
  static async create(dadosPedido) {
    const { cliente_nome, cliente_telefone, itens, observacoes } = dadosPedido;

    // Calcula o total do pedido
    let total = 0;
    for (let item of itens) {
      total += item.quantidade * item.preco_unitario;
    }

    // Prepara as queries para transação
    const queries = [];

    // 1. Insere o pedido
    queries.push({
      query: `
                INSERT INTO pedidos (cliente_nome, cliente_telefone, total, status, observacoes) 
                VALUES (?, ?, ?, 'pendente', ?)
            `,
      params: [cliente_nome, cliente_telefone, total, observacoes || null],
    });

    // Executa a transação para obter o ID do pedido
    const [resultPedido] = await executeTransaction(queries);
    const pedidoId = resultPedido.insertId;

    // 2. Insere os itens do pedido
    const queriesItens = [];
    for (let item of itens) {
      const subtotal = item.quantidade * item.preco_unitario;
      queriesItens.push({
        query: `
                    INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, subtotal) 
                    VALUES (?, ?, ?, ?, ?)
                `,
        params: [
          pedidoId,
          item.produto_id,
          item.quantidade,
          item.preco_unitario,
          subtotal,
        ],
      });
    }

    // Executa os itens em uma transação separada
    await executeTransaction(queriesItens);

    // Retorna o pedido criado
    return await this.findById(pedidoId);
  }

  // Atualiza o status de um pedido
  static async updateStatus(id, novoStatus) {
    const statusValidos = [
      "pendente",
      "preparando",
      "pronto",
      "entregue",
      "cancelado",
    ];

    if (!statusValidos.includes(novoStatus)) {
      throw new Error("Status inválido");
    }

    const query = `
            UPDATE pedidos 
            SET status = ?, updated_at = NOW()
            WHERE id = ?
        `;

    const result = await executeQuery(query, [novoStatus, id]);

    if (result.affectedRows === 0) {
      throw new Error("Pedido não encontrado");
    }

    // Retorna o pedido atualizado
    return await this.findById(id);
  }

  // Busca pedidos por status
  static async findByStatus(status) {
    const query = `
            SELECT 
                p.id,
                p.cliente_nome,
                p.cliente_telefone,
                p.total,
                p.status,
                p.observacoes,
                p.created_at,
                p.updated_at
            FROM pedidos p 
            WHERE p.status = ?
            ORDER BY p.created_at DESC
        `;

    const pedidos = await executeQuery(query, [status]);

    // Para cada pedido, busca os itens
    for (let pedido of pedidos) {
      pedido.itens = await this.getItensPedido(pedido.id);
    }

    return pedidos;
  }

  // Busca pedidos por período
  static async findByPeriod(dataInicio, dataFim) {
    const query = `
            SELECT 
                p.id,
                p.cliente_nome,
                p.cliente_telefone,
                p.total,
                p.status,
                p.observacoes,
                p.created_at,
                p.updated_at
            FROM pedidos p 
            WHERE DATE(p.created_at) BETWEEN ? AND ?
            ORDER BY p.created_at DESC
        `;

    const pedidos = await executeQuery(query, [dataInicio, dataFim]);

    // Para cada pedido, busca os itens
    for (let pedido of pedidos) {
      pedido.itens = await this.getItensPedido(pedido.id);
    }

    return pedidos;
  }

  // Estatísticas dos pedidos
  static async getStatistics() {
    const queries = [
      // Total de pedidos por status
      `SELECT status, COUNT(*) as quantidade FROM pedidos GROUP BY status`,

      // Faturamento total
      `SELECT SUM(total) as faturamento_total FROM pedidos WHERE status != 'cancelado'`,

      // Pedidos de hoje
      `SELECT COUNT(*) as pedidos_hoje FROM pedidos WHERE DATE(created_at) = CURDATE()`,

      // Produto mais vendido
      `SELECT 
                pr.nome, 
                SUM(ip.quantidade) as total_vendido 
             FROM itens_pedido ip
             INNER JOIN produtos pr ON ip.produto_id = pr.id
             INNER JOIN pedidos p ON ip.pedido_id = p.id
             WHERE p.status != 'cancelado'
             GROUP BY pr.id, pr.nome
             ORDER BY total_vendido DESC
             LIMIT 1`,
    ];

    const [statusStats, faturamento, pedidosHoje, produtoTop] =
      await Promise.all(queries.map((query) => executeQuery(query)));

    return {
      status: statusStats,
      faturamento_total: faturamento[0]?.faturamento_total || 0,
      pedidos_hoje: pedidosHoje[0]?.pedidos_hoje || 0,
      produto_mais_vendido: produtoTop[0] || null,
    };
  }

  // Valida os dados do pedido antes de salvar
  static validate(dadosPedido) {
    const erros = [];

    if (
      !dadosPedido.cliente_nome ||
      dadosPedido.cliente_nome.trim().length < 2
    ) {
      erros.push("Nome do cliente deve ter pelo menos 2 caracteres");
    }

    if (
      !dadosPedido.cliente_telefone ||
      dadosPedido.cliente_telefone.trim().length < 10
    ) {
      erros.push("Telefone deve ter pelo menos 10 dígitos");
    }

    if (!dadosPedido.itens || dadosPedido.itens.length === 0) {
      erros.push("Pedido deve ter pelo menos 1 item");
    }

    // Valida cada item
    if (dadosPedido.itens) {
      dadosPedido.itens.forEach((item, index) => {
        if (!item.produto_id || item.produto_id <= 0) {
          erros.push(`Item ${index + 1}: ID do produto é obrigatório`);
        }

        if (!item.quantidade || item.quantidade <= 0) {
          erros.push(`Item ${index + 1}: Quantidade deve ser maior que zero`);
        }

        if (!item.preco_unitario || item.preco_unitario <= 0) {
          erros.push(
            `Item ${index + 1}: Preço unitário deve ser maior que zero`
          );
        }
      });
    }

    return erros;
  }
}

module.exports = Pedido;
