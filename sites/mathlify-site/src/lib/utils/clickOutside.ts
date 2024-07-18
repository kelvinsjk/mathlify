export function clickOutside(node: HTMLElement, callback: () => void) {
	const handleClick = async (e: Event) => {
		if (!node.contains(e.target as Node)) {
			callback();
		}
	};
	window.addEventListener('click', handleClick);

	return {
		destroy() {
			// the node has been removed from the DOM
			window.removeEventListener('click', handleClick);
		},
	};
}
