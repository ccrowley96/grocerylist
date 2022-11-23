import React from 'react';
import './DeprecateModal.scss';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class DeprecateModal extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    componentDidMount(){
        document.body.style.overflow = 'hidden';
    }

    componentWillUnmount(){
        document.body.style.overflow = 'unset';
    }

    render(){
        return(
            <div className="DeprecateModalBlocker">
                <div className="DeprecateModal">
                    <form className="modalWrapper" onSubmit={(e) => this.handleSubmit(e)}>
                        <div className="addTitle">
                            Grocery list is shutting down!
                        </div>
                        <div className ="formWrapper">
                            <div className="addForm" onSubmit={(e) => this.handleSubmit(e)}>
                                <div className="addFormItemDesc">
                                   <br></br>
                                    <div className="backupDetails">
                                        <div className="daTips">Please transfer your list data by Jan 1, 2023</div>
                                        <br></br>
                                        <b>Why is grocery list shutting down?</b> - There are now better alternatives to grocerylist.us.  I first built this app to both practice programming and solve a problem: free and easily shareable grocery lists.  There are now a number of better alternatives to this website for free and easily shareable grocery lists.  Additionally, it costs money to keep a website like this up, and because I'm no longer using this app (and currently unemployed hah), I've decided to shut down the service as of Jan 1, 2023.
                                        <br></br>
                                        <br></br>
                                        <b>What should I use for my grocery lists?</b>  - Personally, I've decided to switch to iPhone's new Reminders app.  It has an updated design that allows creation of <a href="https://www.youtube.com/shorts/L89lycvklEE" target='_blank'>shareable lists</a>.  These are native to iPhone & mac, very performant, will never lose data, work with <a href="https://support.apple.com/en-us/HT207122" target="_blank">widgets</a> & notify subscribers when they're updated.  They also work with siri - 'Hey siri, add Oat Milk to my Grocery list'.  <a href="https://www.youtube.com/watch?v=UcnIRXKoaP0&ab_channel=CarlPullein" target="_blank">Here's a video</a> on how to share a shopping list in the Reminder's app.
                                        <br></br>
                                        <br></br>
                                        If you use Android, I'd suggest checking out the <a href="https://www.anylist.com/android" target="_blank">AnyList app</a>.  It has tons of features and will be a solid replacement for grocerylist.us.
                                        <br></br>
                                        <br></br>
                                        <p>Thank you for using this app!  If you have any questions, feel free to reach out to me!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tools">
                            
                            <div className="toolSection">
                            <a className='disable' onClick={() => {this.props.triggerClose(); localStorage.setItem('isDeprectationSplashConfirmed', true)}}>Don't show again</a>
                                <button onClick={() => this.props.triggerClose()} className="delete closeBtn">Close</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default DeprecateModal;