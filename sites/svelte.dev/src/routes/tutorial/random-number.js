const generate_number = (min, max) =>
	new Promise((res, rej) => {
		setTimeout(() => {
			// fail sometimes
			if (Math.random() < 0.333) {
				res({
					status: 400,
					headers: { 'Access-Control-Allow-Origin': '*' },
					body: 'Failed to generate random number. Please try again'
				});
			}

			const num = min + Math.round(Math.random() * (max - min));
			res({ status: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: String(num) });
		}, 1000);
	});

export async function get(req, res) {
	let { min = '0', max = '100' } = req.query;
	min = +min;
	max = +max;

	return await generate_number(min, max);
}
