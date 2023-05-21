<?php

/** 
 * Plugin Name: My first Gutenberg App
 * 
 */

function my_admin_menu() {

    // https://developer.wordpress.org/reference/functions/add_menu_page/

    // $page_title, $menu_title, $capability, $menu_slug, $callback, $icon_url, $position

    $page_title = __(' My first Gutenberg app', 'gutenberg ');
    $menu_title = __(' My first Gutenberg app', 'gutenberg ');
    $capability = 'manage_options';
    $icon_url = 'dashicons-schedule';

    add_menu_page(
        $page_title,
        $menu_title,
        $capability,
        'my-first-gutenberg-app',
        function () {
            echo '
            <h2>Pages</h2>
            <div id="my-first-gutenberg-app"></div>
            ';
        },
        $icon_url,
        3
    );
};

add_action('admin_menu', 'my_admin_menu');


function load_custom_wp_admin_scripts($hook) {

    // Load only on ?page=my-first-gutenberg-app
    if ($hook !== 'toplevel_page_my-first-gutenberg-app') {
        return;
    }

    // Load required WordPress Packages
    $asset_file = include plugin_dir_path(__FILE__) . 'build/index.asset.php';

    // Enqueue CSS Dependencies
    foreach ($asset_file['dependencies'] as $style) {
        wp_enqueue_style($style);
    }

    // Load our app.js
    wp_enqueue_script(
        'my-first-gutenberg-app',
        plugins_url('build/index.js', __FILE__),
        $asset_file['dependencies'],
        $asset_file['version']
    );

    // Load our style.css
    wp_enqueue_style(
        'my-first-gutenberg-app',
        plugins_url('style.css', __FILE__),
        [],
        $asset_file['version']
    );
};

add_action('admin_enqueue_scripts', 'load_custom_wp_admin_scripts');
