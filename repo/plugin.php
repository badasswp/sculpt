<?php
/**
 * Plugin Name: SculptPluginName
 * Plugin URI:  SculptPluginURL
 * Description: SculptPluginDescription
 * Version:     SculptPluginVersion
 * Author:      SculptPluginAuthor
 * Author URI:  SculptPluginAuthorURI
 * License:     GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: text-domain
 * Domain Path: /languages
 *
 * @package SculptPackage
 */

namespace SculptAuthorNamespace;

if ( ! defined( 'WPINC' ) ) {
	exit;
}

define( 'SCULPT_AUTOLOAD', __DIR__ . '/vendor/autoload.php' );

// Composer Check.
if ( ! file_exists( SCULPT_AUTOLOAD ) ) {
	add_action(
		'admin_notices',
		function () {
			vprintf(
				/* translators: Plugin directory path. */
				esc_html__( 'Fatal Error: Composer not setup in %s', 'text-domain' ),
				[ __DIR__ ]
			);
		}
	);

	return;
}

// Run Plugin.
require_once SCULPT_AUTOLOAD;
( SculptPlugin::get_instance() )->run();
