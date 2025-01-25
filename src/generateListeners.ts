import { CONFIG } from './constants';
import { type JActElement } from './getEventElements';

export function generateListeners(
	jActEventElements: Record<string, JActElement[]>
) {
	for (const eventType in jActEventElements) {
		const elements = jActEventElements[eventType];

		addEventListener(eventType, (e) => {
			for (let i = 0; i < elements.length; i++) {
				const element = elements[i];
				const { selector, property, value } = element.jActArgs;

				const trigger = e.target as HTMLInputElement;

				if (selector && !trigger.matches(selector)) return;
				if (!selector && trigger !== element) return;

				updateElement(element, trigger, property, value);
			}
		});
	}
}

function updateElement(
	element: HTMLInputElement,
	trigger: HTMLInputElement,
	property?: string,
	value?: string
) {
	const isTriggerInput = CONFIG.inputTagNames.includes(trigger.tagName);

	// Default behavior
	if (!property) return (element.hidden = !element.hidden);

	const newValue =
		value ?? (isTriggerInput ? trigger.value : trigger.innerText);

	setElementProperty(element, property, newValue);
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
