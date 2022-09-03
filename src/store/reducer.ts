import { createStore } from "solid-js/store";

export const [modal, setModal] = createStore({title: '', childComponent: null, isOpen: false, closeButton: true});
