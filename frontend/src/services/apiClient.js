const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
	const url = `${API_BASE_URL}${path}`;

	const config = {
		method: options.method || "GET",
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		credentials: "include",
	};

	if (options.body) {
		config.body = JSON.stringify(options.body);
	}

	const response = await fetch(url, config);

	let data = null;
	try {
		data = await response.json();
	} catch {}

	if (!response.ok) {
		const message = data?.message || `Request failed (${response.status})`;
		throw new Error(message);
	}

	return data;
}

export const apiClient = {
	get(path) {
		return request(path);
	},
	post(path, body) {
		return request(path, { method: "POST", body });
	},
	put(path, body) {
		return request(path, { method: "PUT", body });
	},
	patch(path, body) {
		return request(path, { method: "PATCH", body });
	},
	delete(path) {
		return request(path, { method: "DELETE" });
	},
};
