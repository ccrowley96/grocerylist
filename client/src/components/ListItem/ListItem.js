import React from 'react';
import isMobile from 'ismobilejs';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import './ListItem.scss';

class ListItem extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            confirmOpen: false,
        };
    }

    render(){
        return (
            <div className={`listItemWrapper${this.props.checked ? ' checked': ''} ${isMobile().any ? ' mobile' : ''}`}>
                
                <ConfirmModal 
                    open={this.state.confirmOpen} 
                    triggerClose={() => this.setState({confirmOpen: false})}
                    message={`Do you want to delete: ${this.props.content}?`}
                    confirm={() => {
                        this.clickDelete();
                        this.setState({confirmOpen: false});
                    }}
                />
                
                <div className="listItem">
                    <div className='listContent'>
                        { this.props.checked ?
                            <strike>{this.props.content}</strike>
                            : this.props.content
                        }
                    </div>
                    <div className ='listDate'>{this.props.datetime}</div>
                    <div className ='listCategory'>Category: {this.props.category}</div>
                </div>
                <div className="listTools">
                    <button onClick={() => this.setState({confirmOpen: true})} className="tool deleteTool">delete</button>
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