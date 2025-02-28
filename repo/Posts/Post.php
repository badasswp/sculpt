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
	 * Register Post column labels.
	 *
	 * @since 1.0.0
	 *
	 * @param string[] $columns Post column labels.
	 * @return string[]
	 */
	public function register_post_column_labels( $columns ): array {
		unset( $columns['date'] );

		$meta_columns = array_map(
			function( $meta ) {
				return $meta['label'];
			},
			$this->get_post_meta_schema()
		);

		$columns = wp_parse_args(
			$meta_columns,
			[
				'date' => esc_html__( 'Date', 'text_domain' ),
			]
		);

		/**
		 * Filter custom post type column labels.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $columns Post column labels.
		 * @return string[]
		 */
		return (array) apply_filters( 'cpt_column_labels', $columns );
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
		$meta_columns = $this->get_post_meta_schema();

		if ( isset( $meta_columns[ $column ] ) ) {
			echo $meta_columns[ $column ]['value'] ?? ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
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
	 * Register Post column sorting.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_Query $query WP Query.
	 * @return void
	 */
	public function register_post_column_sorting( $query ): void {
		if ( ! is_admin() ) {
			return;
		}

		if ( ! isset( $query->query_vars['post_type'] ) ) {
			return;
		}

		foreach( $this->get_post_meta_schema() as $key => $value ) {
			if ( $key === $query->query_vars['post_type'] ) {
				$query->set( 'order', 'ASC' );
				$query->set( 'orderby', 'meta_value' );
				$query->set( 'meta_key', $value );
			}
		}
	}

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
