import { generateListeners } from './generateListeners';
import { getEventElements } from './getEventElements';

const jActEventElements = getEventElements();
console.log(jActEventElements);
generateListeners(jActEventElements);
