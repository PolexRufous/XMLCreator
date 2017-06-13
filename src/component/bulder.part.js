import React from 'react';
import dispatcher from '../store/dispatcher';
import * as Config from '../config.json';

export default class BuilderPath extends React.Component {
    constructor(params){
        super(params);
        const value = this.props.component.value || '';
        this.state = {
            isValueEdit: false,
            newValue: value
        }
    }

    componentWillMount(){
        this.editValue = this.editValue.bind(this);
        this.saveValue = this.saveValue.bind(this);
        this.editValueMode = this.editValueMode.bind(this);
        this.showAddPopup = this.showAddPopup.bind(this);
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
        let input;
        let childrenArray = [];
        if (!isContainer){
            if (this.state.isValueEdit){
                input = <span>&nbsp;&nbsp; - <input type="text" value={this.state.newValue} onChange={this.editValue} />&nbsp;&nbsp;
                    <i className="fa fa-check" aria-hidden="true" onClick={this.saveValue}/></span>
            } else {
                input = <span>&nbsp;&nbsp; - <label>{value}</label>&nbsp;
                    <i className="fa fa-pencil-square-o" aria-hidden="true" onClick={this.editValueMode}/></span>
            }

        } else {
            let remove = <i className="fa fa-times" aria-hidden="true"/>;
            let add = <i className="fa fa-plus" aria-hidden="true" onClick={this.showAddPopup}/>;
            if (component.required){
                remove = null;
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
                    {component.name}
                    {input}
                </li>
                    {childrenParts}
            </ul>
        );
    }

    showAddPopup(event){
        const element = event.target;
        console.log(element);
    }
}