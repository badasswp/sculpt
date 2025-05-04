<?php
/**
 * Taxonomy Service.
 *
 * This service manages custom taxonomy
 * registrations for the plugin.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Services;

use SculptPluginNamespace\Abstracts\Service;
use SculptPluginNamespace\Interfaces\Kernel;

class Taxonomy extends Service implements Kernel {
	/**
	 * Taxonomy Objects.
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
		$taxonomies = [];

		/**
		 * Filter list of taxonomies.
		 *
		 * @since 1.0.0
		 *
		 * @param mixed[] $taxonomies Taxonomies.
		 * @return mixed[]
		 */
		$tax_types = (array) apply_filters( 'sculpt_taxonomies', $taxonomies );

		foreach ( $taxonomies as $class ) {
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
		add_action( 'init', [ $this, 'register_taxonomies' ] );
	}

	/**
	 * Register Taxonomy type implementation.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_taxonomies(): void {
		foreach ( $this->objects as $object ) {
			$object->register_taxonomy();
		}
	}
}
