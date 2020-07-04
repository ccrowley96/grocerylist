import React from 'react';
import './ConfirmModal.scss';

class ConfirmModal extends React.Component{

    componentDidMount(){
        document.body.style.overflow = 'hidden';
        this.confirm.focus(); 
    }

    componentWillUnmount(){
        document.body.style.overflow = 'unset';
    }

    render(){
        return(
            <div className="confirmModalBlocker">
                <div className="confirmModal">
                    <div className="confirmSection confirmText">
                        {this.props.message}
                    </div>
                    {this.props.children ?
                        this.props.children
                    : null}
                    <div className="confirmSection confirmTools">
                        <div className="buttonSection">
                            <button onClick={() => this.props.confirm()} className="green" ref={(input) => { this.confirm = input; }}>Confirm</button>
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

export default ConfirmModal;