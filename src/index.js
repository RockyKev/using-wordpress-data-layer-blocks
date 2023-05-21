import { Button, TerxtControl, SearchControl, Spinner } from "@wordpress/components";
import { useState, render } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";


// TODO: rename this
function MyFirstApp() {
  const [searchTerm, setSearchTerm] = useState("");

  // Getting the search request and passing the data back
  const { pages, hasResolved } = useSelect(
    (select) => {
      const query = {};

      if (searchTerm) {
        query.search = searchTerm;
      }

      const selectorArguments = ["postType", "page", query];

      // making the requests to the WP store
      const response = {
        pages: select(coreDataStore).getEntityRecords(...selectorArguments),
        hasResolved: select(coreDataStore).hasFinishedResolution("getEntityRecords", selectorArguments),
      };

      return response;
    },
    [searchTerm]
  );



  // the markup
  return (
    <div>
      <SearchControl onChange={setSearchTerm} value={searchTerm} />
      <PageList hasResolved={hasResolved} pages={pages} />
    </div>
  );
}


const PageEditButton = () => (
    <Button variant="primary">
        Edit
    </Button>
);



function PageList({ hasResolved, pages }) {
  if (!hasResolved) {
    return <Spinner />;
  }

  if (!pages?.length) {
    return <div>No results</div>;
  }

  return (
    <table className="wp-list-table widefat fixed striped table-view-list">
      <thead>
        <tr>
          <td>Title</td>
          <td style={{ width: 120}}>Actions</td>
        </tr>
      </thead>
      <tbody>
        {pages?.map((page) => (
          <tr key={page.id}>
            <td>{decodeEntities(page.title.rendered)}</td>
            <td><PageEditButton pageId={ page.id } /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}



window.addEventListener(
  "load",
  () => {
    render(<MyFirstApp />, document.querySelector("#my-first-gutenberg-app"));
  },
  false
);
