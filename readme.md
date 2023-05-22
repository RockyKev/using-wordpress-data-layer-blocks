## Using the data layer

This course: https://learn.wordpress.org/course/using-the-wordpress-data-layer/

This plugin walks you through the data layer of WordPress using Blocks and JSX. 

It does the following: 

Setting up the environment - 

* Uses wordpress-scripts
* Builds a option page
* Uses React & JSX

Retrieving WP data records

* Using the `wp.data` object in devtools
* Retrieving data from the WP store `@wordpress/core-data`, versus the API
* Using `@wordpress/components` like the search bar, the spinner
* Using `getEntityRecord` within the `wp.data.select('core')` data object.

Editing the WP data records

* Using `wp.data.dispatch('core').editEntityRecord` over `useState`
* Using `wp.data.dispatch('core').saveEditedEntityRecord` over `useState`
* Using `wp.data.select('core').getEditedEntityRecord` to see the changes
* Using `getLastEntitySaveError` for error checking

Creating new WP data records

* Using React `useState` for any brand new records (as opposed to editNewEntryRecord)

## Notes

### Retrieving WordPress Data Records
https://learn.wordpress.org/lesson/retrieving-wordpress-data-records/

Using core-data instead vs calling the API directly
Let’s take a pause for a moment to consider the downsides of an alternative approach we could have taken – working with the API directly. Imagine we sent the API requests directly:

```js
import { apiFetch } from '@wordpress/api-fetch';
function MyFirstApp() {
    // ...
    const [pages, setPages] = useState( [] );
    useEffect( () => {
        const url = '/wp-json/wp/v2/pages?search=' + searchTerm;
        apiFetch( { url } )
            .then( setPages )
    }, [searchTerm] );
    // ...
}
```
Working outside of core-data, we would need to solve two problems here.

Firstly, out-of-order updates. Searching for „About” would trigger five API requests filtering for A, Ab, Abo, Abou, and About. These requests could finish in a different order than they started. It is possible that search=A would resolve after search=About and thus we’d display the wrong data. Gutenberg data helps by handling the asynchronous part behind the scenes. useSelect remembers the most recent call and returns only the data we expect.

Secondly, every keystroke would trigger an API request. If you typed About, deleted it, and retyped it, it would issue 10 requests in total even though we could reuse the data. Gutenberg data helps by caching the responses to API requests triggered by `getEntityRecords()` and reuses them on subsequent calls. This is especially important when other components rely on the same entity records.

All in all, the utilities built into core-data are designed to solve the typical problems so that you can focus on your application instead.

### Editing WordPress data records
```js
// We need a valid page ID to call editEntityRecord, so let's get the first available one using getEntityRecords.
const pageId = wp.data.select( 'core' ).getEntityRecords( 'postType', 'page' )[0].id;
 
// Update the title
wp.data.dispatch( 'core' ).editEntityRecord( 'postType', 'page', pageId, { title: 'updated title' } );
```

At this point, you may ask how is editEntityRecord better than useState? The answer is that it offers a few features you wouldn’t otherwise get.

Firstly, we can save the changes as easily as we retrieve the data and ensure that all caches will be correctly updated.

Secondly, the changes applied via editEntityRecord are easily undo-able via the undo and redo actions.

Lastly, because the changes live in the Redux state, they are “global” and can be accessed by other components. For example, we could make the PagesList display the currently edited title.

To that last point, let’s see what happens when we use getEntityRecord to access the entity record we just updated:


`wp.data.select( 'core' ).getEntityRecord( 'postType', 'page', pageId ).title`

It doesn’t reflect the edits. What’s going on?

Well, `<PagesList />` renders the data returned by getEntityRecord(). If getEntityRecord() reflected the updated title, then anything the user types in the TextControl would be immediately displayed inside `<PagesList />`, too. This is not what we want. The edits shouldn’t leak outside the form until the user decides to save them.

Gutenberg Data solves this problem by making a distinction between Entity Records and Edited Entity Records. Entity Records reflect the data from the API and ignore any local edits, while Edited Entity Records also have all the local edits applied on top. Both co-exist in the Redux state at the same time.

Let’s see what happens if we call getEditedEntityRecord:

`wp.data.select( 'core' ).getEditedEntityRecord( 'postType', 'page', pageId ).title`
// "updated title"
 
```js
wp.data.select( 'core' ).getEntityRecord( 'postType', 'page', pageId ).title
// { "rendered": "<original, unchanged title>", "raw": "..." }
```

As you can see, the title of an Entity Record is an object, but the title of an Edited Entity record is a string.

This is no accident. Fields like title, excerpt, and content may contain shortcodes or dynamic blocks, which means they can only be rendered on the server. For such fields, the REST API exposes both the raw markup and the rendered string. For example, in the block editor, content.rendered could be used as a visual preview, and content.raw could be used to populate the code editor.

