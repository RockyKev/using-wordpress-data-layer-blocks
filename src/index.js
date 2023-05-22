import { Button, TextControl, Modal, SearchControl, Spinner, SnackbarList } from "@wordpress/components";
import { useState, render } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { decodeEntities } from "@wordpress/html-entities";
import { store as noticesStore } from "@wordpress/notices";

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
      <Notifications />
      <div className="list-controls">
        <SearchControl onChange={setSearchTerm} value={searchTerm} />
        <CreatePageButton />
      </div>
      <PageList hasResolved={hasResolved} pages={pages} />
    </div>
  );
}

function Notifications() {
  const notices = useSelect((select) => select(noticesStore).getNotices(), []);

  const { removeNotice } = useDispatch(noticesStore);
  const snackbarNotices = notices.filter(({ type }) => type === "snackbar");

  return (
    <SnackbarList notices={snackbarNotices} className="components-editor-notices_snackbar" onRemove={removeNotice} />
  );
}

const DeletePageButton = ({ pageId }) => {

  const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);

  const { getLastEntityDeleteError } = useSelect(coreDataStore);

  const handleDelete = async () => {
    const success = await deleteEntityRecord("postType", "page", pageId);

    if (success) {
      createSuccessNotice("The page was deleted", {
        type: "snackbar",
      });
    } else {
      const lastError = getLastEntityDeleteError("postType", "page", pageId);
      const message = (lastError?.message || "There was an error") + " Please refresh the page and try again.";

      createErrorNotice(message, {
        type: "snackbar",
      });
    }
  };

  const { deleteEntityRecord } = useDispatch(coreDataStore);
  const { isDeleting } = useSelect(
    (select) => ({
      isDeleting: select(coreDataStore).isDeletingEntityRecord("postType", "page", pageId),
    }),
    [pageId]
  );

  // error checking

  return (
    <Button variant="primary" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? (
        <>
          <Spinner />
          Dleting...
        </>
      ) : (
        "Delete"
      )}
    </Button>
  );
};

function CreatePageButton() {
  const [isOpen, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <>
      <Button onClick={openModal} variant="primary">
        Create a New Page
      </Button>

      {isOpen && (
        <Modal onRequestClose={closeModal} title="Create a new page">
          <CreatePageForm onCancel={closeModal} onSaveFinished={closeModal} />
        </Modal>
      )}
    </>
  );
}

function CreatePageForm({ onSaveFinished, onCancel }) {
  const [title, setTitle] = useState();
  const { lastError, isSaving } = useSelect(
    (select) => ({
      lastError: select(coreDataStore).getLastEntitySaveError("postType", "page"),
      isSaving: select(coreDataStore).isSavingEntityRecord("postType", "page"),
    }),
    []
  );

  const { saveEntityRecord } = useDispatch(coreDataStore);

  const handleSave = async () => {
    const savedRecord = await saveEntityRecord("postType", "page", { title, status: "publish" });

    if (savedRecord) {
      onSaveFinished();
    }
  };

  return (
    <PageForm
      title={title}
      onChangeTitle={setTitle}
      hasEdits={!!title}
      onSave={handleSave}
      lastError={lastError}
      onCancel={onCancel}
      isSaving={isSaving}
    />
  );
}

export function EditPageForm({ pageId, onCancel, onSaveFinished }) {
  // three steps
  // 1 - get the content
  // 2 - create a 'edit' state.
  // 3 - create a 'save the edit' state

  // get the content and any errors involved
  const { page, lastError, isSaving, hasEdits } = useSelect(
    (select) => ({
      page: select(coreDataStore).getEditedEntityRecord("postType", "page", pageId),
      lastError: select(coreDataStore).getLastEntitySaveError("postType", "page", pageId),
      isSaving: select(coreDataStore).isSavingEntityRecord("postType", "page", pageId),
      hasEdits: select(coreDataStore).hasEditsForEntityRecord("postType", "page", pageId),
    }),
    [pageId]
  );

  const { saveEditedEntityRecord, editEntityRecord } = useDispatch(coreDataStore);

  // Make the edits
  const handleChange = (title) => editEntityRecord("postType", "page", pageId, { title });

  // save the edits
  const handleSave = async () => {
    const savedRecord = await saveEditedEntityRecord("postType", "page", pageId);
    if (savedRecord) {
      onSaveFinished();
    }
  };

  return (
    <PageForm
      title={page.title}
      onChangeTitle={handleChange}
      hasEdits={hasEdits}
      lastError={lastError}
      isSaving={isSaving}
      onCancel={onCancel}
      onSave={handleSave}
    />
  );
}

export function PageForm({ title, onChangeTitle, hasEdits, lastError, isSaving, onCancel, onSave }) {
  return (
    <div className="my-gutenberg-form">
      <TextControl label="Page title:" value={title} onChange={onChangeTitle} />

      <>{lastError ? <div className="form-error">Error: {lastError.message}</div> : false}</>

      <div className="form-buttons">
        <Button onClick={onSave} variant="primary" disabled={!hasEdits || isSaving}>
          {isSaving ? (
            <>
              <Spinner />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Button onClick={onCancel} variant="tertiary">
          Cancel
        </Button>
      </div>
    </div>
  );
}

function EditPageButton({ pageId }) {
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
          <EditPageForm pageId={pageId} onCancel={closeModal} onSaveFinished={closeModal} />
        </Modal>
      )}
    </>
  );
}

// TODO: offer as a sacrifice
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
              <div className="form-buttons rocky">
                <EditPageButton pageId={page.id} />
                <DeletePageButton pageId={page.id} />
              </div>
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
