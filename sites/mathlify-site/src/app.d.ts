declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: //| undefined
			import('@clerk/backend').AuthObject & {
				sessionClaims: null | { metadata: { role: 'admin' | 'super' | 'member' | 'premium' } };
			};
		}
		//interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
