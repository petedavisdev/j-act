const config = {
	attribute: 'j-act',
	defaultEvent: 'mousedown',
	defaultEventInput: 'input',
	inputTagNames: ['INPUT', 'TEXTAREA'],
};

const elements = document.querySelectorAll(`[${config.attribute}]`);

for (let i = 0; i < elements.length; i++) {
	const element = elements[i];

	const jActValue = element.getAttribute(config.attribute);

	const [selector, event, property, value] = jActValue
		.split(';')
		.map((item) => item.trim());

	console.log({ selector, event, property, value });

	generateEventListener(element, selector, event, property, value);
}

function generateEventListener(element, selector, event, property, value) {
	const isInput = selector
		? config.inputTagNames.includes(
				document.querySelector(selector).tagName
		  )
		: config.inputTagNames.includes(element.tagName);

	const defaultEvent = isInput
		? config.defaultInputEvent
		: config.defaultEvent;

	window.addEventListener(event || defaultEvent, (e) => {
		const target = e.target;
		const isTrigger = selector
			? target.matches(selector)
			: target == element;

		if (!isTrigger) return;

		const defaultValue = isInput ? target.value : target.innerText;

		if (property) {
			setElementProperty(element, property, value ?? defaultValue);
			return;
		}

		if (isInput && target != element) {
			element.innerText = target.value;
			return;
		}

		if (!isInput) element.hidden = !element.hidden;
	});
}

function setElementProperty(element, elementProperty, value) {
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
