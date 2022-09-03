import { Setter } from "solid-js";

class fileManager {
    fileContent: Array<string>
    setStr: Setter<Array<string>> | null
    fileUpload: FileList | null
    constructor() {
        this.setStr = null
        this.fileContent = []
        this.fileUpload = null
    }
    init = (setStr: Setter<Array<string>>) => {
        this.setStr = setStr;
        const inputFile: HTMLElement | null = document.getElementById('inputfile')
        inputFile?.addEventListener('change', (ev) => {
            const target = ev?.target as HTMLInputElement;
            this.fileUpload = target?.files;

            var fr = new FileReader();

            fr.onload = function () {
                const newFileStr = (<string>fr.result).split('\n').map(line => line === '' ? ' ' : line)
                setStr(newFileStr);
            }

            this.fileUpload && fr.readAsText(this.fileUpload[0]);
        })
    }

    downloadURI = (url: any, name: string) => {
        let link = document.createElement("a");
        link.download = name;
        link.href = url;
        link.click();
        link.remove();
    }

    download = () => {
        this.setStr && this.setStr(str => {
            this.fileContent = str
            return str
        })
        var file = new File([this.fileContent.join('\n')], "foo.txt", { type: "text/plain" });
        const url = window.URL.createObjectURL(file)
        this.downloadURI(url, this.fileUpload?this.fileUpload[0].name:'file.js');
        window.URL.revokeObjectURL(url);
    }
}

export default new fileManager
