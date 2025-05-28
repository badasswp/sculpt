<?php
/**
 * SculptMetaName Class.
 *
 * This class defines the SculptMetaName
 * for the plugin.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Meta;

use SculptPluginNamespace\Abstracts\Meta;

class SculptMetaName extends Meta {
	/**
	 * Post type.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public static $name = 'SculptMetaPostType';

	/**
	 * Get Post meta.
	 *
	 * This method should return an array of key value
	 * pairs representing the post meta schema for the
	 * custom post type.
	 *
	 * @since 1.0.0
	 *
	 * @return mixed[]
	 */
	public static function get_post_meta(): array {
		return [
			'url' => [
				'label'     => esc_html__( 'URL', 'text-domain' ),
				'value'     => get_post_meta( get_the_ID(), 'url', true ),
				'type'      => 'string',
				'default'   => 'https://example.com',
				'rest_name' => 'url',
			],
		];
	}
}
