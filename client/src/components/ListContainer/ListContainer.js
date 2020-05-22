import React from 'react';
import {withRouter} from 'react-router-dom';
import List from '../List/List'
import './ListContainer.scss';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: null,
      activeRoomID: null,
      activeRoomCode: null
    }
  }

  updateList(inititalRoomId = null){
    let roomId = inititalRoomId ? inititalRoomId : this.state.activeRoomID;

    fetch(`/api/room/${roomId}/list`)
      .then(response => {
        if(response.status !== 200){
          this.props.history.push('/rooms');
          throw new Error('Room not found');
        }
        else return response.json()
      })
      .then(list => {
        this.setState({list})
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount(){
    if(JSON.parse(localStorage.getItem('activeRoom')) == null){
      this.props.history.push('/rooms');
    } else{
      let {roomId, roomCode} = JSON.parse(localStorage.getItem('activeRoom'));
      this.setState({activeRoomID: roomId, activeRoomCode: roomCode});
      this.updateList(roomId);
    }
  }

  handlePrintClick(){
    window.open('/print');
  }

  render(){
    return(
      <div className = {`appWrapper`}>
        <List
          roomId={this.state.activeRoomID} 
          roomCode={this.state.activeRoomCode}
          list={this.state.list} 
          fetchNewList={() => this.updateList()}
          handlePrintClick={() => this.handlePrintClick()}
        />
      </div>
    )
  }
}

export default withRouter(App);
