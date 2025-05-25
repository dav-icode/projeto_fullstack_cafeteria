const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Enviar confirmação de pedido
  async enviarConfirmacaoPedido(dadosEmail) {
    const { email, nome, numeroPedido, items, total } = dadosEmail;

    const itemsHtml = items
      .map(
        (item) =>
          `<li>${item.nome} - Qtd: ${item.quantidade} - R$ ${item.preco.toFixed(
            2
          )}</li>`
      )
      .join("");

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Confirmação do Pedido #${numeroPedido} - Cafeteria`,
      html: `
        <h2>Pedido Confirmado!</h2>
        <p>Olá ${nome},</p>
        <p>Seu pedido #${numeroPedido} foi confirmado com sucesso!</p>
        
        <h3>Itens do Pedido:</h3>
        <ul>
          ${itemsHtml}
        </ul>
        
        <h3>Total: R$ ${total.toFixed(2)}</h3>
        
        <p>Entraremos em contato em breve para confirmar a entrega.</p>
        
        <p>Obrigado por escolher nossa cafeteria!</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de confirmação enviado para: ${email}`);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      throw new Error("Falha ao enviar email de confirmação");
    }
  }

  // Enviar notificação de mudança de status
  async enviarNotificacaoStatus(dadosEmail) {
    const { email, nome, numeroPedido, status } = dadosEmail;

    const statusMessages = {
      preparando: "Seu pedido está sendo preparado com carinho!",
      pronto: "Seu pedido está pronto para retirada/entrega!",
      entregue: "Seu pedido foi entregue com sucesso!",
      cancelado: "Seu pedido foi cancelado.",
    };

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Atualização do Pedido #${numeroPedido} - Cafeteria`,
      html: `
        <h2>Atualização do Pedido</h2>
        <p>Olá ${nome},</p>
        <p>${statusMessages[status]}</p>
        <p>Pedido: #${numeroPedido}</p>
        <p>Status atual: <strong>${status.toUpperCase()}</strong></p>
        
        <p>Obrigado por escolher nossa cafeteria!</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email de atualização enviado para: ${email}`);
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      throw new Error("Falha ao enviar email de atualização");
    }
  }

  // Teste de conexão
  async testarConexao() {
    try {
      await this.transporter.verify();
      console.log("Conexão com servidor de email estabelecida");
      return true;
    } catch (error) {
      console.error("Erro na conexão com servidor de email:", error);
      return false;
    }
  }
}

module.exports = new EmailService();
