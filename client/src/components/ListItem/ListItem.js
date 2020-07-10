import React from 'react';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import {GrEdit} from 'react-icons/gr';
import {AiFillDelete, AiFillCheckSquare, AiOutlineCheckSquare} from 'react-icons/ai';
import {RiCheckboxBlankLine} from 'react-icons/ri';
import './ListItem.scss';

class ListItem extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            confirmOpen: false
        };
    }

    render(){
        return (
            <div className={`listItemWrapper${this.props.item.checked ? ' checked': ''} `}>
                {this.state.confirmOpen ? 
                    <ConfirmModal 
                        triggerClose={() => this.setState({confirmOpen: false})}
                        message={`Do you want to delete: ${this.props.item.content}?`}
                        confirm={() => {
                            this.clickDelete();
                            this.setState({confirmOpen: false});
                        }}
                    /> : null
                }
                
                <div className="listItem">
                    <div className='listContent'>
                        { this.props.item.checked ?
                            <strike>{this.props.item.content}</strike>
                            : this.props.item.content
                        }
                        <div className={`editBtn`}>
                            <GrEdit onClick={() => {
                                let {content, category, _id} = this.props.item;
                                this.props.edit({content, category, _id});
                            }}
                            />
                        </div>
                    </div>
                </div>
                <div className={`listToolsWrapper`}>
                    <div className = "listTools">
                        <div onClick={() => this.setState({confirmOpen: true})} className={`tool`}><AiFillDelete className="listItemToolIcon deleteIcon"/></div>
                        <div onClick={() => this.props.clickCheck(this.props.item._id, !this.props.item.checked)} className={`tool checkBox`}>
                            {this.props.item.checked ? <AiFillCheckSquare className="listItemToolIcon checkIcon"/> : <AiOutlineCheckSquare className="listItemToolIcon checkIcon"/>}
                        </div>
                    </div>
                    <div className = "listInfo">
                        <div className ="itemDate">
                            {this.props.item.date}
                            {this.props.item.edited ? <p className="edited">(edited)</p> : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    

    async clickDelete(){
        await fetch(`/api/room/${this.props.roomId}/list/${this.props.item._id}`,{method: 'DELETE'});
        //fetch updated list
        this.props.fetchNewList();
    }
}

export default ListItem;