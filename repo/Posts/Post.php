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
	 * Get Post meta schema.
	 *
	 * This method should return an array of key value pairs representing
	 * the post meta schema for the custom post type.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed[]
	 */
	protected function get_post_meta_schema(): array {
		return [
			'url' => [
				'label' => esc_html__( 'URL', 'text_domain' ),
				'value' => get_post_meta( get_the_ID(), 'url', true ),
			],
		];
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
