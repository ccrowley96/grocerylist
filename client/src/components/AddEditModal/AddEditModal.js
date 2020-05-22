import React from 'react';
import {groceryCategories} from '../../utils/utils'
import './AddEditModal.scss';

class AddEditModal extends React.Component{
    constructor(props){
        super(props);
        
        if(this.props.populate){
            this.state = {
                itemDesc: props.populate.content,
                itemCat: props.populate.category
            }
        } else{
            this.state = {
                itemDesc: '',
                itemCat: groceryCategories[0]
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

    handleDescChange(event) {
        let formError = this.state.formError
        if(event.target.value !== '') formError = '';
        this.setState({itemDesc: event.target.value, formError});
    }

    handleCatChange(event){
        this.setState({itemCat: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();

        if(this.state.itemDesc === ''){
            this.setState({formError: 'Description cannot be empty'})
            return;
        }

        this.props.addItem({
            content: this.state.itemDesc,
            category: this.state.itemCat
        })

        this.setState({itemDesc: ''});
    }

    render(){
        return(
            <div className="addEditModalBlocker">
                <div className="addEditModal">
                    <form className="modalWrapper" onSubmit={(e) => this.handleSubmit(e)}>
                        <div className="addTitle">
                            {this.props.context}
                        </div>
                        <div className ="formWrapper">
                            <div className="addForm" onSubmit={(e) => this.handleSubmit(e)}>
                                <div className="addFormItemDesc">
                                    <label>
                                        Item Description
                                    </label>
                                    <input className="formItem" type="text" name="itemDesc" 
                                        ref={(input) => { this.itemInput = input; }} 
                                        value={this.state.itemDesc} 
                                        onChange={(e) => this.handleDescChange(e)}
                                        placeholder={'oreos...'} 
                                        maxLength={140}
                                        // TODO add random placeholder item generation
                                    />
                                    <label>
                                        Grocery Category (optional)
                                    </label>
                                    <select className = "formItem" type="text" name="itemCat"
                                        value={this.state.itemCat} 
                                        onChange={(e) => this.handleCatChange(e)}
                                    >
                                        {groceryCategories.map((category) => {
                                            return (<option key={category}>{category}</option>)
                                        })}
                                    </select>
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

export default AddEditModal;