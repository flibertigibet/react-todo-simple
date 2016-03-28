import Firebase from 'firebase';

export const firebaseRef = new Firebase("https://myfirst-todo.firebaseio.com");

export function createUser(user){
  firebaseRef.createUser({
    email: user.id,
    password: user.pass
    }, (error, userData) => {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
    }
  });
}

export function loginWithAuth(user){
  firebaseRef.authWithPassword({
    email: user.id,
    password: user.pass
  }, function (error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
  }, {
    remember: "sessionOnly"
  });
}
