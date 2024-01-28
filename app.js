// const readline = require("readline");

// class User {
//   constructor(username, password, name) {
//     this.username = username;
//     this.password = password;
//     this.name = name;
//   }

//   authenticate(password) {
//     return this.password === password;
//   }
// }

// const users = [
//   new User("user1", "password1", "Alice"),
//   new User("user2", "password2", "Bob"),
//   new User("user3", "password3", "Charlie"),
//   new User("user4", "password4", "David"),
//   new User("user5", "password5", "Eve"),
//   new User("user6", "password6", "Frank"),
//   new User("user7", "password7", "Grace"),
//   new User("user8", "password8", "Harry"),
//   new User("user9", "password9", "Ivy"),
//   new User("user10", "password10", "Jack"),
// ];

// class MovieRentingApp {
//   constructor() {
//     this.rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout,
//     });
//   }

//   clearScreen() {
//     // ANSI escape code to clear the terminal screen
//     process.stdout.write("\x1B[2J\x1B[0f");
//   }

//   greetUser() {
//     const now = new Date();
//     const hour = now.getHours();
//     let greeting = "";
//     if (hour >= 5 && hour < 12) {
//       greeting = "Good morning";
//     } else if (hour >= 12 && hour < 18) {
//       greeting = "Good afternoon";
//     } else {
//       greeting = "Good evening";
//     }
//     return greeting;
//   }

//   displayWelcomeMessage(user) {
//     this.clearScreen();

//     console.log(`${this.greetUser()}, ${user.name}!`);
//     console.log("Welcome to AU's renting app.");
//   }

//   authenticateUser(username, password) {
//     const user = users.find((u) => u.username === username);
//     if (user && user.authenticate(password)) {
//       return user;
//     } else {
//       throw new Error("Invalid username or password.");
//     }
//   }

//   promptLogin() {
//     this.rl.question("Enter your username: ", (username) => {
//       this.rl.question("Enter your password: ", (password) => {
//         try {
//           const user = this.authenticateUser(username, password);
//           this.displayWelcomeMessage(user);
//           this.rl.close();
//         } catch (error) {
//           console.error(error.message);
//           this.promptLogin();
//         }
//       });
//     });
//   }

//   startApp() {
//     console.log("Welcome to AU's renting app.");
//     this.promptLogin();
//   }
// }

// // Create an instance of MovieRentingApp and start the application
// const app = new MovieRentingApp();
// app.startApp();

const readline = require("readline");

class User {
  constructor(username, password, name, balance) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.balance = balance;
  }

  authenticate(password) {
    return this.password === password;
  }

  deductBalance(amount) {
    this.balance -= amount;
  }
}

const users = [
  new User("user1", "password1", "Alice", 100),
  new User("user2", "password2", "Bob", 150),
  new User("user3", "password3", "Charlie", 200),
  // Add more users with their balances
];

class Movie {
  constructor(id, title, genre, available, rentalCost) {
    this.id = id;
    this.title = title;
    this.genre = genre;
    this.available = available;
    this.rentalCost = rentalCost;
  }
}

const movies = [
  new Movie(1, "Movie 1", "Action", true, 10),
  new Movie(2, "Movie 2", "Comedy", true, 8),
  new Movie(3, "Movie 3", "Drama", true, 12),
  // Add more movies
];

class MovieRentingApp {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.currentUser = null;
  }

  clearScreen() {
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
    console.log(`Your balance: $${user.balance}`);
  }

  displayMovies() {
    console.log("\nAvailable movies for renting:");
    movies.forEach((movie) => {
      if (movie.available) {
        console.log(
          `${movie.id}. ${movie.title} (${movie.genre}) - $${movie.rentalCost}`
        );
      }
    });
  }

  rentMovie(movieId) {
    const movie = movies.find((movie) => movie.id === movieId);
    if (!movie || !movie.available) {
      console.log("Invalid movie selection. Please try again.");
      return;
    }

    if (this.currentUser.balance < movie.rentalCost) {
      console.log("Insufficient balance. Please recharge your account.");
      return;
    }

    movie.available = false;
    this.currentUser.deductBalance(movie.rentalCost);
    console.log(`You have rented "${movie.title}" for $${movie.rentalCost}.`);
    console.log(
      `Your available balance after deduction: $${this.currentUser.balance}`
    );
  }

  promptLogin() {
    this.rl.question("Enter your username: ", (username) => {
      this.rl.question("Enter your password: ", (password) => {
        try {
          const user = users.find((u) => u.username === username);
          if (!user || !user.authenticate(password)) {
            throw new Error("Invalid username or password.");
          }
          this.currentUser = user;
          this.displayWelcomeMessage(user);
          this.displayMovies();
          this.rl.question(
            "Enter the ID of the movie you want to rent: ",
            (movieId) => {
              this.rentMovie(parseInt(movieId));
              this.rl.question(
                "Do you want to log out? (yes/no): ",
                (answer) => {
                  if (answer.toLowerCase() === "yes") {
                    this.currentUser = null;
                    console.log("You have logged out.");
                    this.rl.close();
                  } else {
                    this.promptLogin();
                  }
                }
              );
            }
          );
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

const app = new MovieRentingApp();
app.startApp();
