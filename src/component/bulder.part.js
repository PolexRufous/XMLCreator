import React from 'react';
import dispatcher from '../store/dispatcher';
import * as Config from '../config.json';
import DataStore from '../store/data.store'

export default class BuilderPath extends React.Component {
    constructor(params){
        super(params);
        const value = this.props.component.value || '';
        this.state = {
            isValueEdit: false,
            newValue: value,
            isElementChoosing: false,
        }
    }

    componentWillMount(){
        this.editValue = this.editValue.bind(this);
        this.saveValue = this.saveValue.bind(this);
        this.createElement = this.createElement.bind(this);
        this.editValueMode = this.editValueMode.bind(this);
        this.showChooseElementSelect = this.showChooseElementSelect.bind(this);
        this.hideChooseElementSelect = this.hideChooseElementSelect.bind(this);
    }

    editValue(action){
        this.setState({
            newValue: action.target.value
        });
    }

    saveValue(){
        const {Constants} = Config;
        this.setState({
            isValueEdit: false
        });
        const value = document.getElementById(this.props.component.name + 'value').value;
        const internalAction = {
            actionType: Constants.ActionTypes.SET_VALUE,
            value: value,
            component: this.props.component
        };
        dispatcher.dispatch(internalAction);
    }

    createElement() {
        const {Constants} = Config;
        const elementName = document.getElementById(this.props.component.name + 'element').value;
        this.setState({
            isElementChoosing: false
        });
        const internalAction = {
            actionType: Constants.ActionTypes.CREATE_ELEMENT,
            elementName: elementName
        };
        dispatcher.dispatch(internalAction);
    }

    editValueMode(){
        this.setState({
            isValueEdit: true
        });
    }

    render(){
        const { component } = this.props;
        const { value } = component;
        const { isContainer } = component;
        const editValueLabel = value && value !== '' ? "fa-check-square-o" : "fa-bug";
        let input;
        let childrenArray = [];
        if (!isContainer){
            if (this.state.isValueEdit){
                let inputField = <input id={component.name + 'value'}  type="text" value={this.state.newValue} onChange={this.editValue} />;
                if (component.hasValidValues) {
                    const options = component.validValues
                        .map(value => <option value={value} key={component.name + ":" + value}>{value}</option>);
                    inputField = <select id={component.name + 'value'}>{options}</select>
                }
                input = <span>&nbsp;&nbsp;{inputField}&nbsp;&nbsp;<i className="fa fa-check" aria-hidden="true" onClick={this.saveValue}/></span>
            } else {
                input = <span>&nbsp;&nbsp; - <label>{value}</label>&nbsp;
                    <i className={"fa " + editValueLabel} aria-hidden="true" onClick={this.editValueMode}/></span>
            }

        } else {
            let remove = <i className="fa fa-times" aria-hidden="true"/>;
            let add = <i className="fa fa-plus" aria-hidden="true" onClick={this.showChooseElementSelect}/>;
            if (component.required){
                remove = null;
            }
            if (this.state.isElementChoosing) {
                const childrenOptions = this.getChildrenOptions(component);
                if (childrenOptions.length > 0) {
                    add = <span>&nbsp;&rarr;&nbsp;<select id={component.name + 'element'}>{this.getChildrenOptions(component)}</select>
                        &nbsp;&nbsp;<i className="fa fa-check" aria-hidden="true" onClick={this.createElement}/></span>
                } else {
                    add = null;
                }

            }
            input = <span>&nbsp;&nbsp;{add}&nbsp;{remove}</span>;
            childrenArray = component.children
                .map(childName => component[childName])
                .filter(child => child !== undefined);
        }

        const childrenParts = childrenArray.map((child) => {
                    if (Array.isArray(child)) {
                        return child.map(element =>
                            <BuilderPath key={(Math.random()*1e32).toString(36)} component={element}/>);
                    } else {
                        return (<BuilderPath key={(Math.random()*1e32).toString(36)} component={child}/>);
                    }
        });
        return(
            <ul>
                <li>
                    {component.displayName}
                    {input}
                </li>
                    {childrenParts}
            </ul>
        );
    }

    showChooseElementSelect(){
        this.setState({
            isElementChoosing: true
        });
    }

    hideChooseElementSelect() {
        this.setState({
            isElementChoosing: false
        });
    }

    validChildrenToChose(component) {
        const existingStandalone = component.children
            .map(childName => component[childName])
            .filter(child => child !== undefined)
            .filter(child => child.standalone)
            .map(child => child.name);
        return component.children.slice()
            .filter(child => !existingStandalone.includes(child));
    }

    getChildrenOptions(component) {
        return this.validChildrenToChose(component)
            .map(childName => this.getStructureElementByName(childName))
            .map(child => <option key={(Math.random()*1e32).toString(36)} value={child.name}>{child.displayName}</option>);
    }

    getStructureElementByName(elementName) {
        return DataStore.getElementByName(elementName);
    }
}