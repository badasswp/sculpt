<?php
/**
 * SculptTaxonomyName Class.
 *
 * This class defines the SculptTaxonomyName taxonomy
 * for the plugin.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Taxonomies;

use SculptPluginNamespace\Abstracts\Taxonomy;

class SculptTaxonomyName extends Taxonomy {
	/**
	 * Taxonomy type.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public static $name = 'SculptTaxonomySlug';

	/**
	 * Return singular label.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_singular_label(): string {
		return 'SculptTaxonomySingularLabel';
	}

	/**
	 * Return plural label.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_plural_label(): string {
		return 'SculptTaxonomyPluralLabel';
	}

	/**
	 * Get Post type.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_post_type(): string {
		return 'SculptTaxonomyPostType';
	}
}
