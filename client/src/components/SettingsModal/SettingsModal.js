import React from 'react';
import './SettingsModal.scss';

class SettingsModal extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            targetValue: JSON.parse(localStorage.getItem('rooms'))
            .filter(room => room.roomCode !== JSON.parse(localStorage.getItem('activeRoom')).roomCode)[0].roomCode
        }
    }

    componentDidMount(){
        document.body.style.overflow = 'hidden';
        this.settings.focus(); 
    }

    componentWillUnmount(){
        document.body.style.overflow = 'unset';
    }


    handleSettingChange(event){
        this.setState({targetValue: event.target.value});
    }

    render(){
        return(
            <div className="settingsModalBlocker">
                <div className="settingsModal">
                    <h3 className="settingsHeading">Move Item</h3>
                    <div className="settingsSection settingsText">
                        {this.props.message}
                    </div>
                    <div className="settingsOptions">
                        <select className="settingsSelect" value={this.state.targetValue} onChange={(e) => this.handleSettingChange(e)}>
                            {JSON.parse(localStorage.getItem('rooms'))
                            .filter(room => room.roomCode !== JSON.parse(localStorage.getItem('activeRoom')).roomCode)
                            .map(room => {
                                return (
                                    <option key={room.roomCode} value={room.roomCode}>
                                        {room.roomName} ({room.roomCode})
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    {this.props.children ?
                        this.props.children
                    : null}
                    <div className="settingsSection settingsTools">
                        <div className="buttonSection">
                            <button onClick={() => this.props.confirm(this.state.targetValue)} className="green" ref={(input) => { this.settings = input; }}>Move</button>
                        </div>
                        <div className="buttonSection">
                            <button onClick={() => this.props.triggerClose()} className="red">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsModal;