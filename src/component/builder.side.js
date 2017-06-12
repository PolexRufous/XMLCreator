import React from 'react';
import DataStore from '../store/data.store';
import BuilderPart from './bulder.part';
import Config from '../config.json';
import dispatcher from '../store/dispatcher';

export default class BuilderSide extends React.Component {
    constructor(properties) {
        super(properties);
        this.state = {
            structure: DataStore.getStructure(),
            initialized: false,
            schema: ''
        };
        this.changeStructure = this.changeStructure.bind(this);
        this.isInitialized = this.isInitialized.bind(this);
        this.initNewXml = this.initNewXml.bind(this);
        this.onSchemaChange = this.onSchemaChange.bind(this);
        this.formatData = this.formatData.bind(this);
    }

    componentWillMount() {
        DataStore.on('change', this.changeStructure);
        DataStore.on('initialized', this.isInitialized);
    }

    componentWillUnmount() {
        DataStore.removeListener('change', this.changeStructure);
        DataStore.removeListener('initialized', this.isInitialized);
    }

    changeStructure() {
        this.setState({
            structure: DataStore.getStructure()
        });
    }

    onSchemaChange(event) {
        this.setState({
            schema: event.currentTarget.value
        });
    }

    isInitialized() {
        this.setState({
            initialized: true
        });
        this.changeStructure();
    }

    initNewXml() {
        const internalAction = {};
        internalAction.actionType = 'CREATE_XML';
        internalAction.xmlFileType = this.state.schema;
        dispatcher.dispatch(internalAction);
    }

    formatData() {
        const internalAction = {};
        internalAction.actionType = 'FORMAT_DATA';
        dispatcher.dispatch(internalAction);
    }

    render() {
        const {schemas} = Config;
        let radioCounter = 0;
        const schemaSelectors = schemas.map(schema => {
            radioCounter++;
            return <div key={'radio' + radioCounter} className="selectors-schemas">
                <label>&nbsp; {schema.name} &nbsp;</label>
                <input type="radio" name="schema"
                       disabled={!schema.enabled}
                       value={schema.type}
                       checked={this.state.schema === schema.type}
                       onChange={this.onSchemaChange} />
            </div>
        });
        const schemasPanel = <div>{schemaSelectors}</div>
        const builder = this.state.initialized && this.state.structure ?
            <BuilderPart component={this.state.structure}/> :
            false;

        return (
            <aside className="col-xs-6">
                <h1>Builder section</h1>
                {schemasPanel}
                <div className="clear" />
                <div>
                    <button className="btn btn-primary col-xs-6"
                            disabled={this.state.schema === ''}
                            onClick={this.initNewXml}>
                        Create new XML</button>
                </div>
                <div>
                    <button className="btn btn-primary col-xs-6" disabled={!this.state.initialized}
                            onClick={this.formatData}>
                        Format XML</button>
                </div>
                <div className="panel panel-default col-xs-12">
                    {builder}
                </div>
            </aside>
        );
    }
}