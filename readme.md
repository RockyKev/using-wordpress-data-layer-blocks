## Using the data layer

This course: https://learn.wordpress.org/course/using-the-wordpress-data-layer/

This plugin walks you through the data layer of WordPress using Blocks and JSX. 

It does the following: 
* Uses wordpress-scripts
* Builds a option page
* Uses React & JSX
* Using the `wp.data` object in devtools
* Retrieving data from the WP store `@wordpress/core-data`, versus the API
* Using `@wordpress/components` like the search bar, the spinner
* Using `@


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

Secondly, every keystroke would trigger an API request. If you typed About, deleted it, and retyped it, it would issue 10 requests in total even though we could reuse the data. Gutenberg data helps by caching the responses to API requests triggered by getEntityRecords() and reuses them on subsequent calls. This is especially important when other components rely on the same entity records.

All in all, the utilities built into core-data are designed to solve the typical problems so that you can focus on your application instead.