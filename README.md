# Multstand Server Bot

> 🇷🇺 [Читать на русском](README.ru.md)

A Telegram bot for interacting with the production management system of a small workshop.

Initially, the bot was developed and tested as a single project combining database handling and Telegram bot logic.  
Now, the system has been split into three separate repositories:

- 🔗 [multstand-server-db](https://github.com/AleRaDev12/multstand-server-db) — the main service providing access to the database
- 🤖 [multstand-server-bot](https://github.com/AleRaDev12/multstand-server-bot) — the Telegram bot (this repository)
- 🌐 [multstand-client-web](https://github.com/AleRaDev12/multstand-client-web) — the web client for users

### 🔧 Main Features

**Administrator:**
- User registration with role assignment
- Viewing all database information in a user-friendly format
- Editing and adding information: clients, orders, components, products, financial operations, and more

**Technician:**
- Viewing the list of orders
- Submitting work reports indicating the type of work, product, and the quantity of components used

### 🧰 Stack

- NestJS
- NestJS Telegraf
