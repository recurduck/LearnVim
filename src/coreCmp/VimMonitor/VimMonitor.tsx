import { Accessor, Component, createEffect, createSignal } from "solid-js";

import styles from '../Terminal/Terminal.module.scss';

const getCurrentFileLocation = (content: HTMLPreElement, lineIdx: number, idx: number) => {
    const { scrollHeight, offsetHeight, scrollTop } = content || undefined;
    const percentPageReaded = Math.floor((scrollTop+offsetHeight)/scrollHeight*100)
    // console.log('scrollHeight, offsetHeight, scrollTop, percentPageReaded')
    // console.log(scrollHeight, offsetHeight, scrollTop, percentPageReaded)
    if(scrollHeight === offsetHeight) return 'ALL'
    switch(true) {
        case percentPageReaded === 100: return 'Bot'
        case percentPageReaded > 1: return `${percentPageReaded}% `
    }
}

const VimMonitor: Component<{ status: () => string, lineIdx: Accessor<number>, idx: Accessor<number>, content: HTMLPreElement | undefined }> = ({ status, lineIdx, idx, content }) => {
    if (!content) return <div class={styles.vimMonitor}><p>loading...</p></div>
    const [location, setLocation] = createSignal(getCurrentFileLocation(content, lineIdx(), idx()))
    
    createEffect(()=> {
        if(content) setLocation(getCurrentFileLocation(content, lineIdx(), idx()))
    })
        
    return (
            <div class={styles.vimMonitor}>
                <pre>{status()}</pre>
                <pre>{`${lineIdx() + 1},${idx() + 1}`}</pre>
                <pre>{location()}</pre>
            </div>
        );
};

export default VimMonitor;
