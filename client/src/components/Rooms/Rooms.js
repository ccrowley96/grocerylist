import React from 'react';
import {withRouter} from 'react-router-dom';
import {RiPlayListAddLine, RiSave3Line} from 'react-icons/ri';
import {AiOutlineTag, AiFillDelete} from 'react-icons/ai';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import BackupModal from '../BackupModal/BackupModal';
import DeprecateModal from '../DeprecateModal/DeprecateModal';
import isMobile from 'ismobilejs';
import utils from '../../utils/utils';
import './Rooms.scss';

class Rooms extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: null,
            joinRoomVal: '',
            joinRoomInfo: '',
            confirmOpen: false,
            note: '',
            awaitingValidation: false,
            backupOpen: false,
            deprecateOpen: false
        }
        this.noteTimeout = null;
    }

    componentDidMount() {
        const {params} = this.props.match;

        // Read deprecation splash local storage
        let isDeprectationSplashConfirmed = JSON.parse(localStorage.getItem('isDeprectationSplashConfirmed'))
        this.setState({deprecateOpen: !isDeprectationSplashConfirmed})

        // Load local storage into state (if available)
        let localRoomsObj = JSON.parse(localStorage.getItem('rooms'));
        this.setState({rooms: localRoomsObj});

        if('roomCode' in params){
            let join = async() => {
                let roomCode = params.roomCode;
                if(roomCode.length === 6){
                    await this.joinRemoteRoom(roomCode);
                }
                this.validateRooms();
            }
            join();
        } else{
            //Validate rooms
            this.validateRooms();
        }

        this.displayNotes();
    }

    componentWillUnmount(){
        clearTimeout(this.noteTimeout);
    }

    updateRooms(){
        this.setState({rooms: JSON.parse(localStorage.getItem('rooms'))});
    }

    async validateRooms(){
        // Disable room join while awaiting room validation
        this.setState({awaitingValidation: true});

        let localRooms = JSON.parse(localStorage.getItem('rooms'))
        let activeRoom = JSON.parse(localStorage.getItem('activeRoom'));

        if(localRooms){
            let ids = localRooms.map(room => room.roomId);
            let payload = {ids}
            // Hit backend with IDs found in local storage
            let response = await fetch('/api/room/getMatchingIds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            let roomsValidated = await response.json();
            // Filter out missing IDs
            let filteredLocalRooms = localRooms.filter(room => roomsValidated.matchingRooms.findIndex(matchID => room.roomId === matchID._id) !== -1)
            if(activeRoom){
                let activeRoomOk = roomsValidated.matchingRooms.findIndex(matchID => matchID === activeRoom.roomId) !== -1;
                if(!activeRoomOk){
                    localStorage.setItem('activeRoom', null);
                } 
            }

            // Change local room names
            filteredLocalRooms = filteredLocalRooms.map(localRoom => {
                let remoteName = roomsValidated.matchingRooms.find(room => room._id === localRoom.roomId).roomName
                localRoom.roomName = remoteName;
                return localRoom;
            })
            // Update local storage
            localStorage.setItem('rooms', JSON.stringify(filteredLocalRooms));
        }
        // Rooms validated, can now join
        this.setState({awaitingValidation: false});
        this.updateRooms();
    }

    async createRoom(){
        let response = await fetch('/api/room', {method: 'POST'});
        let room = await response.json();
        let storageToSet = JSON.parse(localStorage.getItem('rooms'));

        if(storageToSet) storageToSet.push({roomId: room.id, roomCode: room.roomCode, roomName: room.name});
        else storageToSet = [{roomId: room.id, roomCode: room.roomCode, roomName: room.name}]

        localStorage.setItem('rooms', JSON.stringify(storageToSet));
        this.updateRooms();
    }

    async deleteRoom(roomId){
        await fetch(`/api/room/${roomId}`, {method: 'DELETE'});
        let storageToSet = JSON.parse(localStorage.getItem('rooms'));
        storageToSet = storageToSet.filter(localstorage_room => localstorage_room.roomId !== roomId)
        localStorage.setItem('rooms', JSON.stringify(storageToSet));
        this.updateRooms();
    }

    joinMyRoom(roomId, roomCode, roomName){
        if(!this.state.awaitingValidation){
            //Set activeRoom in local storage
            let storageToSet = {roomId, roomCode, roomName};
            localStorage.setItem('activeRoom', JSON.stringify(storageToSet));
            // Link to List App
            this.props.history.push('/');
        }
    }

    async joinRemoteRoom(roomCode = null){
        let remoteRoomCode = roomCode ? roomCode : this.state.joinRoomVal;
        // Check if room exists in database
        let response = await fetch('/api/room/getRoomByCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({roomCode: remoteRoomCode})
        });
        let roomValidated = await response.json();
        if(roomValidated.match == null){
            //Flag room not found
            this.setState({joinRoomInfo: 'List not found'});
        } else{

            let storageToSet = JSON.parse(localStorage.getItem('rooms'));
            let roomId = roomValidated.match._id, 
                roomCode = roomValidated.match.roomCode,
                roomName = roomValidated.match.roomName;

            // Ignore if room already in localStorage
            if(storageToSet && storageToSet.findIndex(room => room.roomId === roomId) !== -1){
                this.setState({joinRoomInfo: 'Room already joined!'})
                return;
            }


            if(storageToSet) storageToSet.push({roomId, roomCode, roomName});
            else storageToSet = [{roomId, roomCode, roomName}]

            localStorage.setItem('rooms', JSON.stringify(storageToSet));
            this.updateRooms();
        }
        this.setState({joinRoomVal: ''});
    }

    handleJoinInputChange(e){
        if(/[^a-zA-Z]/.test(e.target.value)){
            this.setState({joinRoomInfo: 'Non-alphabetic'});
        }else{
            this.setState({joinRoomVal: e.target.value.toLowerCase(), joinRoomInfo: ''});
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        this.joinRemoteRoom()
    }

    async displayNotes(){
        //Note: Lists will expire in 30 days if not used
        let notes = utils.tips;
        // Shuffle notes and add empty final note
        notes = (notes.sort(() => Math.random() - .5))
        notes.push('');

        let noteInterval = 7000;
        this.setState({note: notes[0]})

        for(let note of notes.slice(1)){
            await new Promise((res, rej) => {
                this.noteTimeout = setTimeout(() => {
                    this.setState({note})
                    res(note);
                }, noteInterval)
            })
        }
    }

    render(){
        return(
            <div className="applicationWrapper">
                    {
                        this.state.backupOpen ?
                        <BackupModal 
                            confirm={(email) => console.log('confirming backup: ', email)}
                            triggerClose={() => this.setState({backupOpen: false})}
                        /> : null
                    }
                    {
                        this.state.deprecateOpen ?
                        <DeprecateModal 
                            confirm={() => null}
                            triggerClose={() => this.setState({deprecateOpen: false})}
                        /> : null
                    }
                <div className="roomsWrapper">
                    <div className="roomTopToolbarWrapper">
                        <div className={`designedBy${isMobile().any ? ' mobile' : ''}`}>Designed By &nbsp;<a href="https://corycrowley.me" target="_blank"> Cory</a></div>
                        <form onSubmit={(e) => this.handleSubmit(e)} className="joinRoomForm">
                            <div className="joinRoomWrapper">
                                <div className="joinRoomInputWrapper">
                                    <input 
                                        type="text" 
                                        value={this.state.joinRoomVal} 
                                        onChange={(e) => this.handleJoinInputChange(e)}
                                        placeholder={"Enter code..."}
                                        className="joinRoomInput"
                                        maxLength={6}
                                    >
                                    </input>
                                    <div className="joinRoomInfo">{this.state.joinRoomInfo}</div>
                                </div>
                                <div className="joinRoomButtonWrapper">
                                    <button className="confirm joinRoomButton" type="submit" value="Submit">
                                        Join
                                        <AiOutlineTag className="roomToolIcon"/>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <h2>Your lists</h2>
                    { 
                        (this.state.rooms && this.state.rooms.length !== 0) ? this.state.rooms.map(room => {
                            return (
                                <RoomItem
                                    awaitingValidation={this.state.awaitingValidation}
                                    key={room.roomId}
                                    roomName={room.roomName}
                                    room={room} 
                                    joinMyRoom={this.joinMyRoom.bind(this)}
                                    deleteRoom={this.deleteRoom.bind(this)}
                                    validateRooms={this.validateRooms.bind(this)}
                                />
                            )
                        }) : <div className="noListsFound">No Lists found!</div> 
                    }   
                    <div className={`footerControlsWrapper ${!(this.state.rooms && this.state.rooms.length !== 0) ? 'right' : ''}`}>
                            {this.state.rooms && this.state.rooms.length !== 0 && <button 
                                className="settings footerTool"
                                onClick={() => this.setState({backupOpen: true})}
                            >
                                Backup codes
                                <RiSave3Line className="roomToolIcon"/>
                            </button>}
                            <button 
                                className="confirm footerTool"
                                onClick={() => this.createRoom()}
                            >
                                Create list
                                <RiPlayListAddLine className="roomToolIcon"/>
                            </button>
                    </div>
                    <div className="notes">
                        <p><b>⚠️ Grocery list is shutting down.  Please transfer your lists to another list app by January 1, 2023 to avoid losing data.  <a className={'learnMore'} onClick={() => this.setState({deprecateOpen: true})}>Learn more here</a></b></p>
                    </div>
                    <div className="feedback">
                        <a href="https://forms.gle/whSyuGXyLfcP4XHN9" target="_blank">Feedback Form</a>
                    </div>
                </div>
            </div>
        )
    }
}

class RoomItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            confirmOpen: false,
            unsubscribe: false
        }
    }

    toggleUnsubscribe(event){
        this.setState({unsubscribe: event.target.checked});
    }

    render(){
        return(
            <div key={this.props.room.roomId} className={`roomWrapper${this.props.awaitingValidation ? ' disabled' : ''}`} tabIndex={0}>
                <div className="joinRoomClickRegion"
                    onClick={() => this.props.joinMyRoom(this.props.room.roomId, this.props.room.roomCode, this.props.room.roomName)}>
                </div>
                <div className="roomName" >
                    {this.props.room.roomName}
                </div>
                <div className="roomTools">
                    <div className="roomCode">
                        <AiOutlineTag className="roomCodeIcon"/>
                        {this.props.room.roomCode}
                    </div>
                    <div className="roomDelete">
                        <div onClick={() => this.setState({confirmOpen: true})} className="deleteBtn">
                            <AiFillDelete className="deleteIcon"/>
                        </div>
                    </div>
                </div>
                {this.state.confirmOpen ? 
                    <ConfirmModal 
                        triggerClose={() => this.setState({confirmOpen: false, unsubscribe: false})}
                        message={!this.state.unsubscribe ? `Do you want to delete: ${this.props.room.roomCode}?` : 
                            `Do you want to unsubscribe from: ${this.props.room.roomCode}?`}
                        confirm={() => {
                            if(this.state.unsubscribe){
                                // Remove list from local storage
                                let rooms = JSON.parse(localStorage.getItem('rooms'));
                                rooms = rooms.filter(room => room.roomCode !== this.props.room.roomCode);
                                localStorage.setItem('rooms', JSON.stringify(rooms));
                                // Re-fetch lists from backend
                                this.props.validateRooms();
                            } else{
                                this.props.deleteRoom(this.props.room.roomId);
                            }
                            this.setState({confirmOpen: false, unsubscribe: false});
                        }}
                    >
                        <div className="confirmChildWrapper">
                            <label className="confirmCheckerLabel">Unsubscribe (other users will still have access)</label>
                            <input
                                name="unsubscribeChecked"
                                className="confirmCheckbox"
                                type="checkbox"
                                checked={this.state.unsubscribe}
                                onChange={(e) => this.toggleUnsubscribe(e)} 
                            />
                        </div> 
                    </ConfirmModal> : null
                }
            </div>
        )
    }
}

export default withRouter(Rooms);