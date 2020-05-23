import React from 'react';
import moment from 'moment-timezone';
import {withRouter} from 'react-router-dom';
import ListItem from '../ListItem/ListItem';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import AddEditModal from '../AddEditModal/AddEditModal';
import EditNameModal from '../EditNameModal/EditNameModal';
import {AiOutlinePrinter, AiOutlineDelete, AiOutlineUnorderedList, AiOutlineTag, AiOutlineEdit} from 'react-icons/ai'
import {GrAdd} from 'react-icons/gr';
import './List.scss';
import { RiUserSettingsLine } from 'react-icons/ri';

moment().tz("America/Los_Angeles").format();

class List extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            confirmOpen: false,
            addOpen: false,
            edit: {open: false, data: null},
            editNameOpen: false
        };
    }

    formatTime(date){
        let millis = Date.parse(date);
        return moment(millis).tz("America/Los_Angeles").format("ddd, MMM Do, h:mm a")
    }

    populateListItems(){
        if(this.props.list.list.length > 0){
            let categoryMap = {};

            for(let item of this.props.list.list){

                if(item.category in categoryMap){
                    categoryMap[item.category].push(item);
                } else{
                    categoryMap[item.category] = [item];
                }
            }

            return Object.keys(categoryMap).map(category => {
                return (
                    <div key={category} className="categoryWrapper">
                        <div className="categoryTitle">{category}</div>
                        <div className="categoryContent">
                        {
                            categoryMap[category].map(item => {
                                return (
                                    <ListItem 
                                        key={item._id} 
                                        roomId={this.props.roomId}
                                        item={{...item, date: this.formatTime(item.date)}}
                                        fetchNewList={this.props.fetchNewList}
                                        edit={(data) => {
                                            this.setState({edit: {open: true, data}})
                                        }}
                                    />
                                )
                            })
                        }
                        </div>
                    </div>
                );
            });
        } else{return null}
    }

    renderList(){
        if(this.props.list){
            if(this.props.list.list.length === 0){
                return(
                    <div className={`emptyListPlaceholder`}>
                        No Items Found!
                    </div>
                )
            } else{
                return(
                    <div className={`list`}>
                        {this.props.list ? this.populateListItems() : 'loading...'}
                    </div>
                );
            }
        }else{
            return null;
        }
    }

    renderTitleBar(){
        let empty = this.props.list && this.props.list.list.length === 0;
        return (
            <div className={`titleBarWrapper${empty ? ' empty': ''}`}>
                {!empty ? <div className="print">
                    <button 
                        className={`yellow printBtn`}
                        onClick={() => this.props.handlePrintClick()}
                    >
                        <div>Print List</div> 
                        <AiOutlinePrinter className="btnIcon"/> 
                    </button>
                </div> : null}
                <div className={"changeName"}>
                    <button 
                        className={`yellow changeNameBtn`}
                        onClick={() => this.setState({editNameOpen: true})}
                    >
                        <div>Edit Name</div> 
                        <AiOutlineEdit className="btnIcon"/> 
                    </button>
                </div>
            </div>
        )
    }

    render(){
        return (
            <div className={`listWrapper`}>
                {this.renderList()}
                
                {this.state.confirmOpen ? 
                    <ConfirmModal
                        triggerClose={() => this.setState({confirmOpen: false})}
                        message={'Do you want to clear the list?'}
                        confirm={() => {
                            this.clearList();
                            this.setState({confirmOpen: false});
                        }}
                    /> : null
                }

                {this.state.edit.open ? 
                    <AddEditModal
                        context={'Edit Item'}
                        populate={this.state.edit.data}
                        triggerClose={() => this.setState({edit: {open: false, data: null}})}
                        addItem={(item) => this.editItem(item)}
                    /> : null
                }

                {this.state.editNameOpen ? 
                    <EditNameModal
                        context={'Edit List Name'}
                        populate={true}
                        triggerClose={() => this.setState({editNameOpen: false})}
                        confirm={(name) => this.updateRoomName(name)}
                    /> : null
                    }

                {
                    this.state.addOpen ?
                    <AddEditModal
                        context={'Add Item'}
                        triggerClose={() => this.setState({addOpen: false})}
                        addItem={(item) => this.addItem(item)}
                    /> : null
                }

                <div className={`listFooter`}>
                    <div className="footerDiv">
                        <button onClick={() => this.setState({confirmOpen: true})} className={`red`}>
                            <AiOutlineDelete className={`btnIcon`}/> 
                        </button>
                    </div>
                    <div className="footerDiv">
                            <button className="roomsButton yellow" onClick={() => {this.props.history.push('/rooms');}}>
                                <AiOutlineUnorderedList className={`btnIcon`}/> 
                            </button>
                    </div>
                    <div className="footerDiv">
                        <button onClick={() => this.setState({addOpen: true})} className={`green`}>
                            <GrAdd className={`btnIcon`}/> 
                        </button>
                    </div>
                </div>
                <div className="roomCodeWrapper">
                    <div className="roomCode"><AiOutlineTag className="roomCodeIcon"/>List Code: {this.props.roomCode} </div>
                </div>
              
                {this.renderTitleBar() }
                
            </div>
        );
    }

    async addItem(item){
        this.setState({addOpen: false});

        await fetch(`/api/room/${this.props.roomId}/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        this.props.fetchNewList();
    }

    async editItem(item){
        let itemID = this.state.edit.data._id;
        this.setState({edit: {open: false, data: null}});

        await fetch(`/api/room/${this.props.roomId}/list/${itemID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        this.props.fetchNewList();
    }

    async clearList(){
        await fetch(`/api/room/${this.props.roomId}/list`, {method: 'DELETE'});
        //Update list
        this.props.fetchNewList();
    }

    async updateRoomName(roomName){
        this.setState({editNameOpen: false});
        // Change room name in db
        let response = await fetch(`/api/room/${this.props.roomId}/changeName`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({roomName: roomName})
        });
        if(response.status === 200){
            //Change name OK, change name in localStorage
            let storageToSet = JSON.parse(localStorage.getItem('rooms'));
            let activeRoomToSet = JSON.parse(localStorage.getItem('activeRoom'));
            if(storageToSet && activeRoomToSet){
                activeRoomToSet.roomName = roomName;

                //Find name and change in (rooms)
                storageToSet = storageToSet.map(room => {
                    if(room.roomId === this.props.roomId)
                        return {...room, roomName};
                    else
                        return room;
                })
                localStorage.setItem('rooms', JSON.stringify(storageToSet));
                localStorage.setItem('activeRoom', JSON.stringify(activeRoomToSet));
            }
        }
    }
}

export default withRouter(List);