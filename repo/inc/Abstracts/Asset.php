<?php
/**
 * Asset abstraction.
 *
 * This abstract class serves as a base handler for registering
 * assets in the plugin. It provides common methods for managing styles
 * and scripts for the admin, frontend, and block editor.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Abstracts;

/**
 * Asset class.
 */
abstract class Asset {
	/**
	 * Register Asset.
	 *
	 * Register implementation for the assets for both
	 * front-end, back-end and block editor.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_asset(): void {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_assets' ] );
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ] );
	}
}
