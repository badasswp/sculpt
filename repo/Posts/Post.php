<?php
/**
 * SculptClass Class.
 *
 * This class defines the cpt custom post type
 * for the plugin.
 *
 * @package SculptPackage
 */

namespace SculptNamespace\Posts;

use SculptNamespace\Abstracts\Post;

class SculptClass extends Post {
	/**
	 * Post type.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public static $name = 'cpt';

	/**
	 * Return singular label.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_singular_label(): string {
		return 'Singular_Label';
	}

	/**
	 * Return plural label.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_plural_label(): string {
		return 'Plural_Label';
	}

	/**
	 * Return supports.
	 *
	 * @since 1.0.0
	 *
	 * @return string[]
	 */
	public function get_supports(): array {
		return [ 'title', 'thumbnail' ];
	}

	/**
	 * Save Post Type.
	 *
	 * @since 1.0.0
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    WP Post.
	 * @return void
	 */
	public function save_post_type( $post_id, $post ): void {}

	/**
	 * Delete Post Type.
	 *
	 * @since 1.0.0
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post    WP Post.
	 * @return void
	 */
	public function delete_post_type( $post_id, $post ): void {}

	/**
	 * Register Post columns.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $columns Post columns.
	 * @return string[]
	 */
	public function register_post_columns( $columns ): array {
		unset( $columns['date'] );

		$columns['url']  = esc_html__( 'URL', 'text_domain' );
		$columns['date'] = esc_html__( 'Date', 'text_domain' );

		/**
		 * Filter custom post type columns.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $columns Post columns.
		 * @return string[]
		 */
		return (array) apply_filters( 'cpt_columns', $columns );
	}

	/**
	 * Register Post column data.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $column  Column names.
	 * @param int      $post_id Post ID.
	 * @return void
	 */
	public function register_post_column_data( $column, $post_id ): void {
		switch ( $column ) {
			case 'url':
				echo esc_url( get_post_meta( $post_id, 'url', true ) );
				break;
		}

		/**
		 * Fires after default column data registration.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $column  Column names.
		 * @param int      $post_id Post ID.
		 */
		do_action( 'cpt_column_data', $column, $post_id );
	}

	/**
	 *
	 * Slug on rewrite.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_slug(): string {
		return 'cpt_slug';
	}

	/**
	 * Is Post visible in REST.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function is_post_visible_in_rest(): bool {
		return rest_bool;
	}

	/**
	 * Is Post visible in Menu.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function is_post_visible_in_menu(): bool {
		return menu_bool;
	}
}
