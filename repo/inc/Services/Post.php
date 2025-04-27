<?php
/**
 * Post Service.
 *
 * This service manages custom post types within the
 * plugin. It provides functionality for registering and binding
 * custom post types to WordPress.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Services;

use SculptPluginNamespace\Abstracts\Service;
use SculptPluginNamespace\Interfaces\Kernel;

class Post extends Service implements Kernel {
	/**
	 * Post Objects.
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
		$post_types = [];

		/**
		 * Filter list of custom post types.
		 *
		 * @since 1.0.0
		 *
		 * @param mixed[] $post_types Post types.
		 * @return mixed[]
		 */
		$post_types = (array) apply_filters( 'sculpt_post_types', $post_types );

		foreach ( $post_types as $class ) {
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
		add_action( 'init', [ $this, 'register_post_types' ] );

		/**
		 * Specify Post Instance types.
		 *
		 * @since 1.0.0
		 */
		foreach ( $this->objects as $object ) {
			add_filter(
				'manage_' . $object->get_name() . '_posts_columns',
				[ $object, 'register_post_column_labels' ],
				10,
				1
			);

			add_filter(
				'manage_edit-' . $object->get_name() . '_sortable_columns',
				[ $object, 'register_post_sortable_columns' ],
				10,
				1
			);

			add_action(
				'manage_' . $object->get_name() . '_posts_custom_column',
				[ $object, 'register_post_column_data' ],
				10,
				2
			);

			add_action(
				'publish_' . $object->get_name(),
				[ $object, 'save_post_type' ],
				10,
				2
			);

			add_action(
				'wp_trash_post',
				[ $object, 'delete_post_type' ],
				10,
				2
			);

			add_action(
				'pre_get_posts',
				[ $object, 'register_post_column_sorting' ],
				10,
				1
			);
		}
	}

	/**
	 * Register Post type implementation.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_post_types(): void {
		foreach ( $this->objects as $object ) {
			$object->register_post_type();
		}
	}
}
