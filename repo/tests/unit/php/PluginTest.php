<?php

namespace SculptPluginNamespace\Tests;

use Mockery;
use WP_Mock\Tools\TestCase;
use SculptPluginNamespace\Plugin;
use SculptPluginNamespace\Abstracts\Kernel;

/**
 * @covers \SculptPluginNamespace\Plugin::get_instance
 */
class PluginTest extends TestCase {
	public function setUp(): void {
		\WP_Mock::setUp();
	}

	public function tearDown(): void {
		\WP_Mock::tearDown();
	}

	public function test_plugin_returns_same_instance() {
		$instance1 = Plugin::get_instance();
		$instance2 = Plugin::get_instance();

		$this->assertSame( $instance1, $instance2 );
		$this->assertConditionsMet();
	}
}
