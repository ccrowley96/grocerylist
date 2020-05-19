import React from 'react';
import isMobile from 'ismobilejs';
import './ListItem.scss';

class ListItem extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className={`listItemWrapper${this.props.checked ? ' checked': ''} ${isMobile().any ? ' mobile' : ''}`}>
                <div className="listItem">
                    <div className='listContent'>
                        { this.props.checked ?
                            <strike>{this.props.content}</strike>
                            : this.props.content
                        }
                    </div>
                    <div className ='listDate'>{this.props.datetime}</div>
                </div>
                <div className="listTools">
                    <button onClick={() => this.clickDelete()} className="tool deleteTool">delete</button>
                    <button onClick={() => this.clickCheck()} className="tool checkTool">
                        {this.props.checked ? 'uncheck' : 'check'}
                    </button>
                </div>
            </div>
        );
    }

    async clickCheck(){
        await fetch(`/api/list/check/${this.props.itemID}`,{method: 'POST'});
        //fetch updated list
        this.props.fetchNewList();
    }

    async clickDelete(){
        await fetch(`/api/list/${this.props.itemID}`,{method: 'DELETE'});
        //fetch updated list
        this.props.fetchNewList();
    }
}

export default ListItem;