import React from 'react';
import {withRouter} from 'react-router-dom';
import {RiPlayListAddLine} from 'react-icons/ri';
import {AiOutlineTag, AiFillDelete} from 'react-icons/ai';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import './Rooms.scss';

class Rooms extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: null,
            joinRoomVal: '',
            joinRoomInfo: '',
            confirmOpen: false
        }
    }

    componentDidMount() {
        //Validate rooms
        this.validateRooms();
    }

    updateRooms(){
        this.setState({rooms: JSON.parse(localStorage.getItem('rooms'))});
    }

    async validateRooms(){
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
                if(!activeRoomOk) localStorage.setItem('activeRoom', null);
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
        //Set activeRoom in local storage
        let storageToSet = {roomId, roomCode, roomName};
        localStorage.setItem('activeRoom', JSON.stringify(storageToSet));
        // Link to List App
        this.props.history.push('/');
    }

    async joinRemoteRoom(){
        this.setState({joinRoomVal: ''});
        // Check if room exists in database
        let response = await fetch('/api/room/getRoomByCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({roomCode: this.state.joinRoomVal})
        });
        let roomValidated = await response.json();
        if(roomValidated.match == null){
            //Flag room not found
            this.setState({joinRoomInfo: 'List not found'});
        } else{

            let storageToSet = JSON.parse(localStorage.getItem('rooms'));
            let roomId = roomValidated.match._id, roomCode = roomValidated.match.roomCode;

            // Ignore if room already in localStorage
            if(storageToSet && storageToSet.findIndex(room => room.roomId === roomId) !== -1)
                return;

            if(storageToSet) storageToSet.push({roomId, roomCode});
            else storageToSet = [{roomId, roomCode}]

            localStorage.setItem('rooms', JSON.stringify(storageToSet));
            console.log("List Joined", roomValidated.match);
            this.updateRooms();
        }
    }

    handleJoinInputChange(e){
        this.setState({joinRoomVal: e.target.value, joinRoomInfo: ''});
    }

    render(){
        return(
        <div className="roomsWrapper">
            <div className="roomTopToolbarWrapper">
                
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
                        <button className="green joinRoomButton" onClick={() => this.joinRemoteRoom()}>
                            Join
                            <AiOutlineTag className="roomToolIcon"/>
                        </button>
                    </div>
                </div>
            </div>
            
            <h2>My Lists</h2>
            { 
                (this.state.rooms && this.state.rooms.length !== 0) ? this.state.rooms.map(room => {
                    return (
                        <RoomItem 
                            key={room.roomId}
                            roomName={room.roomName}
                            room={room} 
                            joinMyRoom={this.joinMyRoom.bind(this)}
                            deleteRoom={this.deleteRoom.bind(this)}
                        />
                    )
                }) : <div>No Rooms found!</div> 
            }   
            <div className="createRoomWrapper">
                    <button 
                        className="green createRoom"
                        onClick={() => this.createRoom()}
                    >
                        Create List
                        <RiPlayListAddLine className="roomToolIcon"/>
                    </button>
                </div>
        </div>
        )
    }
}

class RoomItem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            confirmOpen: false
        }
    }

    render(){
        return(
            <div key={this.props.room.roomId} className="roomWrapper">
                <div className="roomName" onClick={() => this.props.joinMyRoom(this.props.room.roomId, this.props.room.roomCode, this.props.room.roomName)}>
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
                        triggerClose={() => this.setState({confirmOpen: false})}
                        message={`Do you want to delete: ${this.props.room.roomCode}?`}
                        confirm={() => {
                            this.props.deleteRoom(this.props.room.roomId);
                            this.setState({confirmOpen: false});
                        }}
                    /> : null
                }
            </div>
        )
    }
}

export default withRouter(Rooms);