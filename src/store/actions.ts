import { setModal } from "./reducer";

export const openModal = (title: string, childComponent: any) => {
    setModal((modal) => ({...modal, title, childComponent, isOpen: true }));
};

export const closeModal = () => {
    setModal((modal) => ({...modal, isOpen: false}));
}