const db = require("./database");

class Produtos {
  static async listarTodos() {
    try {
      const [rows] = await db.execute(`
        SELECT p.*, c.nome as categoria_nome 
        FROM produtos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.disponivel = TRUE 
        ORDER BY p.destaque DESC, p.nome ASC
      `);
      return rows;
    } catch (error) {
      throw new Error("Erro ao listar produtos: " + error.message);
    }
  }

  static async buscarPorId(id) {
    try {
      const [rows] = await db.execute(
        `
        SELECT p.*, c.nome as categoria_nome 
        FROM produtos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.id = ?
      `,
        [id]
      );
      return rows[0];
    } catch (error) {
      throw new Error("Erro ao buscar produto: " + error.message);
    }
  }

  static async buscarPorNome(termo) {
    try {
      const [rows] = await db.execute(
        `
        SELECT p.*, c.nome as categoria_nome 
        FROM produtos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.disponivel = TRUE AND (p.nome LIKE ? OR p.descricao LIKE ?)
        ORDER BY p.destaque DESC, p.nome ASC
      `,
        [`%${termo}%`, `%${termo}%`]
      );
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar por nome: " + error.message);
    }
  }

  static async buscarPorCategoria(categoriaNome) {
    try {
      const [rows] = await db.execute(
        `
        SELECT p.*, c.nome as categoria_nome 
        FROM produtos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE c.nome = ? AND p.disponivel = TRUE 
        ORDER BY p.destaque DESC, p.nome ASC
      `,
        [categoriaNome]
      );
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar por categoria: " + error.message);
    }
  }

  static async criar(produto) {
    try {
      const {
        nome,
        descricao,
        preco,
        categoria_id,
        imagem,
        disponivel = true,
        destaque = false,
      } = produto;

      const [result] = await db.execute(
        `
        INSERT INTO produtos (nome, descricao, preco, categoria_id, imagem, disponivel, destaque)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [nome, descricao, preco, categoria_id, imagem, disponivel, destaque]
      );

      return await this.buscarPorId(result.insertId);
    } catch (error) {
      throw new Error("Erro ao criar produto: " + error.message);
    }
  }

  static async atualizar(id, produto) {
    try {
      const {
        nome,
        descricao,
        preco,
        categoria_id,
        imagem,
        disponivel,
        destaque,
      } = produto;

      await db.execute(
        `
        UPDATE produtos 
        SET nome = ?, descricao = ?, preco = ?, categoria_id = ?, 
            imagem = ?, disponivel = ?, destaque = ?
        WHERE id = ?
      `,
        [nome, descricao, preco, categoria_id, imagem, disponivel, destaque, id]
      );

      return await this.buscarPorId(id);
    } catch (error) {
      throw new Error("Erro ao atualizar produto: " + error.message);
    }
  }

  static async deletar(id) {
    try {
      const [result] = await db.execute("DELETE FROM produtos WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Erro ao deletar produto: " + error.message);
    }
  }

  static async buscarComFiltro(filtros) {
    try {
      let query = `
        SELECT p.*, c.nome as categoria_nome 
        FROM produtos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id 
        WHERE p.disponivel = TRUE
      `;
      const params = [];

      if (filtros.categoria) {
        query += " AND p.categoria_id = ?";
        params.push(filtros.categoria);
      }

      if (filtros.preco_min) {
        query += " AND p.preco >= ?";
        params.push(filtros.preco_min);
      }

      if (filtros.preco_max) {
        query += " AND p.preco <= ?";
        params.push(filtros.preco_max);
      }

      if (filtros.busca) {
        query += " AND (p.nome LIKE ? OR p.descricao LIKE ?)";
        params.push(`%${filtros.busca}%`, `%${filtros.busca}%`);
      }

      if (filtros.destaque) {
        query += " AND p.destaque = TRUE";
      }

      query += " ORDER BY p.destaque DESC, p.nome ASC";

      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error("Erro ao buscar produtos com filtro: " + error.message);
    }
  }

  static async listarCategorias() {
    try {
      const [rows] = await db.execute(`
        SELECT * FROM categorias 
        WHERE ativo = TRUE 
        ORDER BY nome ASC
      `);
      return rows;
    } catch (error) {
      throw new Error("Erro ao listar categorias: " + error.message);
    }
  }
}

module.exports = Produtos;
