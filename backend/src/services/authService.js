const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models/database");

class AuthService {
  // Gerar token JWT
  static gerarToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }

  // Verificar token JWT
  static verificarToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error("Token inválido");
    }
  }

  // Hash da senha
  static async hashSenha(senha) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(senha, salt);
  }

  // Comparar senha
  static async compararSenha(senha, hash) {
    return bcrypt.compare(senha, hash);
  }

  // Login do usuário
  static async login(email, senha) {
    try {
      // Buscar usuário no banco
      const [rows] = await db.execute(
        "SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE",
        [email]
      );

      if (rows.length === 0) {
        throw new Error("Email ou senha incorretos");
      }

      const usuario = rows[0];

      // Verificar senha
      const senhaValida = await this.compararSenha(senha, usuario.senha);
      if (!senhaValida) {
        throw new Error("Email ou senha incorretos");
      }

      // Gerar token
      const token = this.gerarToken({
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        role: usuario.role,
      });

      // Retornar dados do usuário (sem a senha)
      const { senha: _, ...dadosUsuario } = usuario;

      return {
        usuario: dadosUsuario,
        token,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Middleware de autenticação
  static async middleware(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Token de acesso requerido",
        });
      }

      const token = authHeader.split(" ")[1]; // Bearer TOKEN

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token de acesso requerido",
        });
      }

      const decoded = this.verificarToken(token);

      // Buscar usuário atual no banco
      const [rows] = await db.execute(
        "SELECT id, nome, email, role, ativo FROM usuarios WHERE id = ? AND ativo = TRUE",
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Usuário não encontrado ou inativo",
        });
      }

      req.usuario = rows[0];
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }
  }

  // Middleware para verificar se é admin
  static middlewareAdmin(req, res, next) {
    if (req.usuario && req.usuario.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Acesso negado. Apenas administradores.",
      });
    }
  }

  // Criar novo usuário
  static async criarUsuario(dados) {
    try {
      const { nome, email, senha, role = "funcionario" } = dados;

      // Verificar se o email já existe
      const [existente] = await db.execute(
        "SELECT id FROM usuarios WHERE email = ?",
        [email]
      );

      if (existente.length > 0) {
        throw new Error("Email já cadastrado");
      }

      // Hash da senha
      const senhaHash = await this.hashSenha(senha);

      // Inserir usuário
      const [result] = await db.execute(
        "INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)",
        [nome, email, senhaHash, role]
      );

      // Buscar usuário criado
      const [novoUsuario] = await db.execute(
        "SELECT id, nome, email, role, ativo, criado_em FROM usuarios WHERE id = ?",
        [result.insertId]
      );

      return novoUsuario[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Alterar senha
  static async alterarSenha(usuarioId, senhaAtual, novaSenha) {
    try {
      // Buscar usuário
      const [rows] = await db.execute(
        "SELECT senha FROM usuarios WHERE id = ?",
        [usuarioId]
      );

      if (rows.length === 0) {
        throw new Error("Usuário não encontrado");
      }

      // Verificar senha atual
      const senhaValida = await this.compararSenha(senhaAtual, rows[0].senha);
      if (!senhaValida) {
        throw new Error("Senha atual incorreta");
      }

      // Hash da nova senha
      const novaSenhaHash = await this.hashSenha(novaSenha);

      // Atualizar senha
      await db.execute("UPDATE usuarios SET senha = ? WHERE id = ?", [
        novaSenhaHash,
        usuarioId,
      ]);

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = AuthService;
