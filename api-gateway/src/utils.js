const  config = require('./config.json')
const  axios = require('axios')
const  middlewares = require('./middlewares')

const createHandler = ( hostname , path , method ) => {
	return async (req, res) => {
		try {
			let url = `${hostname}${path}`;
			req.params &&
				Object.keys(req.params).forEach((param) => {
					url = url.replace(`:${param}`, req.params[param]);
				});

			const { data } = await axios({
				method,
				url,
				data: req.body,
				headers: {
					origin: 'http://localhost:4000', // api-gateway port
					'x-user-id': req.headers['x-user-id'] || '',
					'x-user-email': req.headers['x-user-email'] || '',
					'x-user-name': req.headers['x-user-name'] || '',
					'x-user-role': req.headers['x-user-role'] || '',
					'user-agent': req.headers['user-agent'],
				},
			});

			res.json(data);
		} catch (error) {
			console.log(error);
			if (error instanceof axios.AxiosError) {
				return res
					.status(error.response?.status || 500)
					.json(error.response?.data);
			}
			return res.status(500).json({ message: 'Internal Server Error From Utils' });
		}
	};
};

const getMiddlewares = (names) => {
	return names.map((name) => middlewares[name]);
};

const configureRoutes = (app) => {
	Object.entries(config.services).forEach(([_name, service]) => {
		const hostname = service.url;
		service.routes.forEach((route) => {
			route.methods.forEach((method) => {
				const endpoint = `/api${route.path}`;
				const middleware = getMiddlewares(route.middlewares);
				// console.log(endpoint)
				const handler = createHandler(hostname, route.path, method);
				app[method](endpoint, middleware, handler);
			});
		});
	});
};

module.exports = {createHandler,getMiddlewares,configureRoutes};