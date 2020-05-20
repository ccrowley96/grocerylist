import React from 'react';
import moment from 'moment-timezone';
import ListItem from '../ListItem/ListItem';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import AddModal from '../AddModal/AddModal';
import isMobile from 'ismobilejs';
import {AiOutlinePrinter, AiOutlineDelete} from 'react-icons/ai'
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
        if(this.props.list.items.length > 0){
            let categoryMap = {};

            for(let item of this.props.list.items){

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
                                        itemID={item._id} 
                                        content={item.content} 
                                        category={item.category}
                                        datetime={this.formatTime(item.date)}
                                        checked={item.checked}
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
            if(this.props.list.items.length == 0){
                return(
                    <div className={`emptyListPlaceholder${isMobile().any ? ' mobile' : ''}`}>
                        No Items Found!
                    </div>
                )
            } else{
                return(
                    <div className={`list${isMobile().any ? ' mobile' : ''}`}>
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
                <div className="title">
                    ourList
                </div>

                <div className="print">
                    <button 
                        className={`yellow printBtn${isMobile().any ? ' mobile' : ''}`}
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
            <div className={`listWrapper${isMobile().any ? ' mobile' : ''}`}>
                {!isMobile().any ? 
                    this.renderTitleBar() : null
                }

                {this.renderList()}

                <ConfirmModal 
                    open={this.state.confirmOpen} 
                    triggerClose={() => this.setState({confirmOpen: false})}
                    message={'Do you want to clear the list?'}
                    confirm={() => {
                        this.clearList();
                        this.setState({confirmOpen: false});
                    }}
                />

                {this.state.edit.open ? 
                    <AddModal
                        context={'Edit Item'}
                        populate={this.state.edit.data}
                        triggerClose={() => this.setState({edit: {open: false, data: null}})}
                        addItem={(item) => this.editItem(item)}
                    /> : null
                }

                {
                    this.state.addOpen ?
                    <AddModal
                        context={'Add Item'}
                        triggerClose={() => this.setState({addOpen: false})}
                        addItem={(item) => this.props.addItem(item)}
                    /> : null
                }

                <div className={`listFooter${isMobile().any ? ' mobile' : ''}`}>
                    <div className="footerDiv">
                        <button onClick={() => this.setState({confirmOpen: true})} className={`red${isMobile().any ? ' mobile' : ''}`}>
                            <div>Clear List</div> 
                            <AiOutlineDelete className={`btnIcon${isMobile().any ? ' mobile' : ''}`}/> 
                        </button>
                    </div>
                    <div className="footerDiv">
                        <button onClick={() => this.setState({addOpen: true})} className={`green${isMobile().any ? ' mobile' : ''}`}>
                            <div>Add Item</div> 
                            <GrAdd className={`btnIcon${isMobile().any ? ' mobile' : ''}`}/> 
                        </button>
                    </div>
                </div>
                {isMobile().any ? 
                    this.renderTitleBar() : null
                }
            </div>
        );
    }

    async addItem(item){
        this.setState({addOpen: false});

        await fetch('/api/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        this.props.fetchNewList();
    }

    async editItem(item){

        let itemID = this.state.edit.data.id;
        this.setState({edit: {open: false, data: null}});

        await fetch(`/api/list/${itemID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });

        this.props.fetchNewList();
    }

    async clearList(){
        await fetch('/api/list', {method: 'DELETE'});
        //Update list
        this.props.fetchNewList();
    }
}

export default List;