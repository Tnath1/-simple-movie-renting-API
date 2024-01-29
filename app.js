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
    if (amount > this.balance) {
      throw new Error("Insufficient balance. Please recharge your account.");
    }
    this.balance -= amount;
  }
}

const users = [
  new User("mcdave", "Mc1234", "David", 100),
  new User("arome", "Ar4321", "Arome", 150),
  new User("nate", "Na0987", "Nathan", 200),
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
  new Movie(1, "The Dark Knight", "Action", true, 10),
  new Movie(2, "The Hangover", "Comedy", true, 8),
  new Movie(3, "Forrest Gump", "Drama", true, 12),
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
    if (hour >= 1 && hour < 12) {
      greeting = "Good morning";
    } else if (hour >= 12 && hour < 13) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }
    return greeting;
  }

  displayWelcomeMessage(user) {
    this.clearScreen();
    const greeting = this.greetUser();
    console.log(`${greeting}, ${user.name}!`);
    console.log("Welcome to AU's Movie renting app.");
    console.log(`Your balance is: $${user.balance}`);
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

  rentMovies() {
    this.rl.question(
      "Enter the number(s) of the movie(s) you want to rent (separated by commas): ",
      (movieIds) => {
        const ids = movieIds.split(",").map((id) => parseInt(id.trim()));
        const selectedMovies = movies.filter((movie) => ids.includes(movie.id));

        const totalCost = selectedMovies.reduce(
          (total, movie) => total + movie.rentalCost,
          0
        );

        try {
          this.currentUser.deductBalance(totalCost);

          selectedMovies.forEach((movie) => {
            movie.available = false;
            this.clearScreen();
            console.log(
              `You have rented "${movie.title}" for $${movie.rentalCost}.`
            );
          });

          console.log(
            `Your available balance is: $${this.currentUser.balance}`
          );
          this.promptAction();
        } catch (error) {
          console.log(error.message);
          this.promptAction();
        }
      }
    );
  }

  promptAction() {
    this.rl.question(
      "Do you want to rent more movies? (yes/no): ",
      (answer) => {
        if (answer.toLowerCase() === "yes") {
          this.clearScreen();
          this.displayMovies();
          this.rentMovies();
        } else if (answer.toLowerCase() === "no") {
          this.clearScreen();
          console.log("Thank you for using AU's Movie renting app. Goodbye!");
          this.currentUser = null;
          this.rl.close();
        } else {
          this.clearScreen();
          console.log("Invalid input. Please try again.");
          this.promptAction();
        }
      }
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
          this.rentMovies();
        } catch (error) {
          console.error(error.message);
          this.promptLogin();
        }
      });
    });
  }

  startApp() {
    console.log("Welcome to AU's Movie renting app.");
    this.promptLogin();
  }
}

const app = new MovieRentingApp();
app.startApp();
