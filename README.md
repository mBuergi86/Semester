# term_web_innovativ

## Overview
`term_web_innovativ` is a web-based application showcasing innovative web technologies and techniques. It includes various HTML, CSS, and JavaScript components to demonstrate different aspects of web development, now served using a Bun server for enhanced performance and functionality.

## Features
- **Responsive Design**: Optimized for various screen sizes and devices.
- **Interactive Elements**: Includes a game and dynamic content for enhanced user engagement.
- **Modular Codebase**: Organized into scripts, styles, and HTML files for better maintainability.
- **Bun Server**: Utilizes Bun for efficient serving of static files and potential future server-side functionality.

## Project Structure
```
term_web_innovativ/
├── public/
│   ├── scripts/
│   ├── src/
│   ├── styles/
│   ├── index.html
│   ├── aboutme.html
│   ├── contact.html
│   ├── game.html
│   └── project.html
├── bun.lockb
├── index.js
├── jsconfig.json
└── package.json
```

## Technologies Used
- **HTML**: For structuring content.
- **CSS**: For styling and layout.
- **JavaScript**: For interactive features and server-side logic.
- **Bun**: As the server runtime environment.

## Setup
To run this project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/mBuergi86/term_web_innovativ.git
   cd term_web_innovativ
   ```

2. Ensure you have Bun installed. If not, install it following the instructions at [bun.sh](https://bun.sh).

3. Install dependencies:
   ```sh
   bun install
   ```

4. Start the server:
   ```sh
   bun run index.js
   ```

5. Open your web browser and navigate to `http://localhost:3000` (or the port specified in your server configuration).

## Contributing
Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with your changes.

## License
This project is licensed under the GNU General Public License v3. See the `LICENSE` file for more details.

Feel free to adjust any sections or add more specific details as needed.