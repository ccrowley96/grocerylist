import React from 'react';
import {withRouter} from 'react-router-dom';
import './Rooms.scss';

class Rooms extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: null
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

    joinRoom(roomId){
        //Set activeRoom in local storage
        let storageToSet = roomId;
        localStorage.setItem('activeRoom', JSON.stringify(storageToSet));
        // Link to List App
        this.props.history.push('/');
    }

    render(){
        return(
        <div className="roomsWrapper">
            <h1>Rooms</h1>
            <button 
                className="green createRoom"
                onClick={() => this.createRoom()}
            >
                    Create room
                </button>
            <h2>My Rooms</h2>
            {this.state.rooms ? this.state.rooms.map(roomId => {
                return(
                <div key={roomId} className="roomWrapper">
                    <div className="roomName">
                        {roomId}
                    </div>
                    <div className="roomDelete">
                        <button onClick={() => this.deleteRoom(roomId)} className="red">
                            Delete
                        </button>
                    </div>
                    <div className="roomJoin">
                        <button onClick={() => this.joinRoom(roomId)} className="green">
                            Join
                        </button>
                    </div>
                </div>
                )
            }): null}
        </div>
        )
    }

}

export default withRouter(Rooms);