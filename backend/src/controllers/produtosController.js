const Produtos = require("../models/produtos");

// Listar todos os produtos
exports.index = async (req, res) => {
  try {
    const produtos = await Produtos.listarTodos();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar um produto por ID
exports.show = async (req, res) => {
  try {
    const produto = await Produtos.buscarPorId(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar todas as categorias
exports.getCategories = async (req, res) => {
  try {
    const categorias = await Produtos.listarCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar produtos com base em filtros (ex: ?q=nome&preco_min=10&preco_max=50)
exports.search = async (req, res) => {
  try {
    const filtros = {
      busca: req.query.q || "",
      preco_min: req.query.preco_min || null,
      preco_max: req.query.preco_max || null,
      categoria: req.query.categoria || null,
      destaque: req.query.destaque === "true" ? true : null,
    };

    const resultados = await Produtos.buscarComFiltro(filtros);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar produtos por categoria (usando o ID da categoria)
exports.getByCategory = async (req, res) => {
  try {
    const categoriaId = req.params.categoria;
    const produtos = await Produtos.listarPorCategoria(categoriaId);
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar novo produto
exports.store = async (req, res) => {
  try {
    const novoProduto = req.body;
    const criado = await Produtos.criar(novoProduto);
    res.status(201).json(criado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um produto
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const atualizacao = req.body;
    const atualizado = await Produtos.atualizar(id, atualizacao);
    res.json(atualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar um produto
exports.destroy = async (req, res) => {
  try {
    const id = req.params.id;
    await Produtos.deletar(id);
    res.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
