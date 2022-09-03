import { Component, onMount } from 'solid-js';

import styles from './App.module.scss';
import Terminal from './coreCmp/Terminal/Terminal';
import Header from './coreCmp/Header/Header';
import Modal from './coreCmp/Modal/Modal';
import KeyBoard from './coreCmp/KeyBoard/KeyBoard';

const App: Component = () => {
  onMount(() => {
    document.addEventListener('contextmenu', event => event.preventDefault());
  })
  return (
    <div class={styles.App}>
      <Header />
      <main>
        <Terminal />
        <KeyBoard />
      </main>
      <Modal />
    </div>
  );
};

export default App;
