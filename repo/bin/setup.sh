#!/bin/bash

wp-env run cli wp theme activate twentytwentythree
wp-env run cli wp rewrite structure /%postname%
wp-env run cli wp option update blogname "WordPress Site"
wp-env run cli wp option update blogdescription "A WordPress site for plugin devlopment by Sculpt."
