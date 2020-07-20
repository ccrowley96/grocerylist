import React from 'react';
import './Help.scss';

import {GrAdd,GrEdit} from 'react-icons/gr';
import {AiOutlineDelete, AiOutlineUnorderedList, AiOutlineTag, AiOutlinePrinter} from 'react-icons/ai'
import {FiShare, FiCheck, FiLink} from 'react-icons/fi';
import isMobile from 'ismobilejs';


export default function(props){
    return(
        <div className={`emptyListPlaceholder`}>
            <div className="titleText">{props.titleText}</div>
            {props.subtitleText ? 
                <div className="subtitleText">{props.subtitleText}</div> : null
            }
            <div className="tips title"><b><u>Info</u></b></div>
            <div className="tipWrapper">
                <div className="tips tip">
                    <button className="delete" disabled={true}>
                        <AiOutlineDelete className={`btnIcon`}/> 
                    </button>
                    Delete all items on list
                </div>
                <div className="tips tip">
                    <button className="settings" disabled={true}>
                        <AiOutlineUnorderedList className={`btnIcon`}/> 
                    </button>
                    Shows all of your lists
                </div>
                <div className="tips tip">
                    <button className="confirm" disabled={true}>
                        <GrAdd className={`btnIcon`}/> 
                    </button>
                    Adds item to your list
                </div>
                <div className="tips tip">
                    <button className="settings" disabled={true}>
                        <AiOutlinePrinter className={`btnIcon`}/> 
                    </button>
                    Print items on your list
                </div>
                <div className="tips tip">
                    <button className="settings" disabled={true}>
                        <FiCheck className={`btnIcon`}/> 
                    </button>
                    Check / Un-check all items
                </div>
                <div className="tips tip" style={{marginTop: '10px'}}><i>Click  <FiLink style={{paddingLeft: '5px'}}/> to copy &amp; share URL to this list</i></div>
                <div className="tips tip"><i>Click  <GrEdit style={{paddingLeft: '5px'}}/> to change this list's name</i></div>
                <div className="tips tip" style={{display: `${!isMobile().any ? 'none': 'initial'}`}}>
                    <FiShare className={`btnIcon`} style={{paddingRight: '5px'}}/> 
                    Add this app to your home screen
                </div>
                <div className={`desktopHotkeys${isMobile().any ? ' mobile' : ''}`}>
                    <div className="tips title"><b><u>Hotkeys</u></b></div>
                    <div className="tips tip"><i><b>'space'</b> or <b>'enter'</b> creates a new item</i></div>
                    <div className="tips tip"><i><b>'esc'</b> closes pop-up menu (if open)</i></div>
                    <div className="tips tip"><i><b>'esc'</b> returns to list menu</i></div>
                    
                </div>
            </div>
        </div>
    )
}