<?php
/**
 * Asset Service.
 *
 * This service manages the asset service
 * that loads styles and scripts.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Services;

use SculptPluginNamespace\Abstracts\Service;
use SculptPluginNamespace\Interfaces\Kernel;

class Asset extends Service implements Kernel {
	/**
	 * Asset Objects.
	 *
	 * @since 1.0.0
	 *
	 * @var mixed[]
	 */
	public array $objects;

	/**
	 * Set up.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function __construct() {
		$assets = [];

		/**
		 * Filter list of assets.
		 *
		 * @since 1.0.0
		 *
		 * @param mixed[] $assets Assets.
		 * @return mixed[]
		 */
		$assets = (array) apply_filters( 'sculpt_assets', $assets );

		foreach ( $assets as $class ) {
			if ( ! class_exists( $class ) ) {
				throw new \LogicException( $class . ' does not exist.' );
			}
			$this->objects[] = new $class();
		}
	}

	/**
	 * Bind to WP.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'init', [ $this, 'register_assets' ] );
	}

	/**
	 * Register Asset type implementation.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_assets(): void {
		foreach ( $this->objects as $object ) {
			$object->register_asset();
		}
	}
}
