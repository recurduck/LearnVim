import { Component, createEffect, createSignal, JSXElement, onMount } from 'solid-js';
import { closeModal } from '../../store/actions';
import { modal } from '../../store/reducer';
import styles from './Modal.module.scss';

const Modal: Component = () => {
    return (
        <div class={`modal ${modal.isOpen ? styles.screen : styles.closed}`} onClick={closeModal}>
            {modal.isOpen && <div class={styles.window}>

                    <div class={styles.bar} onClick={() => closeModal()}>
                        <div class={styles.btns} />
                        <p>{modal.title}</p>
                    </div>
                    <div class={styles.body} onClick={e=>e.stopPropagation()}>
                        {modal.childComponent}
                    </div>

            </div>}
        </div>
    );
};

export default Modal;
