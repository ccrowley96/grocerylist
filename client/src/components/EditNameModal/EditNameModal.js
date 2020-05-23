import React from 'react';
import './EditNameModal.scss';

class EditNameModal extends React.Component{
    constructor(props){
        super(props);
        if(this.props.populate){
            this.state = {
                roomName: JSON.parse(localStorage.getItem('activeRoom')).roomName,
            }
        } else{
            this.state = {
                roomName: '',
            }
        }

        this.state.formError = '';
    }

    componentDidMount(){
        document.body.style.overflow = 'hidden';
        this.itemInput.focus(); 
    }

    componentWillUnmount(){
        document.body.style.overflow = 'unset';
    }

    handleNameChange(event) {
        let formError = this.state.formError
        if(event.target.value !== '') formError = '';
        this.setState({roomName: event.target.value, formError});
    }

    handleSubmit(event) {
        event.preventDefault();

        if(this.state.roomName === ''){
            this.setState({formError: 'Description cannot be empty'})
            return;
        }

        this.props.confirm(this.state.roomName);

        this.setState({roomName: ''});
    }

    render(){
        return(
            <div className="editNameModalBlocker">
                <div className="editNameModal">
                    <form className="modalWrapper" onSubmit={(e) => this.handleSubmit(e)}>
                        <div className="addTitle">
                            {this.props.context}
                        </div>
                        <div className ="formWrapper">
                            <div className="addForm" onSubmit={(e) => this.handleSubmit(e)}>
                                <div className="addFormItemDesc">
                                    <label>
                                        Room Name
                                    </label>
                                    <input className="formItem" type="text" name="roomName" 
                                        ref={(input) => { this.itemInput = input; }} 
                                        value={this.state.roomName} 
                                        onChange={(e) => this.handleNameChange(e)}
                                        placeholder={'Enter room name...'} 
                                        maxLength={40}
                                    />
                                    <div className ="formError">{this.state.formError}</div>
                                </div>
                            </div>
                        </div>
                        <div className="tools">
                            <div className="toolSection">
                                <button type="submit" value="Submit" className="green">{this.props.context}</button>
                            </div>
                            <div className="toolSection">
                                <button onClick={() => this.props.triggerClose()} className="red">Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default EditNameModal;