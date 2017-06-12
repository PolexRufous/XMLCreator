import React from 'react';
import ReactDOM from 'react-dom';
import * as Config from './config.json';
import Base from './component/base';

import * as BootstrapCssTheme from '../node_modules/bootstrap-css-only/css/bootstrap-theme.min.css';
import * as BootstrapCss from '../node_modules/bootstrap-css-only/css/bootstrap.min.css';
import * as BootstrapGrid from '../node_modules/bootstrap-grid-only/bootstrap.css';
import * as CodeMirrorCss from './libs/codemirror.css';
import * as FontAwesome from '../node_modules/font-awesome/css/font-awesome.min.css';
import * as CustomStyle from './css/custom.css';

const main = document.getElementById(Config.mainClassName);
ReactDOM.render(<Base />, main);