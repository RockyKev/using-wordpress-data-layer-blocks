(()=>{"use strict";const e=window.wp.element,t=window.wp.components,n=window.wp.data,l=window.wp.coreData,a=window.wp.htmlEntities;function r(){const[a,r]=(0,e.useState)(""),{pages:s,hasResolved:i}=(0,n.useSelect)((e=>{const t={};a&&(t.search=a);const n=["postType","page",t];return{pages:e(l.store).getEntityRecords(...n),hasResolved:e(l.store).hasFinishedResolution("getEntityRecords",n)}}),[a]);return(0,e.createElement)("div",null,(0,e.createElement)(t.SearchControl,{onChange:r,value:a}),(0,e.createElement)(d,{hasResolved:i,pages:s}))}const s=()=>(0,e.createElement)(t.Button,{variant:"primary"},"Edit");function d(n){let{hasResolved:l,pages:r}=n;return l?r?.length?(0,e.createElement)("table",{className:"wp-list-table widefat fixed striped table-view-list"},(0,e.createElement)("thead",null,(0,e.createElement)("tr",null,(0,e.createElement)("td",null,"Title"),(0,e.createElement)("td",{style:{width:120}},"Actions"))),(0,e.createElement)("tbody",null,r?.map((t=>(0,e.createElement)("tr",{key:t.id},(0,e.createElement)("td",null,(0,a.decodeEntities)(t.title.rendered)),(0,e.createElement)("td",null,(0,e.createElement)(s,{pageId:t.id}))))))):(0,e.createElement)("div",null,"No results"):(0,e.createElement)(t.Spinner,null)}window.addEventListener("load",(()=>{(0,e.render)((0,e.createElement)(r,null),document.querySelector("#my-first-gutenberg-app"))}),!1)})();