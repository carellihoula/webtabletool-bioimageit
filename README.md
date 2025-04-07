# WebTableTool Frontend

This project is the **ReactJS-based frontend** for the `WebTableTool` component. It provides a dynamic web interface for displaying the input and output data of a workflow built using a canvas-based UI. The data is transmitted in real time via **WebSockets** from the Python backend (Qt + FastAPI).

The interface is embedded into a Qt desktop application using **QWebEngineView**, offering a more interactive and flexible alternative to traditional `QTableView`.

## Features

- Real-time communication via WebSocket
- Dynamic display of workflow input/output data
- Integration into a Qt application through `QWebEngineView`
- Ready for use with Material React Table

## Tech Stack

- [ReactJS](https://reactjs.org/)
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Material React Table](https://www.material-react-table.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://gitlab.inria.fr/cntsoumo/webtabletool-ts.git
```

```bash
cd webtabletool-ts
```

### 2. Install dependencies

Make sure you have **Node.js** and **npm** installed, then run:

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

## Build for production

To build the project for production:

```bash
npm run build
```
