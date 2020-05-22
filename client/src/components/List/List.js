import React from 'react';
import moment from 'moment-timezone';
import {withRouter} from 'react-router-dom';
import ListItem from '../ListItem/ListItem';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import AddEditModal from '../AddEditModal/AddEditModal';
import {AiOutlinePrinter, AiOutlineDelete, AiOutlineUnorderedList, AiOutlineTag} from 'react-icons/ai'
import {GrAdd} from 'react-icons/gr';
import './List.scss';

moment().tz("America/Los_Angeles").format();

class List extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            confirmOpen: false,
            addOpen: false,
            edit: {open: false, data: null}
        };
    }

    formatTime(date){
        let millis = Date.parse(date);
        return moment(millis).tz("America/Los_Angeles").format("ddd, MMM Do, h:mm a")
    }

    populateListItems(){
        if(this.props.list.list.length > 0){
            let categoryMap = {};

            for(let item of this.props.list.list){

                if(item.category in categoryMap){
                    categoryMap[item.category].push(item);
                } else{
                    categoryMap[item.category] = [item];
                }
            }

            return Object.keys(categoryMap).map(category => {
                return (
                    <div key={category} className="categoryWrapper">
                        <div className="categoryTitle">{category}</div>
                        <div className="categoryContent">
                        {
                            categoryMap[category].map(item => {
                                return (
                                    <ListItem 
                                        key={item._id} 
                                        roomId={this.props.roomId}
                                        item={{...item, date: this.formatTime(item.date)}}
                                        fetchNewList={this.props.fetchNewList}
                                        edit={(data) => {
                                            this.setState({edit: {open: true, data}})
                                        }}
                                    />
                                )
                            })
                        }
                        </div>
                    </div>
                );
            });
        } else{return null}
    }

    renderList(){
        if(this.props.list){
            if(this.props.list.list.length === 0){
                return(
                    <div className={`emptyListPlaceholder`}>
                        No Items Found!
                    </div>
                )
            } else{
                return(
                    <div className={`list`}>
                        {this.props.list ? this.populateListItems() : 'loading...'}
                    </div>
                );
            }
        }else{
            return null;
        }
    }

    renderTitleBar(){
        return (
            <div className="titleBarWrapper">
                <div className="print">
                    <button 
                        className={`yellow printBtn`}
                        onClick={() => this.props.handlePrintClick()}
                    >
                        <div>Print List</div> 
                        <AiOutlinePrinter className="btnIcon"/> 
                    </button>
                </div>
            </div>
        )
    }

    render(){
        return (
            <div className={`listWrapper`}>
                {this.renderList()}
                
                {this.state.confirmOpen ? 
                    <ConfirmModal
                        triggerClose={() => this.setState({confirmOpen: false})}
                        message={'Do you want to clear the list?'}
                        confirm={() => {
                            this.clearList();
                            this.setState({confirmOpen: false});
                        }}
                    /> : null
                }

                {this.state.edit.open ? 
                    <AddEditModal
                        context={'Edit Item'}
                        populate={this.state.edit.data}
                        triggerClose={() => this.setState({edit: {open: false, data: null}})}
                        addItem={(item) => this.editItem(item)}
                    /> : null
                }

                {
                    this.state.addOpen ?
                    <AddEditModal
                        context={'Add Item'}
                        triggerClose={() => this.setState({addOpen: false})}
                        addItem={(item) => this.addItem(item)}
                    /> : null
                }

                <div className={`listFooter`}>
                    <div className="footerDiv">
                        <button onClick={() => this.setState({confirmOpen: true})} className={`red`}>
                            <AiOutlineDelete className={`btnIcon`}/> 
                        </button>
                    </div>
                    <div className="footerDiv">
                            <button className="roomsButton yellow" onClick={() => {this.props.history.push('/rooms');}}>
                                <AiOutlineUnorderedList className={`btnIcon`}/> 
                            </button>
                    </div>
                    <div className="footerDiv">
                        <button onClick={() => this.setState({addOpen: true})} className={`green`}>
                            <GrAdd className={`btnIcon`}/> 
                        </button>
                    </div>
                </div>
                <div className="roomCodeWrapper">
                    <div className="roomCode"><AiOutlineTag className="roomCodeIcon"/>List Code: {this.props.roomCode} </div>
                </div>
              
                {this.renderTitleBar() }
                
            </div>
        );
    }

    async addItem(item){
        this.setState({addOpen: false});

        console.log(this.props.roomId);

        await fetch(`/api/room/${this.props.roomId}/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        this.props.fetchNewList();
    }

    async editItem(item){
        let itemID = this.state.edit.data._id;
        this.setState({edit: {open: false, data: null}});

        await fetch(`/api/room/${this.props.roomId}/list/${itemID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        this.props.fetchNewList();
    }

    async clearList(){
        await fetch(`/api/room/${this.props.roomId}/list`, {method: 'DELETE'});
        //Update list
        this.props.fetchNewList();
    }
}

export default withRouter(List);