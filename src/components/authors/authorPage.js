"use strict";

var React = require('react');
var AA = require('../../api/authorApi');
var AuthorList = require('./authorList');

var Authors = React.createClass({
  getInitialState: function(){
    return {
      authors: []
    };
  },
  componentDidMount: function(){
    if(this.isMounted()){
      this.setState({ authors: AA.getAllAuthors() });
    }
  },
  render: function(){
    return (
      <div>
        <AuthorList authors={this.state.authors} />
      </div>
    );
  }
});

module.exports = Authors;
