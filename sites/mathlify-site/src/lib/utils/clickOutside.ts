export function clickOutside(node: HTMLElement, callback: () => void) {
	window.addEventListener('click', handleClick);

	function handleClick(e: Event) {
		if (!node.contains(e.target as Node)) {
			console.log('here');
			callback();
		}
	}

	return {
		destroy() {
			// the node has been removed from the DOM
			window.removeEventListener('click', handleClick);
		},
	};
}
