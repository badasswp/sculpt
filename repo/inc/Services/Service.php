<?php
/**
 * Sculpt Service.
 *
 * This service manages the registering
 * of the Sculpt service.
 *
 * @package SculptPluginPackage
 */

namespace SculptPluginNamespace\Services;

use SculptPluginNamespace\Abstracts\Service;
use SculptPluginNamespace\Interfaces\Kernel;

class Sculpt extends Service implements Kernel {
	/**
	 * Bind to WP.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function register(): void {
		// Bind to WordPress hooks.
	}
}
