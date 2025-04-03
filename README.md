# VREF-Server

Synchronization server for [VREF](https://github.com/TheIcyStar/VREF), a Virtual Reality graphing calculator.

This server allows lecturers to synchronize their graphing environments to students, with support for multiple "rooms".

API documentation is available at https://theicystar.github.io/VREF-Server

# Running the server

### With Docker Compose (Recommended)
Builds of VREF-Server are not available at this time, so you will need to clone this repository to build the container.

0. Ensure that [Docker Engine is installed](https://docs.docker.com/engine/install/) and that `docker compose` is available.
1. Download the source of this repository (e.g. `git clone`)
2. In the project directory, run `docker compose up -d`. This will build and run the container.

### With node
0. Install the latest NodeJS LTS
1. Download the source of this repository (e.g. `git clone`)
2. Install dependencies with `npm install`
3. Compile with `npm run build`
4. Run the server with `npm run dev`

# Development
A `launch.tempalte.json` example is available to run and debug the server. Rename to `launch.json` and hit F5 to start debugging.

Tests can be ran with `npm run test`