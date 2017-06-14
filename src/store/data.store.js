import {EventEmitter} from 'events';
import dispatcher from './dispatcher';
import * as Config from '../config.json';

class DataStore extends EventEmitter {
    constructor() {
        super();

        this.data = {};
        this.base = {};
        this.structure = {};
        this.isFtp = false;
        this.isRest = false;
        this.elements = {};
        this.root = '';
        this.xmlroot = '';
        this.rootxmlns = '';

        this.updateValue = this.updateValue.bind(this);
        this.dispatchActions = this.dispatchActions.bind(this);
        this.initXml = this.initXml.bind(this);
        this._initFtpXml = this._initFtpXml.bind(this);
        this._initRestXml = this._initRestXml.bind(this);
        this.getIsFtp = this.getIsFtp.bind(this);
        this.getIsRest = this.getIsRest.bind(this);
        this._initState = this._initState.bind(this);
    }

    getIsFtp() {
        return this.isFtp;
    }

    getIsRest() {
        return this.isRest;
    }

    getData() {
        return this.data;
    }

    getStructure() {
        return this.structure[this.root];
    }

    _putRequiredElementsToStructure(elementName) {
        const element = this.elements[elementName];
        if (element.required) {
            this._putElementToStructure(element);
            if (element.isContainer) {
                const self = this;
                const {children} = element;
                children.map(childName => self._putRequiredElementsToStructure(childName));
            }
        }
    }

    _putElementWithRequiredChildrenToStructure(elementName) {
        const element = this.elements[elementName];
        this._putElementToStructure(element);
        if (element.isContainer) {
            const self = this;
            const {children} = element;
            children
                .filter(childName => this.elements[childName].required)
                .map(childName => self._putElementWithRequiredChildrenToStructure(childName));
        }
    }

    _putElementToStructure(templateElement) {
        let parentElement = this.structure;
        const path = templateElement.path.split('.');
        path
            .filter(currPath => currPath !== '')
            .map(currPath => parentElement = parentElement[currPath]);
        parentElement[templateElement.name] = templateElement;
    }

    _formatData() {
        let baseStructureElement = this.structure[this.root];
        this.data = this.base;
        let baseDataElement = this.base[this.rootxmlns + ':' + this.xmlroot];
        baseDataElement = baseDataElement['#'];
        const self = this;
        baseStructureElement.children
            .map(elementName => {
                const element = baseStructureElement[elementName];
                if (element) {
                    self._putElementsToData(element, baseDataElement);
                }
            });
    }

    _putElementsToData(structureElement, dataElement) {
        const dataElementName = structureElement.xmlns && structureElement.xmlns !== '' ?
            structureElement.xmlns + ':' + structureElement.displayName :
            structureElement.displayName;
        if (structureElement.isContainer) {
            dataElement[dataElementName] = {
                '#': {}
            };
            let newDataElement = dataElement[dataElementName];
            newDataElement = newDataElement['#'];
            const self = this;
            structureElement.children
                .map(elementName => {
                    const element = structureElement[elementName];
                    if (element) {
                        self._putElementsToData(element, newDataElement);
                    }
                });
        } else {
            dataElement[dataElementName] = structureElement.value;
        }
    }

    updateValue(component, value) {
        const {Constants} = Config;
        this._updateStructureValue(component, value);
        this.emit(Constants.Events.CHANGE);
    }

    _updateStructureValue(component, value) {
        let parentElement = this.structure;
        const path = component.path.split('.');
        path.map(currPath => parentElement = parentElement[currPath]);
        const currentElement = parentElement[component.name];
        currentElement.value = value;
    }

    initXml(xmlFileType) {
        const {Constants} = Config;
        switch(xmlFileType) {
            case Constants.StructureTypes.FTP:
                this._initFtpXml();
                break;
            case Constants.StructureTypes.REST:
                this._initRestXml();
                break;
            default:
                alert('Unsupported XML type!');
        }
    }

    _initFtpXml() {
        const self = this;
        const {Constants} = Config;
        import(/* webpackMode: "lazy"  */ '../structures/ftp.structure.js')
            .then(structure => {
                self._initState(structure.default);
                self.emit(Constants.Events.INITIALIZED);
            })
            .catch(error =>
                alert(error.message));
    }

    _initRestXml() {
        const self = this;
        const {Constants} = Config;
        import(/* webpackMode: "lazy"  */ '../structures/rest.structure.js')
            .then(structure => {
                self._initState(structure.default);
                self.emit(Constants.Events.INITIALIZED);
            })
            .catch(error =>
                alert(error.message));
    }

    _initState(structure) {
        this.isFtp = structure.ftp;
        this.isRest = structure.rest;
        this.root = structure.root;
        this.xmlroot = structure.xmlroot;
        this.rootxmlns = structure.rootxmlns;
        this.base = structure.base;
        this.elements = structure.elements;
        this._putElementWithRequiredChildrenToStructure(this.root);
    }

    dispatchActions(internalAction) {
        const {Constants} = Config;
        const self = this;
        switch (internalAction.actionType) {
            case Constants.ActionTypes.SET_VALUE:
                self.updateValue(internalAction.component, internalAction.value);
                break;
            case Constants.ActionTypes.CREATE_XML:
                self.initXml(internalAction.xmlFileType);
                break;
            case Constants.ActionTypes.FORMAT_DATA:
                self._formatData();
                self.emit(Constants.Events.DATA_UPDATED);
                break;
            default:
                console.error('No such action type expected', internalAction.actionType);
        }
    }
}

const dataStore = new DataStore();
dispatcher.register(dataStore.dispatchActions);
export default dataStore;