declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session:
				| undefined
				| {
						userId: string;
						claims: { metadata: { role: 'admin' | 'super' | 'member' | 'premium' } };
				  };
		}
		//interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
