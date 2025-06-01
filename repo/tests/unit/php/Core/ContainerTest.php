<?php

namespace SculptPluginNamespace\Tests\Core;

use Mockery;
use WP_Mock\Tools\TestCase;
use SculptPluginNamespace\Core\Container;
use SculptPluginNamespace\Services\Admin;

/**
 * @covers \SculptPluginNamespace\Core\Container::__construct
 * @covers \SculptPluginNamespace\Services\Admin::register
 */
class ContainerTest extends TestCase {
	public Container $container;

	public function setUp(): void {
		\WP_Mock::setUp();
	}

	public function tearDown(): void {
		\WP_Mock::tearDown();
	}

	public function test_container_contains_required_services() {
		$this->container = new Container();

		$this->assertTrue( in_array( Admin::class, Container::$services, true ) );
	}
}
