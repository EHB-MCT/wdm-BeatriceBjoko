import React from "react";
import ReactDOM from "react-dom/client";

function App() {
	return (
		<div style={{ textAlign: "center", marginTop: "40px" }}>
			<h1> Quiz App Frontend</h1>
			<p>React + Docker setup successful!</p>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
