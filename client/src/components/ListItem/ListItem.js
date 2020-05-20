import React from 'react';
import isMobile from 'ismobilejs';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import {GrEdit} from 'react-icons/gr';
import './ListItem.scss';
import AddModal from '../AddModal/AddModal';

class ListItem extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            confirmOpen: false
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
                        <div className={`editBtn${isMobile().any ? ' mobile': ''}`}>
                            <GrEdit onClick={() => this.props.edit({content: this.props.content, category: this.props.category, id: this.props.itemID})}/>
                        </div>
                    </div>
                </div>
                <div className="listTools">
                    <button onClick={() => this.setState({confirmOpen: true})} className="tool red">delete</button>
                    <button onClick={() => this.clickCheck()} className="tool green">
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