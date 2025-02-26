<?php
/**
 * Sculpt Class.
 *
 * This class defines the cpt custom post type for the
 * plugin.
 *
 * @package Sculpt
 */

namespace Sculpt\Posts;

use Sculpt\Abstracts\Post;

/**
 * Sculpt class.
 */
class Sculpt extends Post {
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

		$columns['meta'] = esc_html__( 'Meta', 'text_domain' );
		$columns['date'] = esc_html__( 'Date', 'text_domain' );

		/**
		 * Filter cpt custom post type columns.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $columns Post columns.
		 * @return string[]
		 */
		return (array) apply_filters( 'text_domain_cpt_columns', $columns );
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
			case 'questions':
				echo esc_html( (string) xama_count_questions( $post_id ) );
				break;

			case 'url':
				$arg = [
					'a' => [
						'href'   => [],
						'target' => [],
					],
				];
				echo wp_kses( $this->get_permalink( $post_id ), $arg );
				break;

			case 'participants':
				echo esc_html( (string) xama_count_scores( $post_id ) );
				break;

			case 'passed':
				echo esc_html( (string) xama_count_scores( $post_id ) );
				break;
		}

		/**
		 * Fires after Quiz columns data registration.
		 *
		 * @since 1.0.0
		 *
		 * @param string[] $column  Column names.
		 * @param int      $post_id Post ID.
		 */
		do_action( 'xama_quiz_column_data', $column, $post_id );
	}

	/**
	 * Post URL slug on rewrite.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_slug(): string {
		$slug = xama_get_option( 'url_rewrite' ) ?: 'quiz';

		/**
		 * Filter Quiz slug name.
		 *
		 * @since 1.0.0
		 *
		 * @param string $slug Slug name.
		 * @return string
		 */
		return (string) apply_filters( 'xama_quiz_slug', $slug );
	}

	/**
	 * Is Post visible in REST.
	 *
	 * @since 1.0.0
	 *
	 * @return bool
	 */
	public function is_post_visible_in_rest(): bool {
		/**
		 * Filter Quiz visibility in REST.
		 *
		 * @since 1.0.0
		 *
		 * @param bool $visibility Whether to show in REST or not.
		 * @return bool
		 */
		return (bool) apply_filters( 'xama_quiz_visible_in_rest', $visibility = false );
	}
}
