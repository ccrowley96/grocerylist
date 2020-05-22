import React from 'react';
import {withRouter} from 'react-router-dom';
import './Rooms.scss';

class Rooms extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: null,
            joinRoomVal: '',
            joinRoomInfo: ''
        }
    }

    componentDidMount() {
        this.updateRooms();
    }

    updateRooms(){
        this.setState({rooms: JSON.parse(localStorage.getItem('rooms'))});
    }

    async createRoom(){
        let response = await fetch('/api/room', {method: 'POST'});
        let room = await response.json();
        let storageToSet = JSON.parse(localStorage.getItem('rooms'));

        if(storageToSet) storageToSet.push(room.id);
        else storageToSet = [room.id]

        localStorage.setItem('rooms', JSON.stringify(storageToSet));
        this.updateRooms();
    }

    async deleteRoom(roomId){
        await fetch(`/api/room/${roomId}`, {method: 'DELETE'});
        let storageToSet = JSON.parse(localStorage.getItem('rooms'));
        storageToSet = storageToSet.filter(localstorage_roomId => localstorage_roomId !== roomId)
        localStorage.setItem('rooms', JSON.stringify(storageToSet));
        this.updateRooms();
    }

    joinMyRoom(roomId){
        //Set activeRoom in local storage
        let storageToSet = roomId;
        localStorage.setItem('activeRoom', JSON.stringify(storageToSet));
        // Link to List App
        this.props.history.push('/');
    }

    handleJoinInputChange(e){
        this.setState({joinRoomVal: e.target.value});
    }

    render(){
        return(
        <div className="roomsWrapper">
            <h2>Create New Room</h2>
            <button 
                className="green createRoom"
                onClick={() => this.createRoom()}
            >
                    Create room
                </button>
            <h2>Join Room</h2>
            <div className="joinRoomWrapper">
                <div className="joinRoomButtonWrapper">
                    <button className="green joinRoomButton">
                        Join Room
                    </button>
                </div>
                <div className="joinRoomInputWrapper">
                    <input 
                        type="text" 
                        value={this.state.joinRoomVal} 
                        onChange={(e) => this.handleJoinInputChange(e)}
                        className="joinRoomInput"
                    >
                    </input>
                </div>
            </div>

            <div className="joinRoomInfo">{this.state.joinRoomInfo}</div>

            <h2>My Rooms</h2>
            {this.state.rooms ? this.state.rooms.map(roomId => {
                return(
                <div key={roomId} className="roomWrapper">
                    <div className="roomName">
                        {roomId}
                    </div>
                    <div className="roomTools">
                        <div className="roomDelete">
                            <button onClick={() => this.deleteRoom(roomId)} className="red">
                                Delete
                            </button>
                        </div>
                        <div className="roomJoin">
                            <button onClick={() => this.joinMyRoom(roomId)} className="green">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
                )
            }): null}
        </div>
        )
    }

}

export default withRouter(Rooms);