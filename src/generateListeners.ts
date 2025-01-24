import { CONFIG } from './constants';

export function generateEventListeners() {
	const elements = document.querySelectorAll(`[${CONFIG.attribute}]`);

	(elements as NodeListOf<HTMLInputElement>).forEach((element) => {
		const jActValue = element.getAttribute(CONFIG.attribute);

		const [selector, event, property, value] =
			jActValue?.split(';').map((arg) => arg.trim() || undefined) ?? [];

		const target = selector
			? (document.querySelector(selector) as HTMLInputElement)
			: element;

		if (!target) return;

		const isTargetInput = CONFIG.inputTagNames.includes(target.tagName);
		const isElementInput = selector
			? CONFIG.inputTagNames.includes(element.tagName)
			: isTargetInput;

		const eventType =
			event ??
			(isTargetInput ? CONFIG.defaultEventInput : CONFIG.defaultEvent);

		target.addEventListener(eventType, () => {
			const newValue =
				value ?? (isTargetInput ? target.value : target.innerText);

			if (property) {
				setElementProperty(element, property, newValue);
				return;
			}

			if (isTargetInput && selector) {
				isElementInput
					? (element.value = newValue)
					: (element.innerText = newValue);
				return;
			}

			if (!isTargetInput) element.hidden = !element.hidden;
		});
	});
}

function setElementProperty(
	element: any,
	elementProperty: string,
	value: string
) {
	const keys = elementProperty.split('.');

	keys.reduce((acc, key, index) => {
		if (index === keys.length - 1) {
			typeof acc[key] === 'function'
				? acc[key](value)
				: (acc[key] = value);
		}

		return acc[key];
	}, element);
}
