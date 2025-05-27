<?php
/**
 * SculptAssetName Class.
 *
 * This class defines the SculptAssetName asset
 * for the plugin.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Assets;

use SculptPluginNamespace\Abstracts\Asset;

class SculptAssetName extends Asset {
	/**
	 * Asset name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected static $name = 'sculpt-asset';

	/**
	 * Enqueue Admin assets.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function enqueue_admin_assets(): void {
		wp_enqueue_style(
			sprintf( '%s-admin-style', static::$name ),
			plugins_url( 'assets/css/admin-style.css', __DIR__ ),
			[],
			'1.0.0'
		);

		wp_enqueue_script(
			sprintf( '%s-admin-script', static::$name ),
			plugins_url( 'assets/js/admin-script.js', __DIR__ ),
			[],
			'1.0.0',
			true
		);

		wp_localize_script(
			sprintf( '%s-admin-script', static::$name ),
			'sculptAssetData',
			[
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'sculpt_asset_nonce' ),
			]
		);
	}

	/**
	 * Enqueue Frontend assets.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function enqueue_frontend_assets(): void {
		wp_enqueue_style(
			sprintf( '%s-frontend-style', static::$name ),
			plugins_url( 'assets/css/frontend-style.css', __DIR__ ),
			[],
			'1.0.0'
		);

		wp_enqueue_script(
			sprintf( '%s-frontend-script', static::$name ),
			plugins_url( 'assets/js/frontend-script.js', __DIR__ ),
			[],
			'1.0.0',
			true
		);

		wp_localize_script(
			sprintf( '%s-frontend-script', static::$name ),
			'sculptAssetData',
			[
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'sculpt_asset_nonce' ),
			]
		);
	}

	/**
	 * Enqueue Block Editor assets.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function enqueue_block_editor_assets(): void {
		wp_enqueue_style(
			sprintf( '%s-block-editor-style', static::$name ),
			plugins_url( 'assets/css/block-editor-style.css', __DIR__ ),
			[],
			'1.0.0'
		);

		wp_enqueue_script(
			sprintf( '%s-block-editor-script', static::$name ),
			plugins_url( 'assets/js/block-editor-script.js', __DIR__ ),
			[ 'wp-blocks', 'wp-element' ],
			'1.0.0',
			true
		);

		wp_localize_script(
			sprintf( '%s-block-editor-script', static::$name ),
			'sculptAssetData',
			[
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'sculpt_asset_nonce' ),
			]
		);
	}
}
