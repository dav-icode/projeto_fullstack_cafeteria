USE cafeteria_db;

-- Inserir usuários padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha, role) VALUES
('Administrador', 'admin@cafeteria.com', '$2a$10$jNK7bUwkOBgDf.fOnhYrH.kU1y0rTGXVzjzxVX7kUz8xUj3K5N3Hm', 'admin'),
('Funcionário', 'funcionario@cafeteria.com', '$2a$10$jNK7bUwkOBgDf.fOnhYrH.kU1y0rTGXVzjzxVX7kUz8xUj3K5N3Hm', 'funcionario');

-- Inserir categorias
INSERT INTO categorias (nome, descricao) VALUES
('Bebidas Quentes', 'Cafés, chás e outras bebidas quentes'),
('Bebidas Geladas', 'Sucos, refrigerantes e bebidas geladas'),
('Doces', 'Bolos, tortas, cookies e sobremesas'),
('Salgados', 'Pães, sanduíches e salgados em geral'),
('Combos', 'Combinações especiais com desconto');

-- Inserir produtos
INSERT INTO produtos (nome, descricao, preco, categoria_id, disponivel, destaque) VALUES
-- Bebidas Quentes
('Café Expresso', 'Café expresso tradicional, forte e encorpado', 4.50, 1, TRUE, TRUE),
('Cappuccino', 'Café expresso com leite vaporizado e canela', 7.50, 1, TRUE, TRUE),
('Latte', 'Café expresso com bastante leite vaporizado', 8.00, 1, TRUE, FALSE),
('Mocha', 'Café expresso com chocolate e chantilly', 9.50, 1, TRUE, TRUE),
('Chá Verde', 'Chá verde natural com propriedades antioxidantes', 5.00, 1, TRUE, FALSE),
('Chocolate Quente', 'Chocolate cremoso com marshmallow', 8.50, 1, TRUE, TRUE),

-- Bebidas Geladas
('Café Gelado', 'Café expresso gelado com gelo', 6.00, 2, TRUE, FALSE),
('Frappuccino', 'Café batido com gelo e chantilly', 12.00, 2, TRUE, TRUE),
('Suco de Laranja', 'Suco natural de laranja', 7.00, 2, TRUE, FALSE),
('Limonada', 'Limonada refrescante com hortelã', 6.50, 2, TRUE, FALSE),
('Smoothie de Frutas', 'Vitamina cremosa com frutas da estação', 10.00, 2, TRUE, TRUE),

-- Doces
('Bolo de Chocolate', 'Fatia de bolo de chocolate com cobertura', 8.00, 3, TRUE, TRUE),
('Cheesecake', 'Fatia de cheesecake com calda de frutas vermelhas', 12.00, 3, TRUE, TRUE),
('Cookie de Chocolate', 'Cookie artesanal com gotas de chocolate', 4.50, 3, TRUE, FALSE),
('Brownie', 'Brownie de chocolate com nozes', 7.50, 3, TRUE, FALSE),
('Torta de Limão', 'Fatia de torta de limão com merengue', 9.00, 3, TRUE, FALSE),

-- Salgados
('Croissant Simples', 'Croissant francês tradicional', 6.00, 4, TRUE, FALSE),
('Sanduíche Natural', 'Pão integral com peito de peru e salada', 12.00, 4, TRUE, TRUE),
('Pão de Açúcar', 'Pão doce tradicional brasileiro', 4.00, 4, TRUE, FALSE),
('Quiche Lorraine', 'Quiche tradicional com bacon e queijo', 15.00, 4, TRUE, TRUE),
('Wrap de Frango', 'Wrap com frango grelhado e vegetais', 14.00, 4, TRUE, FALSE),

-- Combos
('Combo Café da Manhã', 'Café + Croissant + Suco', 18.00, 5, TRUE, TRUE),
('Combo Lanche', 'Sanduíche + Bebida + Cookie', 22.00, 5, TRUE, TRUE),
('Combo Sobremesa', 'Bolo + Café + Sorvete', 20.00, 5, TRUE, FALSE);

-- Inserir configurações
INSERT INTO configuracoes (chave, valor, descricao) VALUES
('nome_cafeteria', 'Café & Cia', 'Nome da cafeteria'),
('endereco', 'Rua das Flores, 123 - Centro', 'Endereço da cafeteria'),
('telefone', '(11) 9999-9999', 'Telefone de contato'),
('email', 'contato@cafeecia.com', 'Email de contato'),
('horario_funcionamento', 'Segunda a Sexta: 7h às 19h | Sábado: 8h às 17h', 'Horário de funcionamento'),
('tempo_preparo_medio', '15', 'Tempo médio de preparo em minutos'),
('taxa_entrega', '5.00', 'Taxa de entrega em reais'),
('pedido_minimo', '20.00', 'Valor mínimo do pedido');

-- Inserir alguns pedidos de exemplo
INSERT INTO pedidos (cliente_nome, cliente_email, cliente_telefone, itens, total, status, observacoes) VALUES
('João Silva', 'joao@email.com', '(11) 99999-1111', 
'[{"id":1,"nome":"Café Expresso","preco":4.50,"quantidade":2},{"id":12,"nome":"Bolo de Chocolate","preco":8.00,"quantidade":1}]', 
17.00, 'entregue', 'Sem açúcar no café'),

('Maria Santos', 'maria@email.com', '(11) 99999-2222',
'[{"id":8,"nome":"Frappuccino","preco":12.00,"quantidade":1},{"id":14,"nome":"Cookie de Chocolate","preco":4.50,"quantidade":2}]',
21.00, 'pronto', 'Extra chantilly'),

('Pedro Costa', 'pedro@email.com', '(11) 99999-3333',
'[{"id":21,"nome":"Combo Café da Manhã","preco":18.00,"quantidade":1}]',
18.00, 'preparando', 'Para viagem');