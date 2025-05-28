<?php
/**
 * Meta Service.
 *
 * This service manages the meta service
 * that registers meta fields.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Services;

use SculptPluginNamespace\Abstracts\Service;
use SculptPluginNamespace\Interfaces\Kernel;

class Meta extends Service implements Kernel {
	/**
	 * Meta Objects.
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
		$meta = [];

		/**
		 * Filter list of meta.
		 *
		 * @since 1.0.0
		 *
		 * @param mixed[] $meta Meta.
		 * @return mixed[]
		 */
		$meta = (array) apply_filters( 'sculpt_meta', $meta );

		foreach ( $meta as $class ) {
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
		foreach ( $this->objects as $object ) {
			$object->register_meta();
		}
	}
}
