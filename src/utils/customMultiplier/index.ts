import { split, has } from 'lodash';

const operators = {
  '{+}': (a: number, b: number) => a + b,
  '{-}': (a: number, b: number) => a - b,
  '{x}': (a: number, b: number) => a * b,
  '{*}': (a: number, b: number) => a * b,
  '{/}': (a: number, b: number) => a / b
};

function performOperation(
  a: number,
  operator: keyof typeof operators,
  numStr: string | number
): number | void {
  const b: number = +numStr;
  if (isNaN(b) || (typeof numStr === 'string' && !numStr.length)) {
    console.error(`Invalid first number: ${numStr}`);
    return;
  }
  const operation = operators[`{${operator}}` as keyof typeof operators];
  if (operation) {
    return operation(a, b);
  }
  console.error(`No such operation: ${operator}`);
}

export interface IMultipliers {
  students: number;
  chaperones: number;
  people: number;
  vehicles: number;
}

export const createCustomMultiplier = (multipliers: IMultipliers) => (
  equation: string
): number | undefined => {
  const operationArray: string[] = split(equation, ' ')
    .map(x => x.trim())
    .filter(x => x !== '');
  if (!operationArray.length) {
    return;
  }
  const firstArg: string = operationArray[0].toLowerCase();
  let firstNum: number = has(multipliers, firstArg)
    ? multipliers[firstArg as keyof IMultipliers]
    : +firstArg;
  if (isNaN(+firstNum) || !operationArray[0].length) {
    console.error(`Invalid first number: ${operationArray[0]}`);
    return;
  }
  for (let i = 1; i < operationArray.length - 1; i += 2) {
    const operation = operationArray[i];
    const secondNum = operationArray[i + 1];
    const b = has(multipliers, secondNum)
      ? multipliers[secondNum as keyof typeof multipliers]
      : secondNum;
    const nextNum = performOperation(
      +firstNum,
      operation as keyof typeof operators,
      b
    );
    if (nextNum !== undefined) {
      firstNum = nextNum;
    } else {
      return;
    }
  }
  return Math.ceil(firstNum);
};
