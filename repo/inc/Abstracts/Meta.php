<?php
/**
 * Meta abstraction.
 *
 * This abstract class serves as a base handler for registering
 * meta for custom post types in the plugin.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Abstracts;

/**
 * Meta class.
 */
abstract class Meta {
	/**
	 * Meta name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public static $name;

	/**
	 * Get REST name.
	 *
	 * This method gets the REST name for a key
	 * by converting it to camel case format.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Key to convert.
	 * @return string Camel case name.
	 */
	protected function get_rest_name( $key ): string {
		return lcfirst( str_replace( '_', '', ucwords( $key, '_' ) ) );
	}

	/**
	 * Get Meta options.
	 *
	 * This method proceeds to retrieve the
	 * meta options.
	 *
	 * @since 1.0.0
	 *
	 * @param string  $key Meta name.
	 * @param mixed[] $value Meta schema.
	 *
	 * @return mixed[]
	 */
	protected function get_meta_options( $key, $value ): array {
		$options = [
			'single'            => true,
			'type'              => $value['type'],
			'auth_callback'     => '__return_true',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => [
				'name'   => $value['rest_name'] ?? $this->get_rest_name( $key ),
				'schema' => [
					'type' => $value['type'],
				],
			],
		];

		/**
		 * Filter custom meta options.
		 *
		 * @since 1.0.0
		 *
		 * @param mixed[] $columns Default Meta options.
		 * @param string  $key Meta name.
		 * @param mixed[] $value Meta schema.
		 *
		 * @return mixed[]
		 */
		return (array) apply_filters( 'sculpt_meta_options', $options, $key, $value );
	}

	/**
	 * Register Post meta.
	 *
	 * This method registers the post meta
	 * for the custom post type.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_meta(): void {
		if ( empty( static::$name ) ) {
			throw new \LogicException( __CLASS__ . ' must define post type where meta belongs to.' );
		}

		add_post_type_support( static::$name, 'custom-fields' );

		foreach ( static::get_post_meta() as $key => $value ) {
			if ( ! is_array( $value ) || ! isset( $value['type'] ) ) {
				continue;
			}

			register_post_meta( static::$name, $key, $this->get_meta_options( $key, $value ) );
		}
	}
}
