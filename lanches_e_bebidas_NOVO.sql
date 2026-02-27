SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS `lanches_e_bebidas`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `lanches_e_bebidas`;

DROP TABLE IF EXISTS `carrinho`;
CREATE TABLE `carrinho` (
  `id`        INT(11)        NOT NULL AUTO_INCREMENT,
  `nome`      VARCHAR(200)   NOT NULL,
  `descricao` VARCHAR(200)   NOT NULL DEFAULT '',
  `preco`     DECIMAL(10,2)  NOT NULL,
  `criado_em` TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `contatos`;
CREATE TABLE `contatos` (
  `id`         INT(11)      NOT NULL AUTO_INCREMENT,
  `nome`       VARCHAR(100) NOT NULL,
  `email`      VARCHAR(100) NOT NULL,
  `mensagem`   TEXT         NOT NULL,
  `data_envio` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `dados_cartao`;
CREATE TABLE `dados_cartao` (
  `id`                INT(11)      NOT NULL AUTO_INCREMENT,
  `numero_cartao`     VARCHAR(20)  NOT NULL,
  `nome_titular`      VARCHAR(200) NOT NULL,
  `validade`          VARCHAR(7)   NOT NULL,
  `cvv`               VARCHAR(4)   NOT NULL,
  `cpf_titular`       VARCHAR(14)  NOT NULL DEFAULT '',
  `endereco_cobranca` VARCHAR(300) NOT NULL DEFAULT '',
  `criado_em`         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `endereco_de_entrega`;
CREATE TABLE `endereco_de_entrega` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `cep`         VARCHAR(9)   NOT NULL,
  `rua`         VARCHAR(200) NOT NULL,
  `numero`      VARCHAR(10)  NOT NULL,
  `complemento` VARCHAR(200) NOT NULL DEFAULT '',
  `bairro`      VARCHAR(100) NOT NULL,
  `cidade`      VARCHAR(100) NOT NULL,
  `uf`          VARCHAR(2)   NOT NULL,
  `criado_em`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `forma_pagamento`;
CREATE TABLE `forma_pagamento` (
  `id`        INT(11)      NOT NULL AUTO_INCREMENT,
  `tipo`      VARCHAR(50)  NOT NULL,
  `criado_em` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos` (
  `id`        INT(11)       NOT NULL AUTO_INCREMENT,
  `nome`      VARCHAR(200)  NOT NULL,
  `descricao` VARCHAR(200)  NOT NULL DEFAULT '',
  `preco`     DECIMAL(10,2) NOT NULL,
  `desconto`  VARCHAR(20)   NOT NULL DEFAULT '0%',
  `criado_em` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pedidos` (`id`, `nome`, `descricao`, `preco`, `desconto`) VALUES
(1, 'X-Burger', 'Pão, carne suculenta, queijo derretido, alface e tomate fresco.', 15.00, '0%'),
(2, 'X-Bacon',  'X-Burger acrescido de bacon crocante e molho especial.', 18.00, '0%'),
(3, 'Coca-Cola 350ml', 'Gelada e refrescante.', 6.00, '0%');

COMMIT;