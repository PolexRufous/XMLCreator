import React from 'react';
import BuilderSide from './builder.side';
import ResultSide from './result.side';

export default class Base extends React.Component {
    constructor(params){
        super(params);
    }

    render() {
        return(
            <section className="container row col-xs-12">
                <BuilderSide />
                <ResultSide />
            </section>
        );
    }
}