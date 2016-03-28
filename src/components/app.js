import React from 'react';
import TodosList from './todos-list';
import CreateTodo from './create-todo';
// import Firebase from 'firebase';
import {loginWithAuth} from '../network/auth';
// import {createUser} from '../network/auth';
import {firebaseRef} from '../network/auth'

var user = {
  id: "vadhirbhupathi@gmail.com",
  pass: "pakalupapito"
};

var todos = [

];

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      todos
    }
  }

  componentWillMount() {
    loginWithAuth(user);
    this.itemsRef=firebaseRef.child("items");
    this.itemsRef.on("child_added", dataSnapshot => {
      this.state.todos.push(dataSnapshot.val());
      this.setState({
        todos: this.state.todos
      });
    });
  }

  componentWillUnmount() {
    firebaseRef.off();
  }

  createTask(task){
    {/*this.state.todos.push({
      task,
      isComplete: false,
    });
    this.setState({todos: this.state.todos});*/}
    this.itemsRef.push({
      task,
      isComplete: false,
    });
  }

  toggleTask(task){
    const foundTodo = _.find(this.state.todos, todo => todo.task === task);
    foundTodo.isComplete = !foundTodo.isComplete;
    this.itemsRef.once("value", snapshot => {
      snapshot.forEach(childSnapshot => {
        if(childSnapshot.child('task').val()===task)
          childSnapshot.child('isComplete').ref().set(foundTodo.isComplete);
      });
    });
    this.setState({todos: this.state.todos});
  }

  render(){
    return(
      <div>
      <h1>React Todos App</h1>
      <CreateTodo
        todos={this.state.todos}
        createTask={this.createTask.bind(this)}
      />
      <TodosList
        todos={this.state.todos}
        toggleTask={this.toggleTask.bind(this)}
        saveTask={this.saveTask.bind(this)}
        deleteTask={this.deleteTask.bind(this)}
      />
      </div>
    );
  }

  saveTask(oldTask,newTask){
    this.itemsRef.once("value", snapshot => {
      snapshot.forEach(childSnapshot => {
        if(childSnapshot.child('task').val()===oldTask)
          childSnapshot.child('task').ref().set(newTask);
      });
    });
    const foundTodo = _.find(this.state.todos, todo => todo.task === oldTask);
    foundTodo.task = newTask;
    this.setState({todos: this.state.todos});
  }

  deleteTask(taskToDelete){
    this.itemsRef.once("value", snapshot => {
      snapshot.forEach(childSnapshot => {
        if(childSnapshot.child('task').val()===taskToDelete)
          childSnapshot.ref().remove();
      });
    });
    _.remove(this.state.todos,todo=>todo.task===taskToDelete);
    this.setState({todos: this.state.todos});
  }
}
