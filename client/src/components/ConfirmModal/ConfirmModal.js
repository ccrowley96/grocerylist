import React from 'react';
import './ConfirmModal.scss';

class ConfirmModal extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        if(this.props.open){
            return(
                <div className="confirmModalBlocker">
                    <div className="confirmModal">
                        <div className="confirmSection confirmText">
                            Do you want to clear the list?
                        </div>
                        <div className="confirmSection confirmTools">
                            <div className="buttonSection">
                                <button onClick={() => this.props.confirm()} className="confirm">Confirm</button>
                            </div>
                            <div className="buttonSection">
                                <button onClick={() => this.props.triggerClose()} className="cancel">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else{
            return null;
        }
        
    }
}

export default ConfirmModal;