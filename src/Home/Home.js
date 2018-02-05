import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

const apiBaseUrl = 'http://localhost:3000/api/test'
//const apiBaseUrl = 'http://api.ipify.org?format=json'

class Home extends Component {
  state = {}
  login() {
    this.props.auth.login();
  }

  setAccessResponse(field, data) {
    console.log('setAccessResponse:' + field + ':' + data)
    var newState = {}
    newState[field] = data ? 'OK' : 'denied'
    this.setState(newState);
  }

  createHeader() {
    const at = localStorage.getItem('access_token');
    console.log('Access token from storage:' + at)
    return 'Bearer ' + at
  }

  // add authorization header to api call
  fetch(method, action) {

    return fetch(apiBaseUrl + "/" + action, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.createHeader()
      }
    })
  }

  testAccess() {
    // test read
    this.fetch('get', 'read').then((resp) => resp.json()).then((data) => {
      console.log('data' + data)
      this.setAccessResponse('read', data)
    }).catch((error) => {
      this.setAccessResponse('read', false)
    });
    // test write
    this.fetch('post', 'write').then((resp) => resp.json()).then((data) => {
      this.setAccessResponse('write', data)
    }).catch((error) => {
      this.setAccessResponse('write', false)
    });

    // test delete
    this.fetch('post', 'delete').then((resp) => resp.json()).then((data) => {
      this.setAccessResponse('delete', data)
    }).catch((error) => {
      this.setAccessResponse('delete', false)
    });
  };

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div className="container">
        {
          isAuthenticated() &&
          (
            <div><h4>
              You are logged in !
            </h4>
              <Button bsStyle="primary" bsSize="large" onClick={this.testAccess.bind(this)}>
                Test API Access
            </Button>
              <h4>Read Access: {this.state.read}</h4>
              <h4>Write Access: {this.state.write}</h4>
              <h4>Delete Access: {this.state.delete}</h4>
            </div>)
        }
        {
          !isAuthenticated() && (
            <h4>
              You are not logged in! Please{' '}
              <a
                style={{ cursor: 'pointer' }}
                onClick={this.login.bind(this)}
              >
                Log In
                </a>
              {' '}to continue.
              </h4>
          )
        }
      </div>
    );
  }
}

export default Home;
