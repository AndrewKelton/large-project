# AI Assistance Disclosure

## Frontend

This project was developed with assistance from generative AI tools:

- **Tool**: ChatGPT 5.1 (OpenAI)
- **Dates**: April 4, 2026
- **Scope**: Generate App Logo
- **Use**: Used Chat to generate a logo for the "KnightRate" app.

- **Tool**: Claude Sonnet 4.6 (Anthropic)
- **Dates**: March 21 - April 13, 2026
- **Scope**: Function desgin, formatting, and React/TypeScript standards
- **Use**: Collaborated with Claude throughout the project to help understand
how to implement functions in TypeScript/React. For example, charts, updating
states "onChange"(s), etc.

- **Tool**: Claude Sonnet 4.6 (Anthropic)
- **Dates**: April 10 - April 12, 2026
- **Scope**: CSS Styling on Web App
- **Use**: Collaborated with Claude to help me match the styling of the mobile
app, given the context of the mobile app's layout and color schemes.

- **Tool**: Claude Sonnet 4.6 (Anthropic)
- **Dates**: April 15, 2026
- **Scope**: Generate Unit + Integration Tests
- **Use**: Gave Claude the task to generate Integration and Unit Tests for
the frontend and backend, including mail tests, button tests, overall functionality,
and workflow of the program. Specified to use the bottom-up approach, testing:
mongoose -> route handling -> integration tests -> frontend components.

All AI-generated code was reviewed, tested, and modified to meet
assignment requirements. Final implementation reflects my understanding
of the concepts.

- Andrew Kelton Frontend Developer

---

- **Tool**: ChatGPT 5.3 (By OpenAI)
- **Dates**: March 25th - March 26th 2026
- **Scope**: Function Design and Basics of Using React with Typescript in the context of The Large Project to complete Registration and Logout
- **Use**: Generated functions on how to make inputs, page design, and link to the API, based on the Login page to register new accounts. Along the way, it showed me what each component of each function meant, so I could gain knowledge on the subject and not rely on it as much in the future. It also showed me how to remove the token generateds for a user to make a functioning log out button!

All AI-generated code was reviewed, tested, and modified to meet
assignment requirements. Final implementation reflects my understanding
of the concepts.

- **Tool**: ChatGPT 5.3 (By OpenAI)
- **Dates**: April 1st, and April 4th, 2026
- **Scope**: Function Design and Basics of Using React with Typescript in the context of The Large Project to add in functionality for creating a rating on our site.
- **Use**: Generated functions on how to set up dropdown boxes, determine if a user wants to rate a professor, how to map responses into the database, and communicate properly with the API, all while creating a rating. It helped me discover and fix a bug in retriving user IDs when logging in. I had to add this to the backend, because without it, the API won't allow a user to submit a rating, despite being logged in. Along the way, it showed me what each component of each function meant, so I could gain knowledge on the subject and hopefully not rely on it as much in the future.

All AI-generated code was reviewed, tested, and modified to meet
assignment requirements. Final implementation reflects my understanding
of the concepts.

- Adam Betinsky: Frontend Developer

---

## Backend

This project was developed with assistance from generative AI tools:

- **Tool**: Claude Sonnet 4.6 (Anthropic)
- **Dates**: March 21, 2026 - April 14, 2026
- **Scope**: Used to aide with development of APIs and debugging
- **Use**: (see below)
  1. Sonnet 4.6 helped in understanding how to build MERN stack APIs, as I was totally unfamiliar.
  2. Gave me ideas about how to proceed with multiple elements of implementation for the APIs.
  3. Aided in the logical elements of register and login functionalities, as well as createRating and professor + courseID creation and how those interact to pull information from the DB.
  4. Helped debug issues with NodeMailer in the initial email verification implementation and generated code to modify mailman.js and register + login.js to use Resend instead.

All AI-generated code was reviewed, tested, and modified to meet
assignment requirements. Final implementation reflects my understanding
of the concepts.

- JC Gallo: API Developer

---

## Mobile

This project was developed with assistance from generative AI tools:

- **Tool**: Claude 4.6 (Anthropic)
- **Dates**: March 31, 2026 to April 14, 2026
- **Scope**:  Used to aide with developing dart code for flutter 
- **Use**: (see below)
1.  Generated code for Timer object on a textfield that was used to call the search API following some specified time after the last keyboard event.
2.  Generated code for using RouteObserver object and inheriting RouteAware to allow the program to listen for route changes that could then be used to re-build and/or clear textfields when using the back button in the appBar.
3.  Generated code for the pagination feature on the course and course+professor questionnaire results diplays on the home screen.  Originally the mobile app was programmed to display the entire list of questionnaire results on the screen.  AI was used to find a way to incorporate pagination with minimal changes to the original code.
4.  Generate code for radio button form template used on the create rating page.
5.  Generate code for creating a widget key and passing it through a constructor to force a page re-build.
6.  Generate code for the GlobalData class in a way that allowed the inheritance of ChangeNotifier, which creates a listener for when global data is read or set.

All AI-generated code was reviewed, tested, and modified to meet
assignment requirements. Final implementation reflects my understanding
of the concepts.

- Name: Phillip Lintereur (Mobile Developer and PM)

---

- **Tool**: Claude 4.6 (Anthropic)
- **Dates**: March 31, 2026 to April 14, 2026
- **Scope**:  Used to aide with developing dart code for flutter 
- **Use**: (see below)
1. Aided in understanding difference between state class vs widget class in Dart
2. Generated code for container backgrounds for displaying rating/questionnaire information
3. Generated code for scaling widgets and color schemes
4. Generated code for displaying empty stars, half stars, and full stars in rows
5. Generated code for percent bars on questionnaire cards in columns
6. General debugging when unintended behavior occurred
7. Deciphering of error messages and stack traces from Dart SDK.

All AI-generated code was reviewed, tested, and modified to meet
assignment requirements. Final implementation reflects my understanding
of the concepts.

- Name: Leandro Vivares (Backend and Mobile Developer)

## Database
This project was developed with assistance from generative AI tools:

- **Tool**: Claude 4.6 (Anthropic)
- **Dates**: April 2, 2026 to April 14, 2026
- **Scope**:  Used in helping with MongoDB structure, design, and queries
- **Use**: (see below)
1. Used to generate queries to sanitize database via find() and deleteMany() queries,
2. Used to generate proper mongoose models for proper typing and sound validation
3. Translated MySQL concepts to MongoDB (i.e. document -> object, collection -> table, database = database)
4. Generated JSONs ~100 across several collections for testing and demonstration purposes
5. Helped with bash commands for creating backups and snapshots of the database for data recovery
6. Aided in creating relationships between collections and removing redundancies

All AI-generated code was reviewed, tested, and modified to meet
assignment requirements. Final implementation reflects my understanding
of the concepts.

- Name: Leandro Vivares Database Developer
