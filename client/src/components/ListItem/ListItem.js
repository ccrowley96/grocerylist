import React from 'react';
import isMobile from 'ismobilejs';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import {GrEdit} from 'react-icons/gr';
import {AiFillDelete, AiFillCheckCircle} from 'react-icons/ai';
import {MdRadioButtonUnchecked} from 'react-icons/md';
import './ListItem.scss';

class ListItem extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            confirmOpen: false,
            checkPending: false
        };
    }

    render(){
        return (
            <div className={`listItemWrapper${this.props.checked ? ' checked': ''} ${isMobile().any ? ' mobile' : ''}`}>
                {this.state.confirmOpen ? 
                    <ConfirmModal 
                        triggerClose={() => this.setState({confirmOpen: false})}
                        message={`Do you want to delete: ${this.props.content}?`}
                        confirm={() => {
                            this.clickDelete();
                            this.setState({confirmOpen: false});
                        }}
                    /> : null
                }
                
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
                <div className={`listTools${isMobile().any ? ' mobile': ''}`}>
                    <div onClick={() => this.setState({confirmOpen: true})} className={`tool${isMobile().any ? ' mobile': ''}`}><AiFillDelete className="listItemToolIcon deleteIcon"/></div>
                    <div onClick={() => !this.state.checkPending ? this.clickCheck() : null} className={`tool${isMobile().any ? ' mobile': ''}`}>
                        {this.props.checked ? <AiFillCheckCircle className="listItemToolIcon checkIcon"/> : <MdRadioButtonUnchecked className="listItemToolIcon checkIcon"/>}
                    </div>
                </div>
            </div>
        );
    }

    async clickCheck(){
        this.setState({checkPending: true});
        await fetch(`/api/list/check/${this.props.itemID}`,{method: 'POST'});
        this.setState({checkPending: false});
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