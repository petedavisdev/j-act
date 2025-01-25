import { CONFIG } from './constants';

export function generateEventListeners() {
	const jActElements = document.querySelectorAll(`[${CONFIG.attribute}]`);

	(jActElements as NodeListOf<HTMLInputElement>).forEach((jActElement) => {
		const jActValue = jActElement.getAttribute(CONFIG.attribute);

		const [selector, event, property, value] = jActValue
			? JSON.parse(jActValue)
			: [];

		console.log({ selector, event, property, value });

		let eventType = event ?? CONFIG.defaultEvent;

		// Replace focus and blur with focusin and focusout so that they bubble
		if (eventType === 'focus') eventType = 'focusin';
		if (eventType === 'blur') eventType = 'focusout';

		addEventListener(eventType, (e) => {
			const trigger = e.target as HTMLInputElement;
			console.log({ trigger, eventType });

			if (selector && !trigger.matches(selector)) return;
			if (!selector && trigger !== jActElement) return;

			const isTriggerInput = CONFIG.inputTagNames.includes(
				trigger.tagName
			);

			if (!property) {
				return (jActElement.hidden = !jActElement.hidden);
			}

			if (property) {
				const newValue =
					value ??
					(isTriggerInput ? trigger.value : trigger.innerText);

				setElementProperty(jActElement, property, newValue);
				return;
			}
		});
	});
}

function setElementProperty(element: any, property: string, value: string) {
	const keys = property.split('.');

	keys.reduce((acc, key, index) => {
		if (index === keys.length - 1) {
			typeof acc[key] === 'function'
				? acc[key](value)
				: (acc[key] = value);
		}

		return acc[key];
	}, element);
}
