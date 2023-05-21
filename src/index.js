import { Button, TextControl, Modal, SearchControl, Spinner } from "@wordpress/components";
import { useState, render } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
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

export function EditPageForm({ pageId, onCancel, onSaveFinished }) {
  // three steps
  // 1 - get the content
  // 2 - create a 'edit' state.
  // 3 - create a 'save the edit' state

  // get the content
  //   const page = useSelect((select) => select(coreDataStore).getEditedEntityRecord("postType", "page", pageId), [pageId]);

  // get the content and any errors involved
  const { lastError, page } = useSelect(
    (select) => ({
      page: select(coreDataStore).getEditedEntityRecord("postType", "page", pageId),
      lastError: select(coreDataStore).getLastEntitySaveError("postType", "page", pageId),
    }),
    [pageId]
  );

  // Make the edits
  const { editEntityRecord } = useDispatch(coreDataStore);
  const handleChange = (title) => editEntityRecord("postType", "page", pageId, { title });

  // save the edits
  const { saveEditedEntityRecord } = useDispatch(coreDataStore);
  const handleSave = async () => {
    const updatedRecord = await saveEditedEntityRecord("postType", "page", pageId);

    if (updatedRecord) {
      onSaveFinished();
    }
  };

  return (
    <div className="my-gutenberg-form">
      <TextControl label="Page title:" value={page.title} onChange={handleChange} />

      <>{lastError ? 
      <div className="form-error">Error: {lastError.message}</div> : false}</>

      <div className="form-buttons">
        <Button onClick={handleSave} variant="primary">
          Save
        </Button>
        <Button onClick={onCancel} variant="tertiary">
          Cancel
        </Button>
      </div>
    </div>
  );
}

// const PageEditButton = () => <Button variant="primary">Edit</Button>;

function PageEditButton({ pageId }) {
  const [isOpen, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Button onClick={openModal} variant="primary">
        Edit
      </Button>
      {isOpen && (
        <Modal onRequestClose={closeModal} title="Edit page">
          <EditPageForm pageId={pageId} onCancel={closeModal} onSaveFinish={closeModal} />
        </Modal>
      )}
    </>
  );
}

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
          <td style={{ width: 120 }}>Actions</td>
        </tr>
      </thead>
      <tbody>
        {pages?.map((page) => (
          <tr key={page.id}>
            <td>{decodeEntities(page.title.rendered)}</td>
            <td>
              <PageEditButton pageId={page.id} />
            </td>
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
