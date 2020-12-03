import React from 'react';
import ReactDOM from 'react-dom';

import { withAuthorization } from '../Session';
import './home.css'
import Firebase from '../Firebase/firebase.js'
import { AuthUserContext} from '../Session';
const { useState, Fragment } = React;


class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            messages: [],
            value: '',
            users: {}
        };

    }


    updateValue = ({ target }) => this.setState({value:target.value});

    updateMessages = async () => {
        const time = new Date().toLocaleTimeString('pt-br',{hour:'2-digit',minute:'2-digit'});
        const value = this.state.value;
        try{
            const lastMessage = this.state.messages[this.state.messages.length-1];
            let message = {
                uuid: lastMessage?lastMessage.uuid+1:1,
                mensagem:value,
                time:time,
                user:this.props.firebase.auth.currentUser.uid
            }
            await this.props.firebase.messages().push(message);
            this.setState({value:""});
        }catch(error){
            console.log(error)
        }
    }



    componentDidMount () {
        try{
            this.props.firebase.messages().on("value",async (messages) => {
                let mensagens = []
                const users = await this.props.firebase.users().get();
                this.setState({users:users.val()})
                messages.forEach((element) => {
                    const messageObject = element.val();
                    mensagens.push({...messageObject,userName:this.state.users[messageObject.user].username});
                });
                this.setState({
                    messages:mensagens
                });
            });
        }catch(error){
            console.log(error)
        }
    }

    render() {
        return (
            <Fragment>
                <div className="messagebox">
                    <NewMessage user={this.props.firebase.auth.currentUser.uid} messages={this.state.messages}/>
                </div>
                <div className="textbox">
                    <TextField handleOnChange={this.updateValue} value={this.state.value} />
                    <button className="btn--submit" onClick={this.updateMessages}>Send</button>
                </div>
            </Fragment>
        );
    }
}
function NewMessage({messages, user}){
    const listMessages = messages.map(message => {
        const userLoged = message.user === user;
        const classmessage = userLoged?"userLogged":"otherUser";

        return(<li key={message.uuid} className={classmessage}>
            <div className="message__container">
                <div className="user">{userLoged?"":message.userName}</div>
                <div style={{display:"flex",flexDirection:"row"}}>
                    <div>{message.mensagem}</div>
                    <div className="timeStamp">
                        <div>{message.time}</div>
                    </div>
                </div>
            </div>
        </li>)
    });
    return(
        <ul>{listMessages}</ul>
    )
};
const  TextField = ({ value, handleOnChange }) => (
    <textarea placeholder="Write your message" onChange={handleOnChange} value={value} />
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);