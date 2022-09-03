import { Accessor, Setter } from "solid-js";

class keyManager {
    isInsertMode: boolean;
    isAppend: boolean;
    str: Accessor<Array<string>>;
    setStr: Setter<Array<string>>;
    currentIdx: Accessor<number>;
    currentLine: Accessor<number>;
    setIdx: Setter<number>;
    setLine: Setter<number>;
    status: Accessor<string>;
    setStatus: Setter<string>

    constructor() {
        this.isInsertMode = false;
        this.isAppend = false;
        this.str = () => [];
        this.setStr = (prev: any) => ({ ...prev });
        this.currentIdx = () => 0;
        this.currentLine = () => 0;
        this.setIdx = (prev: any) => ({ ...prev });
        this.setLine = (prev: any) => ({ ...prev });
        this.status = () => '';
        this.setStatus = (prev: any) => ({ ...prev });
    }

    init = (
        str: Accessor<string[]>,
        setStr: Setter<Array<string>>,
        currentIdx: Accessor<number>,
        currentLine: Accessor<number>,
        setIdx: Setter<number>,
        setLine: Setter<number>,
        status: Accessor<string>,
        setStatus: Setter<string>
    ) => {
        this.str = str;
        this.setStr = setStr;
        this.currentIdx = currentIdx;
        this.currentLine = currentLine;
        this.setIdx = setIdx;
        this.setLine = setLine;
        this.status = status;
        this.setStatus = setStatus;
    }

    addChar = (str: Array<string>, char: string, line: number, idx: number) => {
        str[line] = str[line].substring(0, idx) + char + str[line].substring(idx, str[line].length);
        return [...str]
    }

    deleteChar = (str: Array<string>, line: number, idx: number) => {
        str[line] = str[line].substring(0, idx - 1) + str[line].substring(idx, str[line].length);
        return [...str]
    }


    keyPressed = (key: string): void => {
        const isEndLine = this.str()[this.currentLine()]?.length === this.currentIdx() + 1;
        const isBeginningLine = this.currentIdx() === 0;
        const isLastLine = this.str().length === this.currentLine() + 1;
        const isFirstLine = this.currentLine() === 0;
        const isNormalMode = this.status() === 'normal';
        const isInsertMode = this.status() === 'insert';

        // console.log('key :' + key, ' status:', status)
        if (isNormalMode) {
            switch (key) {
                case 'A':
                    this.isAppend = true;
                    this.setStatus('insert')
                    this.setStr(str => this.addChar(str, ' ', this.currentLine(), str[this.currentLine()].length))
                    this.setIdx(idx => this.str()[this.currentLine()].length - 1)
                    break;
                case 'a':
                    if (isEndLine) {
                        this.isAppend = true;
                        this.setStatus('insert')
                        this.setStr(str => this.addChar(str, ' ', this.currentLine(), this.currentIdx() + 1))
                        this.setIdx(idx => ++idx)
                    } else {
                        this.setStatus('insert')
                        this.setIdx(idx => ++idx)
                    }
                    break;
                case 'X':
                    if (this.str()[this.currentLine()].length > 1 && !isBeginningLine) {
                        this.setStr(str => this.deleteChar(str, this.currentLine(), this.currentIdx()))
                        this.setIdx(idx => --idx)
                    }
                    break;
                case 'x':
                    if (this.str()[this.currentLine()].length > 1) {
                        this.setStr(str => this.deleteChar(str, this.currentLine(), this.currentIdx() + 1))
                        this.setIdx(idx => idx >= this.str()[this.currentLine()].length ? --idx : idx)
                    } else {
                        this.setStr(str => { str[this.currentLine()] = ' '; return [...str] })
                    }
                    break;
                case 'O':
                    this.setStatus('insert')
                    this.setIdx(0)
                    this.setStr(str => {
                        str.splice(this.currentLine(), 0, ' ');
                        return [...str]
                    })
                    break;
                case 'o':
                    this.setStatus('insert')
                    this.setIdx(0)
                    this.setStr(str => {
                        str.splice(this.currentLine() + 1, 0, ' ');
                        return [...str]
                    })
                    this.setLine(this.currentLine() + 1)
                    break;
                case 'b':
                    const prevWordIdx = (line: number, idx: number) => this.str()[line].substring(idx, this.str()[line].length).search(/\s[^\s]/) + idx + 1
                    if (prevWordIdx(this.currentLine(), this.currentIdx()) !== this.currentIdx()) {
                        this.setIdx(idx => prevWordIdx(this.currentLine(), idx))
                    }
                    else if (!isLastLine) {
                        this.setIdx(prevWordIdx(this.currentLine() + 1, 0))
                        this.setLine(lineIdx => lineIdx + 1)
                    } else {
                        const firstLineWithChars = this.str().findIndex((line) => line.match(/[^\s]/))
                        this.setLine(firstLineWithChars)
                        this.setIdx(prevWordIdx(firstLineWithChars, 0))
                    }
                    break;
                case 'w':
                    const nextWordIdx = (line: number, idx: number, isNewLine: boolean = false) => {
                        const regexPattern = new RegExp(`\\s${isNewLine ? '?' : ''}[^\\s]`)
                        return this.str()[line].substring(idx, this.str()[line].length).search(regexPattern) + idx + (isNewLine ? 0 : 1)
                    }
                    if (nextWordIdx(this.currentLine(), this.currentIdx()) !== this.currentIdx()) {
                        this.setIdx(idx => nextWordIdx(this.currentLine(), idx))
                    }
                    else if (!isLastLine) {
                        this.setIdx(nextWordIdx(this.currentLine() + 1, 0, true))
                        this.setLine(lineIdx => lineIdx + 1)
                    } else {
                        const firstLineWithChars = this.str().findIndex((line) => line.match(/[^\s]/))
                        this.setLine(firstLineWithChars)
                        this.setIdx(nextWordIdx(firstLineWithChars, 0))
                    }
                    break;
                case 'Backspace':
                case 'ArrowLeft':
                case 'h':
                    if (isBeginningLine && !isFirstLine) {
                        this.setIdx(this.str()[this.currentLine() - 1].length - 1)
                        this.setLine(lineIdx => lineIdx - 1)
                    } else if (!isBeginningLine) this.setIdx(idx => idx - 1)
                    break;
                case 'ArrowDown':
                case 'j':
                    if (!isLastLine) {
                        if (!this.str()[this.currentLine() + 1][this.currentIdx()]) this.setIdx(this.str()[this.currentLine() + 1].length - 1)
                        this.setLine(lineIdx => lineIdx + 1)
                    }
                    break;
                case 'ArrowUp':
                case 'k':
                    if (!isFirstLine) {
                        if (!this.str()[this.currentLine() - 1][this.currentIdx()]) this.setIdx(this.str()[this.currentLine() - 1].length - 1)
                        this.setLine(lineIdx => lineIdx - 1)
                    }
                    break;
                case 'ArrowRight':
                case 'l':
                    if (isEndLine && !isLastLine) {
                        this.setIdx(0)
                        this.setLine(lineIdx => lineIdx + 1)
                    } else if (!isEndLine) this.setIdx(idx => idx + 1)
                    break;
                case 'I':
                    this.setIdx(0)
                case 'i':
                    this.setStatus('insert')
                default: return
            }
        } else if (isInsertMode) {
            switch (key) {
                case 'Space':
                    this.setStr(str => this.addChar(str, ' ', this.currentLine(), this.currentIdx()));
                    this.setIdx(idx => ++idx);
                    this.isAppend = false;
                    break;
                case key.match(/^.$/)?.input:
                    this.setStr(str => this.addChar(str, key, this.currentLine(), this.currentIdx()));
                    this.setIdx(idx => ++idx);
                    this.isAppend = false;
                    break;
                case 'Tab':
                    const TAB_SIZE = 8;
                    this.setStr(str => this.addChar(str, ' '.repeat(TAB_SIZE), this.currentLine(), this.currentIdx()));
                    this.setIdx(idx => idx + TAB_SIZE);
                    this.isAppend = false;
                    break;
                case 'Esc':
                case 'Escape':
                    if (this.isAppend && isEndLine) {
                        this.setStr(str => this.deleteChar(str, this.currentLine(), str[this.currentLine()].length))
                        this.setIdx(idx => --idx)
                        this.isAppend = false;
                    }
                    this.setStatus('normal');
                    break;
                case 'Enter':
                    this.setIdx(0)
                    this.setStr(str => {
                        const prevLine = str[this.currentLine()].substring(0, this.currentIdx());
                        const nextLine = str[this.currentLine()].substring(this.currentIdx());
                        str[this.currentLine()] = prevLine;
                        str.splice(this.currentLine() + 1, 0, ' ');
                        str[this.currentLine() + 1] = nextLine;
                        return [...str]
                    })
                    this.setLine(this.currentLine() + 1)
                    break;
                case 'Backspace':
                    if (!isBeginningLine) {
                        this.setStr(str => this.deleteChar(str, this.currentLine(), this.currentIdx()))
                        this.setIdx(idx => --idx)
                    }
                    break;
                case 'ArrowRight':
                    if (isEndLine && !isLastLine) {
                        this.setIdx(0)
                        this.setLine(lineIdx => lineIdx + 1)
                    } else if (!isEndLine) this.setIdx(idx => idx + 1)
                    break;
                case 'ArrowLeft':
                    if (isBeginningLine && !isFirstLine) {
                        this.setIdx(this.str()[this.currentLine() - 1].length - 1)
                        this.setLine(lineIdx => lineIdx - 1)
                    } else if (!isBeginningLine) this.setIdx(idx => idx - 1)
                    break;
                case 'ArrowUp':
                    if (!isFirstLine) {
                        if (!this.str()[this.currentLine() - 1][this.currentIdx()]) this.setIdx(this.str()[this.currentLine() - 1].length - 1)
                        this.setLine(lineIdx => lineIdx - 1)
                    }
                    break;
                case 'ArrowDown':
                    if (!isLastLine) {
                        if (!this.str()[this.currentLine() + 1][this.currentIdx()]) this.setIdx(this.str()[this.currentLine() + 1].length - 1)
                        this.setLine(lineIdx => lineIdx + 1)
                    }
                    break;
                default: return
            }
        }
    }
}

export default new keyManager