import { render } from "@wordpress/element";

function MyFirstApp() {
    return <span>Hello From JavaScript</span>;
}

window.addEventListener('load', () => {
    render (<MyFirstApp />, document.querySelector('#my-first-gutenberg-app'))
}, false);

