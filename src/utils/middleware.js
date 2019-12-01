module.exports = class MiddlewareRunner {

	constructor() {
		this.beforeMiddleware = [];
		this.middleware = [];
		this.afterMiddleware = [];
	}

	before(...fns) {
		fns.forEach(fn => this.beforeMiddleware.push(fn));
	}

	use(...fns) {
		fns.forEach(fn => this.middleware.push(fn));
	}

	after(...fns) {
		fns.forEach(fn => this.afterMiddleware.push(fn));
	}

	async execute(middlewares, ...args) {
		const next = async index => {
			const middleware = middlewares[index];

			if(!middleware) {
				return;
			}

			await middleware.call(null, ...args, next.bind(next, 1+index));
		};

		await next(0);
	}

	async run(list,...args) {
		await this.execute(this.beforeMiddleware, list, ...args);

		for(const item of list) {
			await this.execute(this.middleware, item, ...args);
		}

		await this.execute(this.afterMiddleware, list, ...args);
	}

}
