class RssaClient {
	private api_url_base: string;
	private study_id: string;

	constructor(api_url_base: string, study_id: string) {
		this.api_url_base = api_url_base;
		this.study_id = study_id;
	}

	private header = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': '*',
		'Access-Control-Allow-Methods': 'OPTIONS,PUT,POST,GET'
	};

	async get<T>(path: string): Promise<T> {
		const url = `${this.api_url_base}${path}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				...this.header,
				'X-Study-Id': `${this.study_id}`
			}
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch data from ${url}`);
		}
		return response.json();
	}

	async post<T1, T2>(path: string, data: T1): Promise<T2> {
		const url = `${this.api_url_base}${path}`;
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				...this.header,
				'X-Study-Id': `${this.study_id}`
			},
			body: JSON.stringify(data)
		});
		if (!response.ok) {
			console.log(response);
			throw new Error(`Failed to post data to ${url}`);
		}
		return response.json();
	}

	async put<T>(path: string, data: T): Promise<void> {
		const url = `${this.api_url_base}${path}`;
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				...this.header,
				'X-Study-Id': `${this.study_id}`
			},
			body: JSON.stringify(data)
		});
		if (!response.ok) {
			throw new Error(`Failed to update data to ${url}`);
		}
	}
}

export default RssaClient;