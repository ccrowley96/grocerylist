import React from 'react';
import './BackupModal.scss';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class BackupModal extends React.Component{

    defaultBackupMessage = 'Click text area to copy backup codes';

    constructor(props){
        super(props);
        this.state = {
            backupMessage: this.defaultBackupMessage
        }
        this.state.formError = '';
    }

    componentDidMount(){
        document.body.style.overflow = 'hidden';
    }

    componentWillUnmount(){
        document.body.style.overflow = 'unset';
    }


    formatBackupCodes(){
        let rooms = JSON.parse(localStorage.getItem('rooms'));
        console.log(rooms);
        let formattedBackup = '';
        for(let room of rooms){
            let roomLink = process.env.NODE_ENV === 'development' ? window.location.href + `/${room.roomCode}` : `https://www.grocerylist.us/rooms/${room.roomCode}`;
            formattedBackup += room.roomName + ': ' + room.roomCode + '\n' + roomLink + '\n\n';
        }
        return formattedBackup;
    }

    render(){
        return(
            <div className="backupModalBlocker">
                <div className="backupModal">
                    <form className="modalWrapper" onSubmit={(e) => this.handleSubmit(e)}>
                        <div className="addTitle">
                            Backup codes
                        </div>
                        <div className ="formWrapper">
                            <div className="addForm" onSubmit={(e) => this.handleSubmit(e)}>
                                <div className="addFormItemDesc">
                                    <label className={`textAreaLabel ${this.state.copied ? 'copied' : ''}`}>
                                        {this.state.backupMessage}
                                    </label>
                                    <CopyToClipboard 
                                        text={this.formatBackupCodes()}
                                        onCopy={() => {
                                            this.setState({backupMessage: 'Codes copied...', copied: true})
                                            setTimeout(() => {this.setState({backupMessage: this.defaultBackupMessage, copied: false})}, 5000);
                                        }}
                                    >
                                        <textarea
                                            className={'backupTextArea'}
                                            readOnly={true}
                                            value={this.formatBackupCodes()}
                                        />
                                    </CopyToClipboard>
                                    
                                    <div className ="formError">{this.state.formError}</div>
                                    <div className="backupDetails">
                                        <div className="daTips">Then paste and save somewhere safe.</div>
                                        <br></br>
                                        <b>Why can't I see my list?</b> - a reference to each of your lists is stored in your browsers storage. This allows you to save lists without ever creating a 'Grocery list' account.                                          
                                        However, if the storage (browser cache) is ever cleared, you may see your lists disappear.  To prevent this, it's recommended that you save your list codes somewhere safe.
                                        <br></br>
                                        <br></br>
                                        <b>More info</b>  - even if you don't see your list, don't worry!  It still exists in the grocerylist database.  You just need to 'rejoin' the list with it's code.
                                        You can rejoin a list at any time by either following the list link or entering the list code in the 'join room' box.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tools">
                            
                            <div className="toolSection">
                                <button onClick={() => this.props.triggerClose()} className="delete">Close</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default BackupModal;