<?php
/**
 * Plugin Name: Adchitects Slider Gutenberg Block
 * Description: Based on https://github.com/MarkMarzeotti/gutenberg-repeater-field.
 * Author: Adchitects
 * Version: 1.0.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
