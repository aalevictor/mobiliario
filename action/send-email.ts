/** @format */

'use server';

export async function SendEmail() {
	try {
	} catch (error) {
		console.log(error);
		return {
			ok: false,
			error: error,
			data: null,
		};
	}
}
