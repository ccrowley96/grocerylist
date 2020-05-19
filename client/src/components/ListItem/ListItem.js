import React from 'react';
import './ListItem.css';

class ListItem extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="listItemWrapper">
                <div className="listItem">
                    <div className='listContent'>{this.props.content}</div>
                    <div className ='listDate'>{this.props.datetime}</div>
                </div>
                <div className="listTools">
                    <div className="tool deleteTool">delete</div>
                    <div className="tool checkTool">check</div>
                </div>
            </div>
        );
    }
}

export default ListItem;