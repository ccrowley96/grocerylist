import React from 'react';
import './BackupModal.scss';

class BackupModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
        }
        this.state.formError = '';
    }

    componentDidMount(){
        document.body.style.overflow = 'hidden';
        this.itemInput.focus(); 
        console.log('backup mounted')
    }

    componentWillUnmount(){
        document.body.style.overflow = 'unset';
    }

    handleEmailChange(event) {
        let formError = this.state.formError
        if(event.target.value !== '') formError = '';
        this.setState({email: event.target.value, formError});
    }

    handleSubmit(event) {
        event.preventDefault();

        if(this.state.email === ''){
            this.setState({formError: 'Email cannot be empty'})
            return;
        }

        this.props.confirm(this.state.email);

        this.setState({roomName: ''});
    }

    render(){
        return(
            <div className="backupModalBlocker">
                <div className="backupModal">
                    <form className="modalWrapper" onSubmit={(e) => this.handleSubmit(e)}>
                        <div className="addTitle">
                            Backup lists
                        </div>
                        <div className ="formWrapper">
                            <div className="addForm" onSubmit={(e) => this.handleSubmit(e)}>
                                <div className="addFormItemDesc">
                                    <label>
                                        Email
                                    </label>
                                    <input className="formItem" type="text" name="roomName" 
                                        ref={(input) => { this.itemInput = input; }} 
                                        value={this.state.roomName} 
                                        onChange={(e) => this.handleEmailChange(e)}
                                        placeholder={'jonsnow@gmail.com'} 
                                    />
                                    <div className ="formError">{this.state.formError}</div>
                                    <div className="backupDetails">
                                        A reference to each of your lists is stored in your browsers storage. This allows you to save lists without ever creating a 'Grocery list' account.                                          
                                        However, if the storage (browser cache) is ever cleared, you may see your lists disappear.  To prevent this, you can email all your list codes to yourself at anytime from here.
                                        <br></br>
                                        <br></br>
                                        <b>Note</b> - your email is not saved and will only be used to email you a backup of your list codes upon request.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tools">
                            <div className="toolSection">
                                <button type="submit" value="Submit" className="confirm">Backup</button>
                            </div>
                            <div className="toolSection">
                                <button onClick={() => this.props.triggerClose()} className="delete">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default BackupModal;