import React from 'react';
import List from '../List/List'
import './ListContainer.scss';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: null,
      activeRoom: null
    }
  }

  updateList(inititalRoomId = null){
    let roomId = inititalRoomId ? inititalRoomId : this.state.activeRoom;

    fetch(`/api/room/${roomId}/list`)
      .then(response => response.json())
      .then(list => {
        this.setState({list})
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount(){
    let roomId = JSON.parse(localStorage.getItem('activeRoom'));
    this.setState({activeRoom: roomId});

    this.updateList(roomId);
  }

  handlePrintClick(){
    window.open('/print');
  }

  render(){
    return(
      <div className = {`appWrapper`}>
        <List
          roomId={this.state.activeRoom} 
          list={this.state.list} 
          fetchNewList={() => this.updateList()}
          handlePrintClick={() => this.handlePrintClick()}
        />
      </div>
    )
  }
}

export default App;
