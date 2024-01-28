const readline = require("readline");

class User {
  constructor(username, password, name) {
    this.username = username;
    this.password = password;
    this.name = name;
  }

  authenticate(password) {
    return this.password === password;
  }
}

const users = [
  new User("user1", "password1", "Alice"),
  new User("user2", "password2", "Bob"),
  new User("user3", "password3", "Charlie"),
  new User("user4", "password4", "David"),
  new User("user5", "password5", "Eve"),
  new User("user6", "password6", "Frank"),
  new User("user7", "password7", "Grace"),
  new User("user8", "password8", "Harry"),
  new User("user9", "password9", "Ivy"),
  new User("user10", "password10", "Jack"),
];

class MovieRentingApp {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  clearScreen() {
    // ANSI escape code to clear the terminal screen
    process.stdout.write("\x1B[2J\x1B[0f");
  }

  greetUser() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "";
    if (hour >= 5 && hour < 12) {
      greeting = "Good morning";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }
    return greeting;
  }

  displayWelcomeMessage(user) {
    this.clearScreen();

    console.log(`${this.greetUser()}, ${user.name}!`);
    console.log("Welcome to AU's renting app.");
  }

  authenticateUser(username, password) {
    const user = users.find((u) => u.username === username);
    if (user && user.authenticate(password)) {
      return user;
    } else {
      throw new Error("Invalid username or password.");
    }
  }

  promptLogin() {
    this.rl.question("Enter your username: ", (username) => {
      this.rl.question("Enter your password: ", (password) => {
        try {
          const user = this.authenticateUser(username, password);
          this.displayWelcomeMessage(user);
          this.rl.close();
        } catch (error) {
          console.error(error.message);
          this.promptLogin();
        }
      });
    });
  }

  startApp() {
    console.log("Welcome to AU's renting app.");
    this.promptLogin();
  }
}

// Create an instance of MovieRentingApp and start the application
const app = new MovieRentingApp();
app.startApp();
