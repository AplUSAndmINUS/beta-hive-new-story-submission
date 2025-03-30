<?php

/**
 * HIVE-functions
 */
// Generated with assistance from GitHub Copilot, 2025 TerenceWaters.com

// Function to enqueue React app scripts and styles
/*** COMMENT OUT LINES 9-11 when working with STAGING and PROD vs. local! ***/
// if (!defined('WP_ENV')) {
//     define('WP_ENV', 'local');
// };

// Enable CORS here when working with the local server
function add_cors_http_header(){
    header("Access-Control-Allow-Origin: https://staging-203c-battlehivefictioncom.wpcomstaging.com/admin-page");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
    header("Access-Control-Allow-Headers: X-WP-Nonce, Content-Type");
}
add_action('init','add_cors_http_header');

function enqueue_react_app() {
	$is_local = defined('WP_ENV') && WP_ENV == 'local';

    // Enqueue story-submission app
    if (!wp_script_is('beta-hive-story-submission', 'enqueued')) {
        wp_enqueue_script(
            'beta-hive-new-story-submission',
            $is_local ? 'http://localhost:3000/static/js/bundle.js' : get_template_directory_uri() . '/htdocs/wp-content/reactpress/apps/beta-hive-story-submission/build/static/js/main.3f655f80.js',
            array(),
            null,
            true
        );
        wp_enqueue_style(
           'beta-hive-new-story-submission',
            $is_local ? 'http://localhost:3000/static/css/main.css' : get_template_directory_uri() . '/htdocs/wp-content/reactpress/apps/beta-hive-story-submission/build/static/css/main.f2ed6db1.css',
            array(),
            null
        );
    }

    // Enqueue admin-page app
    if (!wp_script_is('beta-hive-admin-page', 'enqueued')) {
        wp_enqueue_script(
            'beta-hive-admin-page',
            $is_local ? 'http://localhost:3000/static/js/bundle.js' : get_template_directory_uri() . '/htdocs/wp-content/reactpress/apps/beta-hive-admin-page/build/static/js/main.0d8e422b.js',
            array(),
            null,
            true
        );
        wp_enqueue_style(
            'beta-hive-admin-page',
            $is_local ? 'http://localhost:3000/static/css/main.css' : get_template_directory_uri() . '/htdocs/wp-content/reactpress/apps/beta-hive-admin-page/build/static/css/main.9c38c043.css',
            array(),
            null
        );
    }

    // Enqueue enter-the-arena app
    if (!wp_script_is('beta-hive-enter-the-arena', 'enqueued')) {
        wp_enqueue_script(
            'beta-hive-enter-the-arena',
            $is_local ? 'http://localhost.3000/static/js/bundle.js' : get_template_directory_uri() . '/htdocs/wp-content/reactpress/apps/beta-hive-enter-the-arena/build/static/js/main.abcdef12.js',
            array(),
            null,
            true
        );
        wp_enqueue_style(
            'beta-hive-enter-the-arena',
            $is_local ? 'http://localhost:3000/static/css/main.css' : get_template_directory_uri() . '/htdocs/wp-content/reactpress/apps/beta-hive-enter-the-arena/build/static/css/main.abcdef12.css',
            array(),
            null
        );
    }
}

// Function to generate and pass nonce to the front-end
function pass_nonce_to_react_app() {
    // Generate a nonce and pass it to the front-end for story-submission
    if (wp_script_is('beta-hive-story-submission', 'enqueued')) {
        wp_localize_script('beta-hive-story-submission', 'wpApiSettings', array(
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }

    // Generate a nonce and pass it to the front-end for admin-page
    if (wp_script_is('beta-hive-admin-page', 'enqueued')) {
        wp_localize_script('beta-hive-admin-page', 'wpApiSettings', array(
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }

    // Generate a nonce and pass it to the front-end for enter-the-arena
    if (wp_script_is('beta-hive-enter-the-arena', 'enqueued')) {
        wp_localize_script('beta-hive-enter-the-arena', 'wpApiSettings', array(
            'nonce' => wp_create_nonce('wp_rest')
        ));
    }
}

// Hook the functions to the wp_enqueue_scripts action
add_action('wp_enqueue_scripts', 'enqueue_react_app');
add_action('wp_enqueue_scripts', 'pass_nonce_to_react_app');

/**** START STORY APIs and Functions *****/
// Callback function to get all stories
function get_all_stories($request) {
    // Verify nonce
    if (!wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
        return new WP_Error('rest_forbidden', __('Nonce verification failed'), array('status' => 403));
    }

    // Get pagination parameters with defaults
    $page = max(1, intval($request->get_param('page') ?: 1));
    $per_page = min(100, max(1, intval($request->get_param('per_page') ?: 100))); // Default to 100, max 100
    $offset = ($page - 1) * $per_page;

    // Get filter parameters
    $battle_name = $request->get_param('battleName');
    $hive = $request->get_param('hive');
    $content_warnings = $request->get_param('contentWarnings');
    $is_content_sensitive = $request->get_param('isContentSensitive');
    $wins = $request->get_param('wins');
    $losses = $request->get_param('losses');

    $args = array(
        'post_type' => 'story',
        'posts_per_page' => $per_page,
        'offset' => $offset,
        'orderby' => 'date',
        'order' => 'DESC',
        'no_found_rows' => false // Enable found rows for pagination
    );

    // Add tag filtering if parameters are provided
    $tax_query = array();
    if ($battle_name) {
        $tax_query[] = array(
            'taxonomy' => 'post_tag',
            'field' => 'name',
            'terms' => sanitize_text_field($battle_name)
        );
    }
    if ($hive) {
        $tax_query[] = array(
            'taxonomy' => 'post_tag',
            'field' => 'name',
            'terms' => sanitize_text_field($hive)
        );
    }
    if ($content_warnings) {
        $tax_query[] = array(
            'taxonomy' => 'post_tag',
            'field' => 'name',
            'terms' => array_map('sanitize_text_field', (array)$content_warnings),
            'operator' => 'AND'
        );
    }
    if (!empty($tax_query)) {
        $args['tax_query'] = $tax_query;
    }

    $query = new WP_Query($args);
    
    if (is_wp_error($query)) {
        return new WP_Error('query_error', __('Error fetching stories'), array('status' => 500));
    }

    $stories = array();
    $total_posts = $query->found_posts;
    $total_pages = ceil($total_posts / $per_page);

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            
            // Get all tags for this post
            $tags = wp_get_post_terms($post_id, 'post_tag', array('fields' => 'names'));
            
            // Get meta fields
            $story_wins = get_post_meta($post_id, 'wins', true) ?: 0;
            $story_losses = get_post_meta($post_id, 'losses', true) ?: 0;
            $is_content_sensitive = get_post_meta($post_id, 'isContentSensitive', true) ?: false;

            // Apply win/loss filters if specified
            if (isset($wins) && $story_wins != $wins) continue;
            if (isset($losses) && $story_losses != $losses) continue;

            $story = array(
                'id' => $post_id,
                'title' => get_the_title(),
                'story' => get_the_content(),
                'author' => get_post_meta($post_id, 'author', true),
                'HIVE' => get_post_meta($post_id, 'HIVE', true),
                'prompts' => get_post_meta($post_id, 'prompts', true),
                'isContentSensitive' => $is_content_sensitive,
                'contentWarnings' => get_post_meta($post_id, 'contentWarnings', true),
                'battleName' => get_post_meta($post_id, 'battleName', true),
                'wordCount' => get_post_meta($post_id, 'wordCount', true),
                'status' => get_post_meta($post_id, 'status', true),
                'feedback' => get_post_meta($post_id, 'feedback', true),
                'wins' => $story_wins,
                'losses' => $story_losses,
                'date' => get_the_date('c'),
                'modified' => get_the_modified_date('c'),
                'tags' => $tags
            );
            array_push($stories, $story);
        }
    }

    // Prepare pagination info
    $pagination = array(
        'current_page' => $page,
        'per_page' => $per_page,
        'total_posts' => $total_posts,
        'total_pages' => $total_pages,
        'has_next_page' => $page < $total_pages,
        'has_previous_page' => $page > 1,
        'next_page' => $page < $total_pages ? $page + 1 : null,
        'previous_page' => $page > 1 ? $page - 1 : null
    );

    $response = new WP_REST_Response(array(
        'stories' => $stories,
        'pagination' => $pagination
    ), 200);

    // Add pagination headers for backward compatibility
    $response->header('X-WP-Total', $total_posts);
    $response->header('X-WP-TotalPages', $total_pages);
    
    return $response;
}

// Callback function to add a new story
function add_story($request) {
    // Verify nonce
    if (!wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
        return new WP_Error('rest_forbidden', __('Nonce verification failed'), array('status' => 403));
    }

    $params = $request->get_json_params();

    // Validate required fields
    if (empty($params['title']) || empty($params['story']) || empty($params['author']) || 
        empty($params['battleName']) || empty($params['HIVE']) || empty($params['wordCount']) || 
        empty($params['characterCount'])) {
        return new WP_Error('missing_fields', __('Missing required fields'), array('status' => 400));
    }

    // Sanitize input
    $post_data = array(
        'post_title' => sanitize_text_field($params['title']),
        'post_content' => wp_kses_post($params['story']),
        'post_author' => absint($params['author']),
        'post_type' => 'story',
        'post_status' => 'publish',
        'post_date' => current_time('mysql')
    );

    // Insert the post
    $post_id = wp_insert_post($post_data, true);

    if (is_wp_error($post_id)) {
        return new WP_Error('cant_create', $post_id->get_error_message(), array('status' => 500));
    }

    // Add tags
    $tags = array();
    
    // Add battle name as tag
    $battle_name_tag = sanitize_text_field($params['battleName']);
    wp_set_post_terms($post_id, $battle_name_tag, 'post_tag', true);
    
    // Add HIVE as tag
    $hive_tag = sanitize_text_field($params['HIVE']);
    wp_set_post_terms($post_id, $hive_tag, 'post_tag', true);

    // Add content warnings as tags if they exist
    if (!empty($params['contentWarnings']) && is_array($params['contentWarnings'])) {
        $content_warnings = array_map('sanitize_text_field', $params['contentWarnings']);
        wp_set_post_terms($post_id, $content_warnings, 'post_tag', true);
    }

    // Add custom fields with sanitization
    $meta_fields = array(
        'HIVE' => 'sanitize_text_field',
        'prompts' => 'sanitize_text_field',
        'isContentSensitive' => 'rest_sanitize_boolean',
        'contentWarnings' => 'sanitize_text_field',
        'battleName' => 'sanitize_text_field',
        'wordCount' => 'absint',
        'characterCount' => 'absint',
        'status' => 'sanitize_text_field',
        'feedback' => 'sanitize_text_field',
        'wins' => 'absint',
        'losses' => 'absint'
    );

    foreach ($meta_fields as $field => $sanitize_callback) {
        if (isset($params[$field])) {
            $value = $params[$field];
            if (is_array($value)) {
                $value = array_map($sanitize_callback, $value);
            } else {
                $value = $sanitize_callback($value);
            }
            update_post_meta($post_id, $field, $value);
        }
    }

    // Return the created story data
    $story = array(
        'id' => $post_id,
        'title' => $post_data['post_title'],
        'story' => $post_data['post_content'],
        'author' => $post_data['post_author'],
        'HIVE' => $params['HIVE'],
        'prompts' => $params['prompts'] ?? array(),
        'isContentSensitive' => $params['isContentSensitive'] ?? false,
        'contentWarnings' => $params['contentWarnings'] ?? array(),
        'battleName' => $params['battleName'],
        'wordCount' => $params['wordCount'],
        'characterCount' => $params['characterCount'],
        'status' => $params['status'] ?? 'draft',
        'feedback' => null,
        'wins' => 0,
        'losses' => 0,
        'date' => $post_data['post_date']
    );

    return new WP_REST_Response($story, 201);
}

// Callback function to update a story
function update_story($request) {
    $id = $request['id'];
    $params = $request->get_json_params();

    // Verify nonce
    if (!wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
        return new WP_Error('rest_forbidden', __('Nonce verification failed'), array('status' => 403));
    }

    // Check if post exists
    $post = get_post($id);
    if (!$post || $post->post_type !== 'story') {
        return new WP_Error('not_found', __('Story not found'), array('status' => 404));
    }

    // Validate required fields
    if (empty($params['title']) || empty($params['story']) || empty($params['author']) || 
        empty($params['battleName']) || empty($params['HIVE']) || empty($params['wordCount']) || 
        empty($params['characterCount'])) {
        return new WP_Error('missing_fields', __('Missing required fields'), array('status' => 400));
    }

    // Sanitize input
    $post_data = array(
        'ID' => $id,
        'post_title' => sanitize_text_field($params['title']),
        'post_content' => wp_kses_post($params['story']),
        'post_author' => absint($params['author']),
        'post_modified' => current_time('mysql')
    );

    // Update the post
    $updated_post_id = wp_update_post($post_data, true);

    if (is_wp_error($updated_post_id)) {
        return new WP_Error('cant_update', $updated_post_id->get_error_message(), array('status' => 500));
    }

    // Update tags
    $tags = array();
    
    // Update battle name tag
    $battle_name_tag = sanitize_text_field($params['battleName']);
    wp_set_post_terms($id, $battle_name_tag, 'post_tag', true);
    
    // Update HIVE tag
    $hive_tag = sanitize_text_field($params['HIVE']);
    wp_set_post_terms($id, $hive_tag, 'post_tag', true);

    // Update content warnings tags if they exist
    if (isset($params['contentWarnings'])) {
        $content_warnings = is_array($params['contentWarnings']) 
            ? array_map('sanitize_text_field', $params['contentWarnings'])
            : array();
        wp_set_post_terms($id, $content_warnings, 'post_tag', true);
    }

    // Update custom fields with sanitization
    $meta_fields = array(
        'HIVE' => 'sanitize_text_field',
        'prompts' => 'sanitize_text_field',
        'isContentSensitive' => 'rest_sanitize_boolean',
        'contentWarnings' => 'sanitize_text_field',
        'battleName' => 'sanitize_text_field',
        'wordCount' => 'absint',
        'characterCount' => 'absint',
        'status' => 'sanitize_text_field',
        'feedback' => 'sanitize_text_field',
        'wins' => 'absint',
        'losses' => 'absint'
    );

    foreach ($meta_fields as $field => $sanitize_callback) {
        if (isset($params[$field])) {
            $value = $params[$field];
            if (is_array($value)) {
                $value = array_map($sanitize_callback, $value);
            } else {
                $value = $sanitize_callback($value);
            }
            update_post_meta($id, $field, $value);
        }
    }

    // Return the updated story data
    $story = array(
        'id' => $id,
        'title' => $post_data['post_title'],
        'story' => $post_data['post_content'],
        'author' => $post_data['post_author'],
        'HIVE' => $params['HIVE'],
        'prompts' => $params['prompts'] ?? array(),
        'isContentSensitive' => $params['isContentSensitive'] ?? false,
        'contentWarnings' => $params['contentWarnings'] ?? array(),
        'battleName' => $params['battleName'],
        'wordCount' => $params['wordCount'],
        'characterCount' => $params['characterCount'],
        'status' => $params['status'] ?? 'draft',
        'feedback' => $params['feedback'] ?? null,
        'wins' => $params['wins'] ?? 0,
        'losses' => $params['losses'] ?? 0,
        'modified' => $post_data['post_modified']
    );

    return new WP_REST_Response($story, 200);
}

// Callback function to delete a story
function delete_story($request) {
    $id = $request['id'];

    // Verify nonce
    if (!wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
        return new WP_Error('rest_forbidden', __('Nonce verification failed'), array('status' => 403));
    }

    // Check if post exists
    $post = get_post($id);
    if (!$post || $post->post_type !== 'story') {
        return new WP_Error('not_found', __('Story not found'), array('status' => 404));
    }

    // Check if user has permission to delete this post
    if (!current_user_can('delete_post', $id)) {
        return new WP_Error('rest_forbidden', __('You do not have permission to delete this story'), array('status' => 403));
    }

    // Force delete the post
    $deleted = wp_delete_post($id, true);

    if (!$deleted) {
        return new WP_Error('cant_delete', __('Could not delete the story'), array('status' => 500));
    }

    return new WP_REST_Response(array(
        'message' => 'Story deleted successfully',
        'id' => $id
    ), 200);
}

// Callback function to get all feedback
function get_all_feedback($request) {
    $args = array(
        'post_type' => 'story',
        'posts_per_page' => -1
    );

    $query = new WP_Query($args);
    $feedback = array();

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $comments = get_comments(array(
                'post_id' => get_the_ID(),
                'status' => 'approve'
            ));
            foreach ($comments as $comment) {
                $feedback_item = array(
                    'id' => $comment->comment_ID,
                    'story' => get_the_title(),
                    'feedbackAuthor' => $comment->comment_author,
                    'content' => $comment->comment_content,
                    'isPositive' => get_comment_meta($comment->comment_ID, 'isPositive', true),
                    'isPublic' => get_comment_meta($comment->comment_ID, 'isPublic', true),
                    'isAnonymous' => get_comment_meta($comment->comment_ID, 'isAnonymous', true)
                );
                array_push($feedback, $feedback_item);
            }
        }
    }

    return new WP_REST_Response($feedback, 200);
}

/**** END STORY APIs and Functions *****/
/**** START FEEDBACK APIs and Functions *****/

// Callback function to add feedback
function add_feedback($request) {
    $params = $request->get_json_params();

    $comment_data = array(
        'comment_post_ID' => $params['storyId'],
        'comment_author' => $params['feedbackAuthor'],
        'comment_content' => $params['content'],
        'comment_approved' => 1,
    );

    $comment_id = wp_insert_comment($comment_data);

    if (is_wp_error($comment_id)) {
        return new WP_Error('cant_create', __('Cannot create feedback'), array('status' => 500));
    }

    // Add custom fields
    if (isset($params['isPositive'])) {
        update_comment_meta($comment_id, 'isPositive', $params['isPositive']);
    }
    if (isset($params['isPublic'])) {
        update_comment_meta($comment_id, 'isPublic', $params['isPublic']);
    }
    if (isset($params['isAnonymous'])) {
        update_comment_meta($comment_id, 'isAnonymous', $params['isAnonymous']);
    }

    return new WP_REST_Response('Feedback created', 201);
}

// Callback function to update feedback
function update_feedback($request) {
    $id = $request['id'];
    $params = $request->get_json_params();

    // Verify nonce
    if (!wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
        return new WP_Error('rest_forbidden', __('Nonce verification failed'), array('status' => 403));
    }

    $comment_data = array(
        'comment_ID' => $id,
        'comment_content' => $params['content'],
    );

    $updated_comment_id = wp_update_comment($comment_data);

    if (is_wp_error($updated_comment_id)) {
        return new WP_Error('cant_update', __('Cannot update feedback'), array('status' => 500));
    }

    // Update custom fields
    if (isset($params['isPositive'])) {
        update_comment_meta($id, 'isPositive', $params['isPositive']);
    }
    if (isset($params['isPublic'])) {
        update_comment_meta($id, 'isPublic', $params['isPublic']);
    }
    if (isset($params['isAnonymous'])) {
        update_comment_meta($id, 'isAnonymous', $params['isAnonymous']);
    }

    return new WP_REST_Response('Feedback updated', 200);
}

// Callback function to delete feedback
function delete_feedback($request) {
    $id = $request['id'];

    // Verify nonce
    if (!wp_verify_nonce($request->get_header('X-WP-Nonce'), 'wp_rest')) {
        return new WP_Error('rest_forbidden', __('Nonce verification failed'), array('status' => 403));
    }

    $deleted = wp_delete_comment($id, true);

    if (!$deleted) {
        return new WP_Error('cant_delete', __('Cannot delete feedback'), array('status' => 500));
    }

    return new WP_REST_Response('Feedback deleted', 200);
}

/**** SNED FEEDBACK APIs and Functions *****/
/**** START ADMIN APIs and Functions *****/

// Function to ensure the wp_options table has the correct fields first
// Register custom REST API route to get game parameters

// Initialize default options in wp_options table
function initialize_beta_hive_options() {
    // Set default values for the options if they don't exist
    if (get_option('content_warnings') === false) {
        update_option('content_warnings', array());
    }
    if (get_option('prompts') === false) {
        update_option('prompts', array());
    }
    if (get_option('battle_name') === false) {
        update_option('battle_name', 'Battle of the HIVEs');
    }
    if (get_option('beta_hive_count') === false) {
        update_option('beta_hive_count', 3);
    }
    if (get_option('calendar_event_count') === false) {
        update_option('calendar_event_count', 4);
    }
    if (get_option('content_warning_count') === false) {
        update_option('content_warning_count', 4);
    }
    if (get_option('prompts_count') === false) {
        update_option('prompts_count', 10);
    }
    if (get_option('hives') === false) {
        update_option('hives', array());
    }
    if (get_option('calendar_events') === false) {
        update_option('calendar_events', array());
    }
    if (get_option('countdown_date') === false) {
        update_option('countdown_date', '2025-04-14T00:00:00');
    }
    if (get_option('min_word_count') === false) {
        update_option('min_word_count', 250);
    }
    if (get_option('max_word_count') === false) {
        update_option('max_word_count', 1000);
    }
    if (get_option('min_prompt_selections') === false) {
        update_option('min_prompt_selections', 2);
    }
    if (get_option('num_of_losses') === false) {
        update_option('num_of_losses', 3);
    }
}
add_action('after_setup_theme', 'initialize_beta_hive_options');

// get all game content
function get_all_game_content() {
    $content_warnings = get_all_content_warnings();
    $prompts = get_all_prompts();
    $hives = get_all_hives();
    $calendar_events = get_all_calendar_events();
    $countdown_date = get_countdown_date();
    $min_word_count = get_min_word_count();
    $max_word_count = get_max_word_count();
    $min_prompt_selections = get_min_prompt_selections();
    $num_of_losses = get_num_of_losses();
    $content_warnings_count = get_content_warning_count();
    $battle_name = get_battle_name();
    $beta_hive_count = get_beta_hive_count();
    $calendar_event_count = get_calendar_event_count();
    $prompts_count = get_prompts_count();



    $game_content = array(
        'contentWarnings' => $content_warnings,
        'prompts' => $prompts,
        'hives' => $hives,
        'calendarEvents' => $calendar_events,
        'countdownDate' => $countdown_date,
        'minWordCount' => (int) $min_word_count,
        'maxWordCount' => (int) $max_word_count,
        'minPromptSelections' => (int) $min_prompt_selections,
        'numOfLosses' => (int) $num_of_losses,
        'contentWarningsCount' => (int) $content_warnings_count,
        'battleName' => $battle_name,
        'betaHIVECount' => (int) $beta_hive_count,
        'calendarEventCount' => (int) $calendar_event_count,
        'promptsCount' => (int) $prompts_count,
    );

    return new WP_REST_Response($game_content, 200);
}

// Function to get all content warnings
function get_all_content_warnings() {
    $content_warnings = get_option('content_warnings', array());
    return $content_warnings;
}

// Function to get all prompts
function get_all_prompts() {
    $prompts = get_option('prompts', array());
    return $prompts;
}

// Function to get all HIVEs
function get_all_hives() {
    $hives = get_option('hives', array());
    return $hives;
}

// Function to get all calendar events
function get_all_calendar_events() {
    $events = get_option('calendar_events', array());
    return $events;
}

// Function to get countdown date
function get_countdown_date() {
    $countdown_date = get_option('countdown_date', '');
    return $countdown_date;
}

// Function to get min word count
function get_min_word_count() {
    $min_word_count = get_option('min_word_count', '');
    return $min_word_count;
}

// Function to get max word count
function get_max_word_count() {
    $max_word_count = get_option('max_word_count', '');
    return $max_word_count;
}

// Function to get battle name
function get_battle_name() {
    $battle_name = get_option('battle_name', '');
    return $battle_name;
}

// Function to get beta hive count
function get_beta_hive_count() {
    $beta_hive_count = get_option('beta_hive_count', '');
    return $beta_hive_count;
}

// Function to get calendar event count
function get_calendar_event_count() {
    $calendar_event_count = get_option('calendar_event_count', '');
    return $calendar_event_count;
}

// Function to get content warning count
function get_content_warning_count() {
    $content_warning_count = get_option('content_warning_count', '');
    return $content_warning_count;
}

// Function to get min prompt selections
function get_min_prompt_selections() {
    $min_prompt_selections = get_option('min_prompt_selections', '');
    return $min_prompt_selections;
}

// Function to get number of losses
function get_num_of_losses() {
    $num_of_losses = get_option('num_of_losses', '');
    return $num_of_losses;
}

// Function to get prompts count
function get_prompts_count() {
    $prompts_count = get_option('prompts_count', '');
    return $prompts_count;
}

// Function to update content warnings
function update_content_warnings($request) {
    $params = $request->get_json_params();
    if (isset($params['contentWarnings']) && is_array($params['contentWarnings'])) {
        if (get_option('content_warnings') !== false) {
            update_option('content_warnings', $params['contentWarnings']);
            return new WP_REST_Response('Content warnings updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Function to update prompts
function update_prompts($request) {
    $params = $request->get_json_params();
    if (isset($params['prompts']) && is_array($params['prompts'])) {
        if (get_option('prompts') !== false) {
            update_option('prompts', $params['prompts']);
            return new WP_REST_Response('Prompts updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Function to update min word count
function update_min_word_count($request) {
    $params = $request->get_json_params();
    if (isset($params['minWordCount'])) {
        update_option('min_word_count', $params['minWordCount']);
    }
    return new WP_REST_Response('Min word count updated', 200);
}

// Function to update max word count
function update_max_word_count($request) {
    $params = $request->get_json_params();
    if (isset($params['maxWordCount'])) {
        update_option('max_word_count', $params['maxWordCount']);
    }
    return new WP_REST_Response('Max word count updated', 200);
}

// Function to update minimum prompt selections
function update_min_prompt_selections($request) {
    $params = $request->get_json_params();
    if (isset($params['minPromptSelections'])) {
        update_option('min_prompt_selections', $params['minPromptSelections']);
    }
    return new WP_REST_Response('Minimum prompt selections updated', 200);
}

// Function to update countdown date
function update_countdown_date($request) {
    $params = $request->get_json_params();
    if (isset($params['countdownDate'])) {
        update_option('countdown_date', $params['countdownDate']);
    }
    return new WP_REST_Response('Countdown date updated', 200);
}

// Function to update all calendar events
function update_calendar_events($request) {
    $params = $request->get_json_params();
    if (isset($params['calendarEvents']) && is_array($params['calendarEvents'])) {
        if (get_option('calendar_events') !== false) {
            update_option('calendar_events', $params['calendarEvents']);
            return new WP_REST_Response('Calendar events updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Function to update all HIVEs
function update_hives($request) {
    $params = $request->get_json_params();
    if (isset($params['hives']) && is_array($params['hives'])) {
        if (get_option('hives') !== false) {
            update_option('hives', $params['hives']);
            return new WP_REST_Response('HIVEs updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Function to update battle name
function update_battle_name($request) {
    $params = $request->get_json_params();
    if (isset($params['battleName'])) {
        if (get_option('battle_name') !== false) {
            update_option('battle_name', $params['battleName']);
            return new WP_REST_Response('Battle name updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Function to update beta hive count
function update_beta_hive_count($request) {
    $params = $request->get_json_params();
    if (isset($params['betaHIVECount'])) {
        if (get_option('beta_hive_count') !== false) {
            update_option('beta_hive_count', $params['betaHIVECount']);
            return new WP_REST_Response('Beta hive count updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Function to update calendar event count
function update_calendar_event_count($request) {
    $params = $request->get_json_params();
    if (isset($params['calendarEventCount'])) {
        if (get_option('calendar_event_count') !== false) {
            update_option('calendar_event_count', $params['calendarEventCount']);
            return new WP_REST_Response('Calendar event count updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Function to update content warning count
function update_content_warning_count($request) {
    $params = $request->get_json_params();
    if (isset($params['contentWarningCount'])) {
        if (get_option('content_warning_count') !== false) {
            update_option('content_warning_count', $params['contentWarningCount']);
            return new WP_REST_Response('Content warning count updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Function to update prompts count
function update_prompts_count($request) {
    $params = $request->get_json_params();
    if (isset($params['promptsCount'])) {
        if (get_option('prompts_count') !== false) {
            update_option('prompts_count', $params['promptsCount']);
            return new WP_REST_Response('Prompts count updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Function to update number of losses
function update_num_of_losses($request) {
    $params = $request->get_json_params();
    if (isset($params['numOfLosses'])) {
        if (get_option('num_of_losses') !== false) {
            update_option('num_of_losses', $params['numOfLosses']);
            return new WP_REST_Response('Number of losses updated', 200);
        } else {
            return new WP_Error('option_not_found', __('Option not found'), array('status' => 404));
        }
    }
    return new WP_Error('invalid_request', __('Invalid request'), array('status' => 400));
}

// Register story submission WP REST API routes
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/stories', array(
        'methods' => 'GET',
        'callback' => 'get_all_stories',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('custom/v1', '/stories', array(
        'methods' => 'POST',
        'callback' => 'add_story',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
    ));

    register_rest_route('custom/v1', '/stories/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => 'update_story',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
        'args' => array(
            'id' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
            '_wpnonce' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return wp_verify_nonce($param, 'wp_rest');
                }
            )
        )
    ));

    register_rest_route('custom/v1', '/stories/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_story',
        'permission_callback' => function () {
            return current_user_can('delete_posts');
        },
        'args' => array(
            'id' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
            '_wpnonce' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return wp_verify_nonce($param, 'wp_rest');
                }
            )
        )
    ));
});

// Register feedback submission WP REST API routes
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/feedback', array(
        'methods' => 'GET',
        'callback' => 'get_all_feedback',
        'permission_callback' => '__return_true',
    ));

    register_rest_route('custom/v1', '/feedback', array(
        'methods' => 'POST',
        'callback' => 'add_feedback',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
    ));

    register_rest_route('custom/v1', '/feedback/(?P<id>\d+)', array(
        'methods' => 'PUT',
        'callback' => 'update_feedback',
        'permission_callback' => function () {
            return current_user_can('edit_posts');
        },
        'args' => array(
            'id' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
            '_wpnonce' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return wp_verify_nonce($param, 'wp_rest');
                }
            )
        )
    ));

    register_rest_route('custom/v1', '/feedback/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_feedback',
        'permission_callback' => function () {
            return current_user_can('delete_posts');
        },
        'args' => array(
            'id' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
            '_wpnonce' => array(
                'validate_callback' => function ($param, $request, $key) {
                    return wp_verify_nonce($param, 'wp_rest');
                }
            )
        )
    ));
});

// Register admin functions WP REST API routes
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/update_battle_name', array(
        'methods' => 'POST',
        'callback' => 'update_battle_name',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ));
    register_rest_route('custom/v1', '/update_beta_hive_count', array(
        'methods' => 'POST',
        'callback' => 'update_beta_hive_count',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ));
    register_rest_route('custom/v1', '/update_calendar_event_count', array(
        'methods' => 'POST',
        'callback' => 'update_calendar_event_count',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ));
    register_rest_route('custom/v1', '/update_content_warning_count', array(
        'methods' => 'POST',
        'callback' => 'update_content_warning_count',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ));
    register_rest_route('custom/v1', '/update_prompts_count', array(
        'methods' => 'POST',
        'callback' => 'update_prompts_count',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ));
    register_rest_route('custom/v1', '/update_num_of_losses', array(
        'methods' => 'POST',
        'callback' => 'update_num_of_losses',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        },
    ));
	register_rest_route('custom/v1', '/update_prompts', array(
		'methods' => 'POST',
		'callback' => 'update_prompts',
		'permission_callback' => function () {
			return current_user_can('manage_options');
		},
	));
	register_rest_route('custom/v1', '/update_content_warnings', array(
		'methods' => 'POST',
		'callback' => 'update_content_warnings',
		'permission_callback' => function () {
			return current_user_can('manage_options');
		},
	));
	register_rest_route('custom/v1', '/update_min_word_count', array(
		'methods' => 'POST',
		'callback' => 'update_min_word_count',
		'permission_callback' => function () {
			return current_user_can('manage_options');
		},
	));
	register_rest_route('custom/v1', '/update_max_word_count', array(
		'methods' => 'POST',
		'callback' => 'update_max_word_count',
		'permission_callback' => function () {
			return current_user_can('manage_options');
		},
	));
	register_rest_route('custom/v1', '/update_min_prompt_selections', array(
		'methods' => 'POST',
		'callback' => 'update_min_prompt_selections',
		'permission_callback' => function () {
			return current_user_can('manage_options');
		},
	));
	register_rest_route('custom/v1', '/update_countdown_date', array(
		'methods' => 'POST',
		'callback' => 'update_countdown_date',
		'permission_callback' => function () {
			return current_user_can('manage_options');
		},
	));
	register_rest_route('custom/v1', '/update_calendar_events', array(
		'methods' => 'POST',
		'callback' => 'update_calendar_events',
		'permission_callback' => function () {
			return current_user_can('manage_options');
		},
	));
	register_rest_route('custom/v1', '/update_hives', array(
		'methods' => 'POST',
		'callback' => 'update_hives',
		'permission_callback' => function () {
			return current_user_can('manage_options');
		},
	));
    register_rest_route('custom/v1', '/game_content', array(
        'methods' => 'GET',
        'callback' => 'get_all_game_content',
        'permission_callback' => '__return_true',
    ));
});
?>