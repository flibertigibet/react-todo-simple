import Firebase from 'firebase';
import {loginWithAuth} from '../network/auth';
import {createUser} from '../network/auth';
import {firebaseRef} from '../network/auth'

export function login(user){
  loginWithAuth(user);
  this.itemsRef=firebaseRef.child("items");
  this.itemsRef.on("child_added", dataSnapshot => {
    this.state.todos.push(dataSnapshot.val());
    this.setState({
      todos: this.state.todos
    });
  });
}
