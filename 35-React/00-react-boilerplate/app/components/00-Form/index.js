import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

class App extends Component {
  render() {
    return (
      <Register />
    );
  }
}

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => {
    val.length > 0 && (valid = false)
  });
  return valid;
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      email: null,
      phone: null,
      errors: {
        fullName: '',
        email: '',
        phone: '',
      }
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'fullName':
        errors.fullName =
          value.length < 5
            ? 'Full Name must be 5 characters long!'
            : '';
        break;
      case 'email':
        errors.email =
          validEmailRegex.test(value)
            ? ''
            : 'Email is not valid!';
        break;
      case 'phone':
        errors.phone =
          value.length < 8
            ? 'Phone must be 8 characters long!'
            : '';
        break;
      default:
        break;
    }

    this.setState({errors, [name]: value});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if(validateForm(this.state.errors)) {
      console.info('Valid Form')
      this.send(this.state.data);
    }else{
      console.error('Invalid Form')
    }
  };

  render() {
    const {errors} = this.state;
    return (
      <div className='wrapper'>
        <div className='form-wrapper'>
          <h2>Create Account</h2>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className='fullName'>
              <label htmlFor="fullName">Full Name</label>
              <input type='text' name='fullName' onChange={this.handleChange} noValidate />
              {errors.fullName.length > 0 &&
              <span className='error'>{errors.fullName}</span>}
            </div>
            <div className='email'>
              <label htmlFor="email">Email</label>
              <input type='email' name='email' onChange={this.handleChange} noValidate />
              {errors.email.length > 0 &&
              <span className='error'>{errors.email}</span>}
            </div>
            <div className='phone'>
              <label htmlFor="phone">Phone</label>
              <input type='text' name='phone' onChange={this.handleChange} noValidate />
              {errors.phone.length > 0 &&
              <span className='error'>{errors.phone}</span>}
            </div>
            <div className='info'>
              <small>Password must be eight characters in length.</small>
            </div>
            <div className='submit'>
              <button>Create</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
