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
                            {this.props.message}
                        </div>
                        <div className="confirmSection confirmTools">
                            <div className="buttonSection">
                                <button onClick={() => this.props.confirm()} className="green">Confirm</button>
                            </div>
                            <div className="buttonSection">
                                <button onClick={() => this.props.triggerClose()} className="red">Cancel</button>
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