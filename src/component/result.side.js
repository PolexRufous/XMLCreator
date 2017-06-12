import React from 'react';
import o2x from 'object-to-xml';
import FileSaver from 'file-saver';
import DataStore from '../store/data.store';
const CodeMirror = require('../libs/codemirror');
require('../libs/xml');

export default class ResultSide extends React.Component {

    constructor(params){
        super(params);
        this.state = {
            data: null,
            mounted: false
        };
        this.changeData = this.changeData.bind(this);
        this.updateCodeMirror = this.updateCodeMirror.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.mountCodeMirror = this.mountCodeMirror.bind(this);

    }

    componentWillMount(){
        DataStore.on('data_updated', this.changeData);
    }

    componentWillUnmount(){
        DataStore.removeListener('data_updated', this.changeData);
    }

    changeData(){
        this.setState({
            data: DataStore.getData()
        });
        if (!this.state.mounted) {
            this.mountCodeMirror();
            this.setState({
                mounted: true
            });
        }
    }

    mountCodeMirror() {
        this.codeMirror = CodeMirror.fromTextArea(document.getElementById("xml-result"), {
            mode: "text/html",
            lineNumbers: true,
            readOnly: true
        });
        this.updateCodeMirror();
    }

    saveFile(){
        const fileName = 'XML' + '_' + new Date().toISOString() + '.xml';
        const text = o2x(this.state.data);
        const blob = new Blob([text], {type: "text/xml;charset=utf-8"});
        FileSaver.saveAs(blob, fileName);
    }

    render() {
        return(
            <aside className="col-xs-6 row">
                <h1>Result section</h1>
                <div>
                    <button className="btn btn-success" onClick={this.saveFile}>Save</button>
                </div>
                <div className="form-group">
                    <label>There is result here:</label>
                    <textarea id="xml-result" className="hidden" />
                </div>
            </aside>
        );
    }

    componentDidUpdate(){
        this.updateCodeMirror();
    }

    updateCodeMirror(){
        this.codeMirror.getDoc().setValue(o2x(this.state.data));
        this.codeMirror.refresh();
    }
}