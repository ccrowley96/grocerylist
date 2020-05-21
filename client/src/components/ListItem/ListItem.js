import React from 'react';
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
            checkPending: false,
            itemChecked: props.item.checked,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.item.checked != prevState.itemChecked){
            return ({itemChecked: nextProps.item.checked})
        }
        return null;
    }

    render(){
        return (
            <div className={`listItemWrapper${this.state.itemChecked ? ' checked': ''} `}>
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
                        { this.state.itemChecked ?
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
                        <div onClick={() => !this.state.checkPending ? this.clickCheck() : null} className={`tool`}>
                            {this.state.itemChecked ? <AiFillCheckCircle className="listItemToolIcon checkIcon"/> : <MdRadioButtonUnchecked className="listItemToolIcon checkIcon"/>}
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

    async clickCheck(){
        this.setState(prevState => ({checkPending: true, itemChecked: !prevState.itemChecked}));
        await fetch(`/api/list/check/${this.props.item._id}`,{method: 'POST'});
        this.setState({checkPending: false});
        //fetch updated list
        this.props.fetchNewList();
    }

    async clickDelete(){
        await fetch(`/api/list/${this.props.item._id}`,{method: 'DELETE'});
        //fetch updated list
        this.props.fetchNewList();
    }
}

export default ListItem;