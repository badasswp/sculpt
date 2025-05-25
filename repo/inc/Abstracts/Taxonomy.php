<?php
/**
 * Taxonomy abstraction.
 *
 * This abstract class serves as a base handler for registering
 * custom taxonomies within the plugin.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Abstracts;

/**
 * Taxonomy class.
 */
abstract class Taxonomy {
	/**
	 * Taxonomy name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public static $name;

	/**
	 * Set up.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 *
	 * @throws \LogicException If $name property is not statically defined within child classes.
	 */
	final public function __construct() {
		if ( empty( static::$name ) ) {
			throw new \LogicException( __CLASS__ . ' must define static property name' );
		}
	}

	/**
	 * Get Taxonomy name.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_name(): string {
		return static::$name;
	}

	/**
	 * Get singular label for Taxonomy.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_singular_label(): string;

	/**
	 * Get plural label for Taxonomy.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_plural_label(): string;

	/**
	 * Get Post type.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_post_type(): string;

	/**
	 * Register Taxonomy.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_taxonomy(): void {
		register_taxonomy( $this->get_name(), [ $this->get_post_type() ], $this->get_options() );
	}

	/**
	 * Return Taxonomy options.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed[]
	 */
	public function get_options(): array {
		$options = [
			'name'              => $this->get_name(),
			'labels'            => $this->get_labels(),
			'hierarchical'      => true,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => false,
			'show_in_nav_menus' => true,
			'show_tagcloud'     => true,
			'show_in_rest'      => true,
		];

		/**
		 * Filter Taxonomy options.
		 *
		 * @since 1.0.0
		 *
		 * @param mixed[] $options Taxonomy options.
		 * @return mixed[]
		 */
		return (array) apply_filters( 'abstract_taxonomy_options', $options );
	}

	/**
	 * Get labels for Taxonomy.
	 *
	 * @since 1.0.0
	 *
	 * @return string[]
	 */
	public function get_labels(): array {
		$singular_label = $this->get_singular_label();
		$plural_label   = $this->get_plural_label();

		$labels = [
			'name'          => sprintf(
				'%1$s',
				__( $plural_label, 'text-domain' ),
			),
			'singular_name' => sprintf(
				'%1$s',
				__( $singular_label, 'text-domain' ),
			),
			'all_items'     => sprintf(
				'%1$s',
				__( "All {$plural_label}", 'text-domain' ),
			),
			'add_new'       => sprintf(
				'%1$s',
				__( "Add New {$singular_label}", 'text-domain' ),
			),
			'add_new_item'  => sprintf(
				'%1$s',
				__( "Add New {$singular_label}", 'text-domain' ),
			),
			'new_item'      => sprintf(
				'%1$s',
				__( "New {$singular_label}", 'text-domain' ),
			),
			'edit_item'     => sprintf(
				'%1$s',
				__( "Edit {$singular_label}", 'text-domain' ),
			),
			'view_item'     => sprintf(
				'%1$s',
				__( "View {$singular_label}", 'text-domain' ),
			),
			'search_items'  => sprintf(
				'%1$s',
				__( "Search {$plural_label}", 'text-domain' ),
			),
			'menu_name'     => sprintf(
				'%1$s',
				__( $plural_label, 'text-domain' ),
			),
		];

		return $labels;
	}
}
