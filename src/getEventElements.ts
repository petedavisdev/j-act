import { CONFIG } from './constants';

export type JActElement = HTMLInputElement & {
	jActArgs: {
		selector: string;
		property: string;
		value: string;
	};
};

export function getEventElements() {
	const elements = document.querySelectorAll(
		`[${CONFIG.attribute}]`
	) as NodeListOf<JActElement>;

	const eventElements: Record<string, JActElement[]> = {};

	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];
		const [selector, event, property, value] = getJActArgs(element);

		element.jActArgs = { selector, property, value };

		const eventType = getEventType(event);

		if (eventElements[eventType]) {
			eventElements[eventType].push(element);
		} else {
			eventElements[eventType] = [element];
		}
	}

	return eventElements;
}

function getJActArgs(element: HTMLInputElement) {
	const jActAttr = element.getAttribute(CONFIG.attribute);
	return jActAttr ? JSON.parse(jActAttr) : [];
}

function getEventType(event?: string) {
	let eventType = event ?? CONFIG.defaultEvent;
	if (eventType === 'focus') return 'focusin';
	if (eventType === 'blur') return 'focusout';
	return eventType;
}
