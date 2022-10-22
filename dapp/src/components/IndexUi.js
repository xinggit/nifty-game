import React, { Component } from 'react';
import logo from '../images/logo.png';
import './indexUi.css';
export default class className extends Component{
    state={
        eggidx: 0,
    }
    render() {
        return (
            <div className="ui_item">
                <a className="logo" target="_blank">
                    <img className="logo" src={logo} />
                </a>
                <div className="ui cloud"></div>
                <div className="ui cloud2"></div>
                <div className="ui ladder"></div>
                <div className="ui tree1"></div>
                <div className="ui tree2"></div>
                <div className="ui footer"></div>
                <div className="ui start1"></div>
                <div className="ui start2"></div>
                <div className="ui start3"></div>
                <div className="ui Elf0"></div>
                <a href="https://github.com/xinggit" target="_blank" className="ui Elf1"></a>
                <a href="https://github.com/xinggit" target="_blank" className="ui Elf2"></a>
                <a href="https://github.com/xinggit" target="_blank" className="ui Elf3"></a>
                <a href="https://github.com/xinggit" target="_blank" className="ui fruit1"></a>
                <a className="ui fruit2"></a>

            </div>
        )
    }
}