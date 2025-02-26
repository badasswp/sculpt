<?php
/**
 * Post type abstraction.
 *
 * This abstract class serves as a base handler for registering
 * custom post types in the plugin. It provides a standardized structure
 * and common methods for managing the custom post type.
 *
 * @package SculptPackage
 */

namespace SculptNamespace\Abstracts;

use SculptNamespace\Core\Plugin;

/**
 * Post class.
 */
abstract class Post {
	/**
	 * Post type.
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
	 * Get post type name.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_name(): string {
		return static::$name;
	}

	/**
	 * Get singular label for post type.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_singular_label(): string;

	/**
	 * Get plural label for post type.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_plural_label(): string;

	/**
	 * Get supports for post type.
	 *
	 * @since 1.0.0
	 *
	 * @return string[]
	 */
	abstract public function get_supports(): array;

	/**
	 * Save post type.
	 *
	 * @since 1.0.0
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    WP Post.
	 * @return void
	 */
	abstract public function save_post_type( $post_id, $post ): void;

	/**
	 * Delete post type.
	 *
	 * @since 1.0.0
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    WP Post.
	 * @return void
	 */
	abstract public function delete_post_type( $post_id, $post ): void;

	/**
	 * Register Post columns.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $columns Post columns.
	 * @return string[]
	 */
	abstract public function register_post_columns( $columns ): array;

	/**
	 * Register Post column data.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $column  Column names.
	 * @param int      $post_id Post ID.
	 * @return void
	 */
	abstract public function register_post_column_data( $column, $post_id ): void;

	/**
	 * Post URL slug on rewrite.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	abstract public function get_slug(): string;

	/**
	 * Is Post visible in REST.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	abstract public function is_post_visible_in_rest(): bool;

	/**
	 * Register post type.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_post_type(): void {
		if ( ! post_type_exists( $this->get_name() ) ) {
			register_post_type( $this->get_name(), $this->get_options() );
		}
	}

	/**
	 * Return post type options.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed[]
	 */
	public function get_options(): array {
		$options = [
			'name'         => $this->get_name(),
			'labels'       => $this->get_labels(),
			'supports'     => $this->get_supports(),
			'show_in_rest' => $this->is_post_visible_in_rest(),
			'show_in_menu' => $this->is_post_visible_in_menu(),
			'public'       => true,
			'rewrite'      => [
				'slug' => $this->get_slug(),
			],
		];

		/**
		 * Filter Post options.
		 *
		 * @since 1.0.0
		 *
		 * @param mixed[] $options Post options.
		 * @return mixed[]
		 */
		return (array) apply_filters( 'abstract_post_options', $options );
	}

	/**
	 * Get labels for post type.
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
				__( $plural_label, 'text_domain' ),
			),
			'singular_name' => sprintf(
				'%1$s',
				__( $singular_label, 'text_domain' ),
			),
			'add_new'       => sprintf(
				'%1$s',
				__( "Add New {$singular_label}", 'text_domain' ),
			),
			'add_new_item'  => sprintf(
				'%1$s',
				__( "Add New {$singular_label}", 'text_domain' ),
			),
			'new_item'      => sprintf(
				'%1$s',
				__( "New {$singular_label}", 'text_domain' ),
			),
			'edit_item'     => sprintf(
				'%1$s',
				__( "Edit {$singular_label}", 'text_domain' ),
			),
			'view_item'     => sprintf(
				'%1$s',
				__( "View {$singular_label}", 'text_domain' ),
			),
			'search_items'  => sprintf(
				'%1$s',
				__( "Search {$plural_label}", 'text_domain' ),
			),
			'menu_name'     => sprintf(
				'%1$s',
				__( $plural_label, 'text_domain' ),
			),
		];

		return $labels;
	}

	/**
	 * Get Permalink.
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id Post ID.
	 * @return string
	 */
	public function get_permalink( $post_id ): string {
		return sprintf(
			'<a target="_blank" href="%1$s">
				%2$s
			</a>',
			esc_attr( (string) get_permalink( $post_id ) ),
			esc_html( (string) get_permalink( $post_id ) )
		);
	}

	/**
	 * Get Posts.
	 *
	 * @since 1.0.0
	 *
	 * @return \WP_Post[]
	 */
	public static function get_posts(): array {
		$posts = get_posts(
			[
				'post_type'      => static::$name,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'date',
			]
		);

		if ( ! $posts ) {
			return [];
		}

		return $posts;
	}

	/**
	 * Get Posts by Meta.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key   Meta key.
	 * @param string $value Meta value.
	 *
	 * @return \WP_Post[]
	 */
	public static function get_posts_by_meta( $key, $value ): array {
		if ( empty( $id ) || empty( $value ) ) {
			return [];
		}

		$posts = get_posts(
			[
				'post_type'      => static::$name,
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'meta_key'       => (string) $key,
				'meta_value'     => (string) $value,
				'orderby'        => 'date',
				'order'          => 'ASC',
			]
		);

		return $posts;
	}

	/**
	 * Get number of Posts.
	 *
	 * @since 1.0.0
	 *
	 * @return int
	 */
	public static function get_number_of_posts(): int {
		return count( static::get_posts() );
	}

	/**
	 * Get most recent Post.
	 *
	 * @since 1.0.0
	 *
	 * @return \WP_Post
	 */
	public static function get_most_recent_post() {
		return ( static::get_posts() )[0];
	}
}
