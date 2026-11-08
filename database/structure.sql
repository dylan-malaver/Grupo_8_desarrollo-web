-- =========================================================
-- Floristería Andrea - Estructura de la base de datos
-- Ejecutar primero este archivo y luego data.sql
-- =========================================================
DROP DATABASE IF EXISTS floristeria_andrea;

CREATE DATABASE floristeria_andrea
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE floristeria_andrea;

-- ---------------------------------------------------------
-- Categorías de usuario (admin, cliente)
-- ---------------------------------------------------------
CREATE TABLE user_categories (
    id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(30)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_categories_name (name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Usuarios
-- ---------------------------------------------------------
CREATE TABLE users (
    id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
    first_name       VARCHAR(60)  NOT NULL,
    last_name        VARCHAR(60)  NOT NULL DEFAULT '',
    email            VARCHAR(120) NOT NULL,
    phone            VARCHAR(20)  NULL,
    password         VARCHAR(100) NOT NULL,          -- hash de bcrypt
    image            VARCHAR(255) NULL,              -- foto de perfil
    user_category_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    CONSTRAINT fk_users_user_category
        FOREIGN KEY (user_category_id) REFERENCES user_categories (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Categorías de producto (Ramos de flores, Cumpleaños, ...)
-- ---------------------------------------------------------
CREATE TABLE categories (
    id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(60)  NOT NULL,
    slug VARCHAR(80)  NOT NULL,                      -- para /productos?categoria=slug
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_name (name),
    UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Colores disponibles
-- ---------------------------------------------------------
CREATE TABLE colors (
    id     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name   VARCHAR(30)  NOT NULL,
    swatch VARCHAR(200) NOT NULL,                    -- color CSS de la muestra
    PRIMARY KEY (id),
    UNIQUE KEY uq_colors_name (name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Productos
-- ---------------------------------------------------------
CREATE TABLE products (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name        VARCHAR(60)  NOT NULL,
    summary     VARCHAR(100) NOT NULL,
    description TEXT         NOT NULL,
    details     TEXT         NULL,
    care        TEXT         NULL,
    price       INT UNSIGNED NOT NULL,               -- pesos colombianos
    image       VARCHAR(255) NOT NULL,
    alt         VARCHAR(120) NULL,
    category_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    KEY idx_products_name (name),
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories (id)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------
-- Producto <-> Color (relación muchos a muchos)
-- ---------------------------------------------------------
CREATE TABLE product_color (
    product_id INT UNSIGNED NOT NULL,
    color_id   INT UNSIGNED NOT NULL,
    PRIMARY KEY (product_id, color_id),
    CONSTRAINT fk_product_color_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_product_color_color
        FOREIGN KEY (color_id) REFERENCES colors (id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;