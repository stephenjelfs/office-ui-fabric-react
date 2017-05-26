import { css, Rule } from 'glamor';
import { IStyle } from '../interfaces/index';

export function mergeStyles(...args: (IStyle | string)[]): IStyle {
  const classes: string[] = [];
  const rules: Rule[] = [];

  function _parseArgs(theArgs: (IStyle | string)[]): void {
    for (const arg of theArgs) {
      if (arg) {
        if (typeof arg === 'string') {
          classes.push(arg);
        } else if (Array.isArray(arg)) {
          _parseArgs(arg);
        } else {
          rules.push(arg as Rule);
        }
      }
    }
  }

  _parseArgs(args);

  const rulesObject: IStyle = rules.length ? css(...rules) : null;

  if (classes.length) {
    if (rulesObject) {
      classes.push(rulesObject.toString());
    }
    return classes.join(' ');
  }

  return rulesObject;
}
