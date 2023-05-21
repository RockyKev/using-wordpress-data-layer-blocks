import { render } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { store as coreDataStore } from "@wordpress/core-data";
import { decodeEntities } from '@wordpress/html-entities';

function MyFirstApp() {
  //   const pages = [{ id: "mock", title: "The Sample Page?" }];
  const pages = useSelect((select) => select(coreDataStore).getEntityRecords("postType", "page"), []);
  console.log("Here I go!");
  console.log(pages);

  return <PageList pages={pages} />;
}

function PageList({ pages }) {
  return (
    <ul>
      {pages?.map((page) => (
        <li key={page.id}>{ decodeEntities( page.title.rendered ) }</li>
      ))}
    </ul>
  );
}

window.addEventListener(
  "load",
  () => {
    render(<MyFirstApp />, document.querySelector("#my-first-gutenberg-app"));
  },
  false
);
