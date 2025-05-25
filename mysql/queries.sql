-- Queries úteis para a cafeteria

-- 1. Buscar todos os produtos ativos por categoria
SELECT * FROM produtos 
WHERE ativo = true 
ORDER BY categoria, nome;

-- 2. Produtos mais vendidos (análise dos itens nos pedidos)
SELECT 
    JSON_UNQUOTE(JSON_EXTRACT(item.value, '$.nome')) AS nome, 
    SUM(JSON_UNQUOTE(JSON_EXTRACT(item.value, '$.quantidade'))) AS total_vendido 
FROM pedidos 
JOIN JSON_TABLE(items, '$[*]' COLUMNS (item JSON PATH '$')) AS item 
WHERE status != 'cancelado' 
GROUP BY nome 
ORDER BY total_vendido DESC;