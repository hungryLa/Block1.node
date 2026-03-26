# Тестовое задание Блок 1: Node.js (Backend)

Простое API для управления задачами с регистрацией и JWT-авторизацией.

## Технологии

- Node.js
- Fastify
- PostgreSQL
- Sequelize
- JWT
- bcrypt
- Joi (валидация)
- Jest (тестирование)
- Docker

## Запуск

    git clone git@github.com:hungryLa/Block1.node.git

    cd block1.node

    cp .env.example .env

    docker-compose build --no-cache

    docker-compose up -d