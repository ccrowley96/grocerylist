import React from 'react';
import moment from 'moment-timezone';
import {withRouter} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ListItem from '../ListItem/ListItem';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import AddEditModal from '../AddEditModal/AddEditModal';
import EditNameModal from '../EditNameModal/EditNameModal';
import {AiOutlinePrinter, AiOutlineDelete, AiOutlineUnorderedList, AiOutlineTag} from 'react-icons/ai'
import {MdRadioButtonUnchecked} from 'react-icons/md';
import {GrAdd,GrEdit} from 'react-icons/gr';
import {FiShare, FiCheck} from 'react-icons/fi';

import isMobile from 'ismobilejs';
import './List.scss';

moment().tz("America/Los_Angeles").format();

class List extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            confirmOpen: false,
            addOpen: false,
            edit: {open: false, data: null},
            editNameOpen: false,
            copied: false
        };
        this.hotKeyListener = this.hotKeyListener.bind(this);
        this.checkAfterDelay = this.checkAfterDelay.bind(this);
    }

    hotKeyListener(event){
        let addKeyCodes = [65, 32,13];
        let closeKeyCodes = [27];

        let {confirmOpen, addOpen, edit, editNameOpen} = this.state;
        let modalOpen = confirmOpen || addOpen || edit.open || editNameOpen;
        if(addKeyCodes.includes(event.keyCode) && !modalOpen){
            event.preventDefault();
            this.setState({addOpen: true})
        }
        else if(modalOpen && closeKeyCodes.includes(event.keyCode)){
            this.setState({
                confirmOpen: false, 
                addOpen: false, 
                edit: {open: false, data: null},
                editNameOpen: false
            })
        }
        else if(!modalOpen && closeKeyCodes.includes(event.keyCode)){
            this.props.history.push('/rooms');
        }
    }

    componentDidMount(){
        //Start hot key listeners
        document.addEventListener('keydown', this.hotKeyListener)
    }

    componentWillUnmount(){
        //Remove hot key listeners
        document.removeEventListener('keydown', this.hotKeyListener);
    }

    formatTime(date){
        let millis = Date.parse(date);
        return moment(millis).tz("America/Los_Angeles").format("ddd, MMM Do, h:mm a")
    }

    populateListItems(){
        if(this.props.list.length > 0){
            let categoryMap = {};

            for(let item of this.props.list){

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
                                        clickCheck={(id, checkVal) => this.clickCheck(id, checkVal)}
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
            if(this.props.list.length === 0){
                return(
                    <div className={`emptyListPlaceholder`}>
                        <div className="noItems">No Items Found!</div>
                        <div className="tips title"><b><u>Info</u></b></div>
                        <div className="tips tip">
                            <button className="red" disabled={true}>
                                <AiOutlineDelete className={`btnIcon`}/> 
                            </button>
                            Delete all items on list
                        </div>
                        <div className="tips tip">
                            <button className="yellow" disabled={true}>
                                <AiOutlineUnorderedList className={`btnIcon`}/> 
                            </button>
                            Shows all of your lists
                        </div>
                        <div className="tips tip">
                            <button className="green" disabled={true}>
                                <GrAdd className={`btnIcon`}/> 
                            </button>
                            Adds item to your list
                        </div>
                        <div className="tips tip" style={{marginTop: '10px'}}><i>Click  <AiOutlineTag style={{paddingLeft: '5px'}}/> to share this list</i></div>
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
        let empty = this.props.list && this.props.list.length === 0;
        return (
            <div className={`titleBarWrapper${empty ? ' empty': ''}`}>
                <div className="titleButtonWrap checkAll">
                    <button 
                        className={`yellow checkBtn`}
                        onClick={() => this.props.handleCheckAllClick()}
                        disabled={this.props.checkDisabled}
                    >
                        <div className={'buttonTxt'}>{this.props.checkAll ? 'Uncheck All' : 'Check All'}</div> 
                        <div className={'buttonIconWrap'}>
                            {this.props.checkAll ? 
                            <MdRadioButtonUnchecked className="buttonIcon"/> :
                            <FiCheck className="buttonIcon"/>} 
                        </div>
                    </button>
                </div>
                <div className="titleButtonWrap print">
                    <button 
                        className={`yellow`}
                        onClick={() => this.props.handlePrintClick()}
                    >
                        <div className={'buttonTxt'}>Print List</div> 
                        <div className={'buttonIconWrap'}><AiOutlinePrinter className="buttonIcon"/></div> 
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
                        <button onClick={() => this.setState({confirmOpen: true})} 
                            className={`red`}
                            title={'Clear all items from this list'}
                        >
                            <AiOutlineDelete className={`btnIcon`}/> 
                        </button>
                    </div>
                    <div className="footerDiv">
                            <button className="roomsButton yellow" 
                                onClick={() => {this.props.history.push('/rooms');}}
                                title={'View all lists'}
                            >
                                <AiOutlineUnorderedList className={`btnIcon`}/> 
                            </button>
                    </div>
                    <div className="footerDiv">
                        <button onClick={() => this.setState({addOpen: true})} 
                            className={`green`}
                            title={'Add item to this list'}
                        >
                            <GrAdd className={`btnIcon`}/> 
                        </button>
                    </div>
                </div>
                <div className="roomCodeWrapper">
                    <div className="roomName" onClick={() => this.setState({editNameOpen: true})}
                        title={'Edit list name'}
                    >
                        {JSON.parse(localStorage.getItem('activeRoom')).roomName}<GrEdit className="btnIcon"/> 
                    </div>
                    <CopyToClipboard 
                        text={`${process.env.NODE_ENV === 'development' ? window.location.href : 'https://www.grocerylist.us/'}rooms/${this.props.roomCode}`}
                        onCopy={() => {
                            this.setState({copied: true})
                            setTimeout(() => {this.setState({copied: false})}, 2000);
                        }}
                    >
                        <div className="roomCode" title={'Copy sharable list URL'}>
                            <AiOutlineTag className="roomCodeIcon"/>{this.props.roomCode}
                        </div>
                    </CopyToClipboard>
                    {this.state.copied ? <div className="copiedFlag">Room Link Copied.</div> : null}
                </div>
              
                {this.renderTitleBar() }
                
            </div>
        );
    }

    async clickCheck(itemId, checkVal){
        let updatedList = this.props.list;
        updatedList = updatedList.map(item => {
            if(item._id === itemId){
                item.checked = checkVal;
            }
            return item;
        })

        //Set temporary check state
        this.setState({list: updatedList})
        await fetch(`/api/room/${this.props.roomId}/list/${itemId}/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({checked: checkVal})
        })
        //fetch updated list
        // Fetch new list after delay
        clearTimeout(this.state.delayedCheck);
        let delayedCheck = setTimeout(this.checkAfterDelay, 2000)
        this.setState({delayedCheck});
    }

    checkAfterDelay(){
        this.props.fetchNewList();
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
        this.setState({}); //trigger re-update to refresh name
    }
}

export default withRouter(List);