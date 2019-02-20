import React, { Component } from 'react';
import './App.css';

const json = require('./assets/output.json');

export default class App extends Component {
    render() {
        return <Filesystem input={json}/>;
    }
}

class Filesystem extends Component {
    render() {
        let root = <Folder type={this.props.input.type} path={this.props.input.path} name={this.props.input.path} children={this.props.input.children} parentPath={'/'} />;
        return <div id="file-tree">{root}</div>;
    }   
}
 

// Item classes and the bulk of the logic.
class Folder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };

        this.toggle = this.toggle.bind(this);
        this.traverse = this.traverse.bind(this);
    }

    toggle() {
        let url = this.state.collapsed ? this.props.path : this.props.parentPath;
        window.history.pushState(null, "", url);
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return  <div className={"folder"}>
                    <span className={"item-title folder-title " + (this.state.collapsed ? "folder-collapsed" : "folder-expanded")} onClick={this.toggle}>{this.props.name}</span>
                    <div className={"folder-contents " + (this.state.collapsed ? "collapsed" : "expanded")}>
                        {this.props.children ? this.traverse(this.props) : ''}
                    </div>
                </div>;
    }

    // Recursively travel through the json object and build a nested HTML structure to match
    traverse(data) {
        let html = [];
    
        // Sort items here, since React components appear to be hard to sort
        // Folders sorted to appear above files, and both are sorted alphabetically
        data.children.sort(function(a, b) {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            else if (a.type === "folder") return -1;
            else return 1;
        });
    
        // It should be impossible to share a path with any other item, so it's used as the React key
        for (let child of data.children) {
            html.push(
                child.type === "folder" ? 
                    <Folder type={child.type} key={child.path} path={child.path} name={child.name} parentPath={data.path} children={child.children} /> 
                    : <File type={child.type} key={child.path} path={child.path} name={child.name} />
            ); 
        }
        return html;
    }
}


class File extends Component {

    constructor(props) {
        super(props);
        this.select = this.select.bind(this);
    }

    select() {
        window.history.pushState(null, "", this.props.path);
    }

    render() {
        return  <div className={this.props.type} key={this.props.path}>
                    <span className="item-title file" onClick={this.select}>{this.props.name}</span>
                </div>;
    }
}

// Pre-React-component version of traverse
// function traverse(items) {
//     let html = [];
//     for (let item of items) {
//         html.push(
//             <div className={item.type} key={item.path}>
//                 <span className={"item-title " + item.type + "-title"}>{item.type === "folder" ? item.path : item.name}</span>
//                 {item.children ? traverse(item.children) : ''}
//             </div>
//         ); 
//     }
//     return html;
// }