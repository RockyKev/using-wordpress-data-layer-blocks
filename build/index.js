(()=>{"use strict";const e=window.wp.element,t=window.wp.components,n=window.wp.data,a=window.wp.coreData,l=window.wp.htmlEntities;function r(){const[l,r]=(0,e.useState)(""),{pages:s,hasResolved:o}=(0,n.useSelect)((e=>{const t={};l&&(t.search=l);const n=["postType","page",t];return{pages:e(a.store).getEntityRecords(...n),hasResolved:e(a.store).hasFinishedResolution("getEntityRecords",n)}}),[l]);return(0,e.createElement)("div",null,(0,e.createElement)(t.SearchControl,{onChange:r,value:l}),(0,e.createElement)(i,{hasResolved:o,pages:s}))}function s(l){let{pageId:r,onCancel:s,onSaveFinished:o}=l;const{lastError:i,page:c}=(0,n.useSelect)((e=>({page:e(a.store).getEditedEntityRecord("postType","page",r),lastError:e(a.store).getLastEntitySaveError("postType","page",r)})),[r]),{editEntityRecord:d}=(0,n.useDispatch)(a.store),{saveEditedEntityRecord:m}=(0,n.useDispatch)(a.store);return(0,e.createElement)("div",{className:"my-gutenberg-form"},(0,e.createElement)(t.TextControl,{label:"Page title:",value:c.title,onChange:e=>d("postType","page",r,{title:e})}),(0,e.createElement)(e.Fragment,null,!!i&&(0,e.createElement)("div",{className:"form-error"},"Error: ",i.message)),(0,e.createElement)("div",{className:"form-buttons"},(0,e.createElement)(t.Button,{onClick:async()=>{await m("postType","page",r)&&o()},variant:"primary"},"Save"),(0,e.createElement)(t.Button,{onClick:s,variant:"tertiary"},"Cancel")))}function o(n){let{pageId:a}=n;const[l,r]=(0,e.useState)(!1),o=()=>r(!1);return(0,e.createElement)(e.Fragment,null,(0,e.createElement)(t.Button,{onClick:()=>r(!0),variant:"primary"},"Edit"),l&&(0,e.createElement)(t.Modal,{onRequestClose:o,title:"Edit page"},(0,e.createElement)(s,{pageId:a,onCancel:o,onSaveFinish:o})))}function i(n){let{hasResolved:a,pages:r}=n;return a?r?.length?(0,e.createElement)("table",{className:"wp-list-table widefat fixed striped table-view-list"},(0,e.createElement)("thead",null,(0,e.createElement)("tr",null,(0,e.createElement)("td",null,"Title"),(0,e.createElement)("td",{style:{width:120}},"Actions"))),(0,e.createElement)("tbody",null,r?.map((t=>(0,e.createElement)("tr",{key:t.id},(0,e.createElement)("td",null,(0,l.decodeEntities)(t.title.rendered)),(0,e.createElement)("td",null,(0,e.createElement)(o,{pageId:t.id}))))))):(0,e.createElement)("div",null,"No results"):(0,e.createElement)(t.Spinner,null)}window.addEventListener("load",(()=>{(0,e.render)((0,e.createElement)(r,null),document.querySelector("#my-first-gutenberg-app"))}),!1)})();