import { Component, createSignal, For } from 'solid-js';
import styles from './KeyBoard.module.scss';
import keys from './keys.json';
import keyManager from '../../managers/keyManager';

const KeyBoard: Component = () => {
  const [langIdx, setLangIdx] = createSignal(1);
  const [isShiftOn, setIsShiftOn] = createSignal(false);

  console.log(keys[langIdx()])
  return (
    <section class={styles.keyboardWrapper}>
      <section class={styles.keyboard}>
        {!isShiftOn() ? keys[langIdx()].layout.map((line: string) => (
          <div>
            {line.split(' ').map((value: string) => <KeyBtn value={value} />)}
          </div>))
        : keys[langIdx()].shiftedLayout.map((line: string) => (
          <div>
            {line.split(' ').map((value: string) => <KeyBtn value={value} />)}
          </div>))
        }
      </section>
    </section>
  );
};

const KeyBtn: any = (value: any) => {
  return (
    <button onClick={() => keyManager.keyPressed(value.value)} class={styles.keybutton}>
      {value.value}
    </button>
  )
}

export default KeyBoard;
