import React from 'react';
import dispatcher from '../store/dispatcher';
import * as Config from '../config.json';
import Popout from 'react-popout';

export default class BuilderPath extends React.Component {
    constructor(params){
        super(params);
        const value = this.props.component.value || '';
        this.state = {
            isValueEdit: false,
            newValue: value,
            isPopedOut: false
        }
    }

    componentWillMount(){
        this.editValue = this.editValue.bind(this);
        this.saveValue = this.saveValue.bind(this);
        this.editValueMode = this.editValueMode.bind(this);
        this.showAddPopup = this.showAddPopup.bind(this);
        this.hideAddPopup = this.hideAddPopup.bind(this);
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
        const internalAction = {
            actionType: Constants.ActionTypes.SET_VALUE,
            value: this.state.newValue,
            component: this.props.component
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
                let inputField = <input type="text" value={this.state.newValue} onChange={this.editValue} />;
                if (component.hasValidValues) {
                    const options = component.validValues
                        .map(value => <option value={value} key={component.name + ":" + value}>{value}</option>);
                    inputField = <select onChange={this.editValue}>{options}</select>
                }
                input = <span>&nbsp;&nbsp;{inputField}&nbsp;&nbsp;<i className="fa fa-check" aria-hidden="true" onClick={this.saveValue}/></span>
            } else {
                input = <span>&nbsp;&nbsp; - <label>{value}</label>&nbsp;
                    <i className={"fa " + editValueLabel} aria-hidden="true" onClick={this.editValueMode}/></span>
            }

        } else {
            let remove = <i className="fa fa-times" aria-hidden="true"/>;
            let add = <i className="fa fa-plus" aria-hidden="true" onClick={this.showAddPopup}/>;
            if (component.required){
                remove = null;
            }
            if (this.state.isPopedOut) {
                add = this.getPopoutWindow(component);
            }
            input = <span>&nbsp;&nbsp;{add}&nbsp;{remove}</span>;
            childrenArray = component.children
                .map(childName => component[childName])
                .filter(child => child !== undefined);
        }

        const childrenParts = childrenArray.map((child) => {
                return (
                    <BuilderPath key={(Math.random()*1e32).toString(36)} component={child}/>
                );
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

    showAddPopup(event){
        const element = event.target;
        console.log(element);
        this.setState({
            isPopedOut: true
        });
    }

    hideAddPopup() {
        this.setState({
            isPopedOut: false
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

    getPopoutWindow(component) {
        const list = this.validChildrenToChose(component)
            .map(child => <option value={child}>{child}</option>);
        return <Popout title='Chose element' onClose={this.hideAddPopup}>
            <select>
                {list}
            </select>
        </Popout>
    }
}