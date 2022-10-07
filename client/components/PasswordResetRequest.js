//be able to update user info

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class PasswordResetRequest extends React.Component {
    constructor(){
        super()
        this.state = {
            email: '',
            password_email_sent: false
        }
        this.updatepassword = this.updatepassword.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(ev){
        this.setState({[ev.target.name]: ev.target.value});
    }
    async updatepassword(ev) {
        try{
          ev.preventDefault();
          await axios.post('/api/passwordResetRequest', this.state);
          this.setState({password_email_sent: true});
          this.setState({password_reset: false})
        }
        catch(ex){
          alert("No user found with that email")
          console.log(ex);
        }
    }
    render() {
        const { handleChange, updatepassword } = this;
        const { password_email_sent, email } = this.state;
        return (
            <div className="password-reset">
                {
                password_email_sent ?
                    <div>Check your email to continue with password reset.</div> :
                    <form onSubmit={ updatepassword }>
                        Password Reset: What is the email associated with your account? <br></br>
                        Email: <input name='email' onChange={ handleChange } value={ email }/>
                        <button>Reset Password</button>
                    </form>
                }
            </div>
        )
    }
};

export default connect(null, null)(PasswordResetRequest);