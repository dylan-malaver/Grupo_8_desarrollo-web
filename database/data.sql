-- =========================================================
-- Floristería Andrea - Datos de ejemplo
-- Ejecutar DESPUÉS de structure.sql
-- =========================================================
USE floristeria_andrea;

INSERT INTO user_categories (id, name) VALUES
    (1, 'admin'),
    (2, 'cliente');

-- Administrador de ejemplo. Contraseña: Andrea2026 (guardada con bcrypt)
INSERT INTO users (id, first_name, last_name, email, phone, password, image, user_category_id) VALUES
    (1, 'Administrador', '', 'admin@floristeriaandrea.com', NULL,
     '$2b$10$FH1qlASR9IbWDsaRfuHlc.uYLZeHadayUnuP.zVlqjJwlWNhmVOoi', NULL, 1);

INSERT INTO categories (id, name, slug) VALUES
    (1, 'Ramos de flores',       'ramos-de-flores'),
    (2, 'Arreglos florales',     'arreglos-florales'),
    (3, 'Detalles románticos',   'detalles-romanticos'),
    (4, 'Cumpleaños',            'cumpleanos'),
    (5, 'Aniversarios',          'aniversarios'),
    (6, 'Ocasiones especiales',  'ocasiones-especiales');

INSERT INTO colors (id, name, swatch) VALUES
    (1, 'Rojo',       '#c62828'),
    (2, 'Rosado',     '#f48fb1'),
    (3, 'Blanco',     '#ffffff'),
    (4, 'Amarillo',   '#fdd835'),
    (5, 'Naranja',    '#fb8c00'),
    (6, 'Morado',     '#8e24aa'),
    (7, 'Multicolor', 'conic-gradient(#e53935, #fdd835, #43a047, #1e88e5, #8e24aa, #e53935)');

INSERT INTO products (id, name, summary, description, details, care, price, image, alt, category_id) VALUES
    (1, 'Ramo de Rosas Rojas',
     'Clásico ramo de rosas rojas seleccionadas con follaje fino.',
     'Un elegante ramo de rosas pensado para expresar cariño, amor y celebrar momentos especiales.',
     'Ramo de rosas rojas seleccionadas con follaje fino y envoltorio de regalo con lazo. Disponible para pedido y entrega a domicilio en San Gil.',
     'Colócalo en un florero con agua limpia, corta un poco los tallos en diagonal y cambia el agua cada dos días. Mantenlo lejos del sol directo.',
     85000, 'prod-rosas-rojas.jpg', 'Ramo de rosas rojas con lazo', 1),

    (2, 'Arreglo Floral Elegante',
     'Composición mixta con lirios, rosas y flores de temporada.',
     'Una composición mixta con lirios, rosas y flores de temporada, armada en una base especial para destacar en cualquier lugar.',
     'Arreglo con lirios, rosas y flores de temporada en una base especial. Disponible para pedido y entrega a domicilio en San Gil.',
     'Mantén el agua o la espuma floral siempre húmeda y ubica el arreglo lejos del sol directo y de corrientes de aire.',
     120000, 'prod-arreglo-elegante.jpg', 'Arreglo floral elegante', 2),

    (3, 'Ramo de Flores Mixtas',
     'Combinación silvestre multicolor para alegrar cualquier día.',
     'Una combinación silvestre y multicolor de flores, ideal para alegrar cualquier día y sorprender a alguien especial.',
     'Ramo de flores mixtas en colores vivos, con estilo silvestre. Disponible para pedido y entrega a domicilio en San Gil.',
     'Colócalo en un florero con agua limpia, corta un poco los tallos en diagonal y cambia el agua cada dos días. Mantenlo lejos del sol directo.',
     65000, 'prod-flores-mixtas.jpg', 'Ramo de flores mixtas', 1),

    (4, 'Detalle Floral Romántico',
     'Caja de flores en tonos pastel con tarjeta personalizada.',
     'Una caja de flores en tonos pastel con tarjeta personalizada, la combinación ideal para enamorar y crear instantes mágicos.',
     'Caja de flores en tonos pastel con tarjeta personalizada. Disponible para pedido y entrega a domicilio en San Gil.',
     'Mantén la espuma floral húmeda y ubica la caja lejos del sol directo y de corrientes de aire.',
     95000, 'prod-detalle-romantico.jpg', 'Detalle floral romántico en tonos pastel', 3),

    (5, 'Arreglo cumpleaños',
     'Colores vivos y flores frescas para celebrar un cumpleaños con alegría.',
     'Colores vivos y flores frescas para desear el mejor de los cumpleaños con alegría.',
     'Arreglo de colores vivos con flores frescas para cumpleaños. Disponible para pedido y entrega a domicilio en San Gil.',
     'Mantén el agua o la espuma floral siempre húmeda y ubica el arreglo lejos del sol directo.',
     70000, 'cat-cumpleanos.jpg', 'Globos de colores para cumpleaños', 4);

INSERT INTO product_color (product_id, color_id) VALUES
    (1, 1), (1, 3),
    (2, 2), (2, 3),
    (3, 7), (3, 4), (3, 2),
    (4, 2),
    (5, 7);