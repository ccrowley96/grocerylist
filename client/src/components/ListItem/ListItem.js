import React from 'react';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import {GrEdit} from 'react-icons/gr';
import {AiFillDelete, AiFillCheckSquare, AiOutlineCheckSquare} from 'react-icons/ai';
import {RiShareForward2Line} from 'react-icons/ri';
import './ListItem.scss';
import SettingsModal from '../SettingsModal/SettingsModal';

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

                {this.state.settingsOpen ? 
                    <SettingsModal
                        triggerClose={() => this.setState({settingsOpen: false})}
                        message={`Where do you want to move: ${this.props.item.content.slice(0,40)}?`}
                        confirm={(targetCode) => {
                            this.moveItem(targetCode);
                            this.setState({settingsOpen: false});
                        }}
                    /> : null
                }
                
                <div className="listItem">
                    <div className='listContent'>
                        { this.props.item.checked ?
                            <strike>{this.props.item.content}</strike>
                            : this.props.item.content
                        }
                        <div onClick={() => this.props.clickCheck(this.props.item._id, !this.props.item.checked)} className={`checkBtn`}>
                            {this.props.item.checked ? <AiFillCheckSquare className="checkIcon"/> : <AiOutlineCheckSquare className="checkIcon"/>}
                        </div>
                    </div>
                </div>
                <div className={`listToolsWrapper`}>
                    <div className = "listTools">
                        <div onClick={() => this.setState({confirmOpen: true})} className={`tool`}><AiFillDelete className="listItemToolIcon deleteIcon"/></div>
                        <div className={`tool`} onClick={() => {
                                let {content, category, _id} = this.props.item;
                                this.props.edit({content, category, _id});
                            }}
                        >
                            <GrEdit className="listItemToolIcon editIcon"/>
                        </div>
                        {JSON.parse(localStorage.getItem('rooms')).length > 1 ?
                            <div onClick={() => this.setState({settingsOpen: true})} className={`tool checkBox`}><RiShareForward2Line className="listItemToolIcon checkIcon"/></div>
                            : null
                        }
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

    async moveItem(targetCode){
        await fetch(`/api/room/moveItem/${this.props.roomId}/list/${this.props.item._id}`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({code: targetCode})
            }
        )
        this.props.fetchNewList();
    }
}

export default ListItem;