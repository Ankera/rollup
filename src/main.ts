

import { name, age } from './msg';
import { isArray } from 'lodash';
import { name11 } from '../code/ast'
import './main.css';

console.log('name: ', name, name11, isArray({}));

const sum = (a: number, b: number): number => a + b;

const dins = (a: number, b: number): number => a - b;

export { sum, dins };