<?php
/**
 * Admin Service.
 *
 * This service manages the admin area of the
 * plugin. It provides functionality for registering
 * the plugin options/settings.
 *
 * @package SculptPluginNamespace
 */

namespace SculptPluginNamespace\Services;

use SculptPluginNamespace\Abstracts\Service;
use SculptPluginNamespace\Interfaces\Kernel;

class Admin extends Service implements Kernel {
	/**
	 * Plugin Option.
	 *
	 * @var string
	 */
	const PLUGIN_SLUG = 'sculpt';

	/**
	 * Plugin Option.
	 *
	 * @var string
	 */
	const PLUGIN_OPTION = 'sculpt_option';

	/**
	 * Plugin Group.
	 *
	 * @var string
	 */
	const PLUGIN_GROUP = 'sculpt-group';

	/**
	 * Plugin Options.
	 *
	 * @var mixed[]
	 */
	public array $options;

	/**
	 * Bind to WP.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'admin_menu', [ $this, 'register_options_page' ] );
	}

	/**
	 * Register Options Page.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_options_page(): void {
		add_menu_page(
			__( 'SculptPluginName', 'text-domain' ),
			__( 'SculptPluginName', 'text-domain' ),
			'manage_options',
			self::PLUGIN_SLUG,
			[ $this, 'register_options_cb' ],
			'dashicons-admin-customizer',
			100
		);
	}

	/**
	 * Register Options Callback.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register_options_cb(): void {
		$this->options = get_option( self::PLUGIN_OPTION, [] );
		?>
		<div class="wrap">
			<h1><?php _e( 'SculptPluginName', 'text-domain' ); ?></h1>
			<form method="post" action="options.php">
			<?php
				settings_fields( self::PLUGIN_GROUP );
				do_settings_sections( self::PLUGIN_SLUG );
				submit_button();
			?>
			</form>
		</div>
		<?php
	}
}
