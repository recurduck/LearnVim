import { Component, createEffect, createSignal, onMount } from 'solid-js';
import fileManager from '../../managers/fileManager';
import keyManager from '../../managers/keyManager';
import VimMonitor from '../VimMonitor/VimMonitor';
import styles from './Terminal.module.scss';
import template from './TerminalTemplateTxt';

const Terminal: Component = () => {
    const [str, setStr] = createSignal(template);
    const [line, setLine] = createSignal(0);
    const [idx, setIdx] = createSignal(0);
    const [length, setLength] = createSignal(1);
    const [status, setStatus] = createSignal('normal')
    const [isKeyboardOpen, setIsKeyboardOpen] = createSignal(false)
    let content: HTMLPreElement | undefined;
    onMount(() => {
        keyManager.init(str, setStr, idx, line, setIdx, setLine, status, setStatus)
        window.addEventListener('keydown', (e) => {
            e.preventDefault();
            onKeyPress(e)
        });
        
        fileManager.init(setStr)
        
        
        
        // document.getElementById('inputKeys')?.focus();
        // setIsKeyboardOpen(true);

    })

    const getContentWithMark = (str: any, idx: number, lineNum: number) => {
        return str.map((line: string, lineIdx: number) => {
            if (lineIdx === lineNum) {
                return [
                    line.substring(0, idx),
                    <mark id='focus'>{line.substring(idx, idx + length())}</mark>,
                    line.substring(idx + length(), line.length) + '\n'
                ]
            }
            return line + '\n'
        })
    }

    const onKeyPress = (ev: KeyboardEvent) => {
        ev.stopPropagation();
        keyManager.keyPressed(ev.key)
    }

    const getStatus = () => {
        switch (status()) {
            case 'insert':
                return '-- Insert --'
            default: return ''
        }
    }
    createEffect(() => {

        // const { scrollHeight, offsetHeight, scrollTop } = content;
        // console.log(`${str()} ${idx()} ${line()}`?.indexOf('0'), Math.floor((scrollTop+offsetHeight)/scrollHeight*100));
        document?.getElementById('focus')?.scrollIntoView({ block: 'nearest', inline: "nearest" })
    });

    return (
        <div class={`${styles.window} ${isKeyboardOpen()?styles.keyboardOpen:''}`}>
            <div class={styles.bar}>
                <div class={styles.btns} />
            </div>
            <div class={styles.body}>
                <pre class={styles.content} ref={content} id="output">
                    {/* <LineList lines={str} /> */}
                    {getContentWithMark(str(), idx(), line())}
                </pre>
                <VimMonitor status={getStatus} lineIdx={line} idx={idx} content={content} />
            </div>
            {/* <input type="text" id="inputKeys" /> */}
        </div>
    );
};

export default Terminal;
