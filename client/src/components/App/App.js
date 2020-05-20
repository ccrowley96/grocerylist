import React from 'react';
import List from '../List/List'
import isMobile from 'ismobilejs';
import './App.scss';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      list: null
    }
  }

  updateList(){
    fetch(`/api/list`)
      .then(response => response.json())
      .then(list => {
        console.log('List updated: ', list)
        this.setState({list})
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidMount() {
    this.updateList();
  }

  handlePrintClick(){
    window.open('/print');
  }

  render(){
    return(
      <div className = {`appWrapper${isMobile().any ? ' mobile' : ''}`}>
        <List 
          list={this.state.list} 
          fetchNewList={() => this.updateList()}
          handlePrintClick={() => this.handlePrintClick()}
        />
      </div>
    )
  }
}

export default App;
