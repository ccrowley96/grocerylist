import React from 'react';
import {withRouter} from 'react-router-dom';
import List from '../List/List';
import CustomCategories from '../CustomCategories/CustomCategories';
import {FiCheck} from 'react-icons/fi';
import {MdRadioButtonUnchecked} from 'react-icons/md';
import {AiOutlinePrinter} from 'react-icons/ai'

import './ListContainer.scss';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: null,
      activeRoomID: null,
      activeRoomCode: null,
      activeRoomName: null,
      checkAll: false,
      checkDisabled: false
    }
    this.updateInterval = null;
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
        //Find check state for check / uncheck all button
        let numChecked = list.list.reduce((acc, cur) => acc += cur.checked ? 1 : 0, 0);
        let prevCheckAll = this.state.checkAll;
        let checkAll = numChecked === list.list.length / 2 ? prevCheckAll : numChecked >= Math.ceil(list.list.length / 2);
        this.setState({list, checkAll, checkDisabled: false});
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount(){
    if(JSON.parse(localStorage.getItem('activeRoom')) == null){
      this.props.history.push('/rooms');
    } else{
      let {roomId, roomCode, roomName} = JSON.parse(localStorage.getItem('activeRoom'));
      this.setState({activeRoomID: roomId, activeRoomCode: roomCode, activeRoomName: roomName});
      this.updateList(roomId);
      this.updateInterval = setInterval(() => this.updateList(roomId), 5000);
    }
  }
  
  componentWillUnmount(){
    // Destroy update interval
    clearInterval(this.updateInterval);
  }

  handlePrintClick(){
    window.open('/print');
  }

  async handleCheckAllClick(){
    let onClickCheckState = !this.state.checkAll;
    this.setState(prevState => ({checkAll: !prevState.checkAll, checkDisabled: true}));
    await fetch(`/api/room/${this.state.activeRoomID}/list/checkAll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({checked: onClickCheckState})
    });
    this.updateList();
  }

  render(){
    if(!this.state.activeRoomID|| !this.state.activeRoomCode || !this.state.activeRoomName) return null;
    return(
      <div className = {`appWrapper`}>
        <List
          roomId={this.state.activeRoomID} 
          roomCode={this.state.activeRoomCode}
          roomName={this.state.activeRoomName}
          list={this.state.list?.list} 
          checkAll={this.state.checkAll}
          checkDisabled={this.state.checkDisabled}
          fetchNewList={() => this.updateList()}
          handlePrintClick={() => this.handlePrintClick()}
          handleCheckAllClick={() => this.handleCheckAllClick()}
        />

        <CustomCategories />

        {this.renderFooterControls()}
      </div>
    )
  }

  renderFooterControls(){
    let empty = this.props.list && this.props.list.length === 0;
    return (
        <div className={`footerControlWrapper${empty ? ' empty': ''}`}>
            <div className="footerButtonWrap checkAll">
                <button 
                    className={`yellow checkBtn`}
                    onClick={() => this.handleCheckAllClick()}
                    disabled={this.state.checkDisabled}
                >
                    <div className={'buttonTxt'}>{this.props.checkAll ? 'Uncheck All' : 'Check All'}</div> 
                    <div className={'buttonIconWrap'}>
                        {this.state.checkAll ? 
                        <MdRadioButtonUnchecked className="buttonIcon"/> :
                        <FiCheck className="buttonIcon"/>} 
                    </div>
                </button>
            </div>
            <div className="footerButtonWrap print">
                <button 
                    className={`yellow`}
                    onClick={() => this.handlePrintClick()}
                >
                    <div className={'buttonTxt'}>Print List</div> 
                    <div className={'buttonIconWrap'}><AiOutlinePrinter className="buttonIcon"/></div> 
                </button>
            </div>
        </div>
    )
}
}

export default withRouter(App);
