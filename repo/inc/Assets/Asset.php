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

	/**
	 * Enqueue Admin assets.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function enqueue_admin_assets(): void {
		wp_enqueue_style(
			'sculpt-asset-admin-style',
			plugins_url( 'assets/css/admin-style.css', __DIR__ ),
			[],
			'1.0.0'
		);

		wp_enqueue_script(
			'sculpt-asset-admin-script',
			plugins_url( 'assets/js/admin-script.js', __DIR__ ),
			[ 'wp-element', 'wp-editor' ],
			'1.0.0',
			true
		);

		wp_localize_script(
			'sculpt-asset-admin-script',
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
			'sculpt-asset-frontend-style',
			plugins_url( 'assets/css/frontend-style.css', __DIR__ ),
			[],
			'1.0.0'
		);

		wp_enqueue_script(
			'sculpt-asset-frontend-script',
			plugins_url( 'assets/js/frontend-script.js', __DIR__ ),
			[],
			'1.0.0',
			true
		);

		wp_localize_script(
			'sculpt-asset-frontend-script',
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
			'sculpt-asset-block-editor-style',
			plugins_url( 'assets/css/block-editor-style.css', __DIR__ ),
			[],
			'1.0.0'
		);

		wp_enqueue_script(
			'sculpt-asset-block-editor-script',
			plugins_url( 'assets/js/block-editor-script.js', __DIR__ ),
			[ 'wp-blocks', 'wp-element' ],
			'1.0.0',
			true
		);

		wp_localize_script(
			'sculpt-asset-block-editor-script',
			'sculptAssetData',
			[
				'ajaxUrl' => admin_url( 'admin-ajax.php' ),
				'nonce'   => wp_create_nonce( 'sculpt_asset_nonce' ),
			]
		);
	}
}
