# sculpt

A CLI tool for sculpting WP plugins quickly.

<img width="600" alt="sculpt-cli" src="https://github.com/user-attachments/assets/0cb12ddf-d380-4b0d-810e-3234130f86a3">

## Why Sculpt?

Sculpt is a simple, but powerful CLI tool for building enterprise WP plugins very quickly. It uses simple commands to create standard WP features such as `Posts`, `Taxonomies`, `Meta`, `Assets`, `Services` and so much more. In this way, you can focus more on the business logic of your WordPress plugin than spending time trying to write classes from scratch.

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

---

<img width="1439" alt="sculpt-vscode-plugin" src="https://github.com/user-attachments/assets/9e997b6f-5b51-44e9-920c-fb51f89e5a9a" />

---

To launch your new plugin, you can simply use the command:

```bash
yarn boot
```

This should install all PHP and JS dependencies and launch your new plugin using a `.wp-env` docker configuration.

To understand how your new plugin is architectured, please take a look at the [Design Methodology](https://github.com/badasswp/sculpt/blob/master/README.md#design-methodology) section.

---

### Creating A Custom Post Type (CPT)

Implementing a custom post type is as simple as using the `post` command on your terminal like so:

```bash
sculpt post
```

This will ultimately prompt you for a list of values related to your custom post type like so:

```bash
sculpt-cli v1.0.0 by badasswp
A CLI tool for sculpting WP plugins quickly.

Custom Post Type: Employee
Singular Label: Employee
Plural Label: Employees
Show in REST: true
Show in Menu: true

New Custom post type created: Employee
```

---

Once you're done providing those values, your new custom post type would be implemented automatically and wired up correctly to the appropriate WP hooks, ready for use!

<img width="1442" alt="sculpt-vscode-post" src="https://github.com/user-attachments/assets/b922a03a-e5a8-4dd4-b188-3afd991b0af5" />

#### Behind the Scenes

Sculpt will attempt to create a custom post type **concrete** class for you based on the values you have provided as well as the following classes:

- Post Abstraction
- Post Service

The Post abstraction would take care of most of the heavy lifting for your custom post type such as post type registration and its unique characteristics.

The Post service would take of binding the custom post type's logic to the necessary WP hooks at run time.

---

### Creating A Custom Taxonomy

Implementing a custom taxonomy is as simple as using the `taxonomy` command on your terminal like so:

```bash
sculpt taxonomy
```

This will ultimately prompt you for a list of values related to your custom taxonomy like so:

```bash
sculpt-cli v1.0.0 by badasswp
A CLI tool for sculpting WP plugins quickly.

Custom Taxonomy: Country
Singular Label: Country
Plural Label: Countries
Slug: employee_country
Post type it belongs to: Employee

New Taxonomy created: Country
```

---

Once you're done providing those values, your new custom taxonomy would be implemented automatically and wired up correctly to the appropriate WP hooks.

<img width="1369" alt="sculpt-vscode-taxonomy" src="https://github.com/user-attachments/assets/6015926a-db57-4d36-a02d-843477659344" />

#### Behind the Scenes

Sculpt will attempt to create a custom taxonomy **concrete** class for you based on the values you have provided as well as the following classes:

- Taxonomy Abstraction
- Taxonomy Service

The Taxonomy abstraction would take care of most of the heavy lifting for your custom taxonomy such as taxonomy registration and defining its options.

The Taxonomy service would take of binding the custom taxonomy's logic to the necessary WP hooks at run time.

### Creating A Service

Sculpt provides users a way of implementing a service. A service is essentially a high-level point where we bind our logic to WP core hooks. You can achieve this like so:

```bash
sculpt service
```

This will prompt you for a list of values like so:

```bash
sculpt-cli v1.0.0 by badasswp
A CLI tool for sculpting WP plugins quickly.

Service Name: LoadImages

New Service created: LoadImages
```

---

Once you're done providing those values, your new service would be implemented & wired up to load from the Container factory.

<img width="1369" alt="sculpt-vscode-taxonomy" src="https://github.com/user-attachments/assets/6015926a-db57-4d36-a02d-843477659344" />

#### Behind the Scenes

Sculpt will attempt to create a **service** class for you and load it into the Container factory.

### Creating An Asset.

An asset class is where we load JavaScript code for our plugin. Sculpt provides an easy way of doing this like so:

```bash
sculpt asset
```

This will prompt you for a list of values like so:

```bash
sculpt-cli v1.0.0 by badasswp
A CLI tool for sculpting WP plugins quickly.

Asset Name: Podcast

New Asset created: Podcast
```

---

Once you're done providing those values, your new asset class would be implemented automatically and wired up correctly to the appropriate WP hooks.

<img width="1369" alt="sculpt-vscode-taxonomy" src="https://github.com/user-attachments/assets/6015926a-db57-4d36-a02d-843477659344" />

#### Behind the Scenes

Sculpt will attempt to create an **asset** class for you based on the values you have provided as well as the following classes:

- Asset Abstraction
- Asset Service

The Asset abstraction would handle all of the loading of the various scripts and correctly binding them to WP's hooks.

The Asset service would handle the registration of the various asset classes.

### Creating A Meta.

A meta class handles meta data registration for post types. Again, Sculpt provides an easy way of doing this like so:

```bash
sculpt meta
```

This will prompt you for a list of values like so:

```bash
sculpt-cli v1.0.0 by badasswp
A CLI tool for sculpting WP plugins quickly.

Meta name: EmployeeMeta
Post type it belongs to: employee

New Meta created: EmployeeMeta
```

---

Once you're done providing those values, your new meta class would be implemented automatically and provide you options of adding in meta data.

<img width="1369" alt="sculpt-vscode-taxonomy" src="https://github.com/user-attachments/assets/6015926a-db57-4d36-a02d-843477659344" />

#### Behind the Scenes

Sculpt will attempt to create a **meta** class for you based on the values you have provided as well as the following classes:

- Meta Abstraction
- Meta Service

The Meta abstraction would handle the registration of the various meta data.

The Meta service would handle the registration of the various meta classes.

## Design Methodology

Sculpt uses a design pattern we call **FASI (Factory-Singleton)**. This design pattern is made up of two parts: The **factory** which holds the services to be instantiated, and the **singletons** which are the services themselves.

During run time, the plugin loads all the singletons found in the Container by creating a single instance using the Service parent abstraction's `get_instance` and then proceeds to run its logic by invoking the `register` method for each of them. The services contain logic that effectively bind to WP hooks at run time.

<img width="1083" alt="FASI" src="https://github.com/badasswp/xama/assets/149586343/0992684e-691a-4e15-9759-17cc6274fe7d">

### Container

The Container basically serves as a Factory class for initialising the plugin's Services. This class is responsible for managing and registering various services used by your plugin. You can see this in the code snippet below:

```php
public function __construct() {
    self::$services = [
        \HelloWorld\Services\Auth::class,
        \HelloWorld\Services\Ajax::class,
        \HelloWorld\Services\Assets::class,
        \HelloWorld\Services\Boot::class,
        \HelloWorld\Services\Controller::class,
        \HelloWorld\Services\Editor::class,
        \HelloWorld\Services\Menu::class,
        \HelloWorld\Services\MetaBox::class,
        \HelloWorld\Services\Notices::class,
        \HelloWorld\Services\Post::class,
        \HelloWorld\Services\REST::class,
        \HelloWorld\Services\Settings::class,
        \HelloWorld\Services\Taxonomy::class,
        \HelloWorld\Services\Template::class,
    ];
  }

public function register(): void {
    foreach ( self::$services as $service ) {
        ( $service::get_instance() )->register();
    }
}
```

### Services

A Service is basically a Singleton instance which extends the Service abstraction. It contains the high level logic that binds custom logic to WordPress hooks. An example is shown below:

```php
use HelloWorld\Abstracts\Service;
use HelloWorld\Interfaces\Kernel;

class YourService extends Service implements Kernel {
    /**
     * Bind to WP.
     *
     * @return void
     */
    public function register(): void {
        // bind your hooks here...
    }
}
```

<br/>
