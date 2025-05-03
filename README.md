# sculpt

A CLI tool for sculpting WP plugins quickly.

<img width="600" alt="sculpt-cli" src="https://github.com/user-attachments/assets/0cb12ddf-d380-4b0d-810e-3234130f86a3">

## Why Sculpt?

Sculpt is a simple, but powerful CLI tool for building enterprise WP plugins very quickly. It uses simple commands to create standard WP features such as `Posts`, `Taxonomies`, `Meta Boxes`, `Routes`, `Menus` and so much more. In this way, you can focus more on the business logic of your WordPress plugin than spending time trying to write classes from scratch.

If you are a fan of Laravel and how it presents an Object-Oriented approach to building clean, robust and scalabale PHP applications using the `artisan make` commands, then you would definitely love **Sculpt**.

## Getting Started

Install via NPM like so:

```bash
npm install -g @badasswp/sculpt-cli
```

Now you should be able to run it from anywhere on your terminal like so:

```bash
sculpt
```

### Creating A Plugin

Implementing a new WordPress plugin is as simple as using the `plugin` command on your terminal like so:

```bash
sculpt plugin
```

This will prompt you for a list of values needed to scaffold a new plugin with all the necessary abstractions, interfaces, base classes & core files, ready for your use.

<img width="800" alt="sculpt-plugin" src="https://github.com/user-attachments/assets/9877c9d5-2fcd-4863-9c83-8021feb66e0b">

### Creating A Custom Post Type (CPT)

Implementing a custom post type is as simple as using the `post` command on your terminal like so:

```bash
sculpt post
```

This will ultimately prompt you for a list of values related to your custom post type like so:

<img width="650" alt="sculpt-plugin" src="https://github.com/user-attachments/assets/d54d2851-da96-4f7e-aa60-7ac6823fbc64">

Once you're done providing those values, your new custom post type would be implemented automatically and wired up correctly to the appropriate WP hooks, ready for use!
