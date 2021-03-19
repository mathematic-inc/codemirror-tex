import { Term } from '../gen/terms';

export const enum CatCode {
  Escape = 0,
  LeftBrace,
  RightBrace,
  MathShift,
  TabMark,
  CarRet,
  MacParam,
  SupMark,
  SubMark,
  Ignore,
  Spacer,
  Letter,
  OtherChar,
  ActiveChar,
  Comment,
  InvalidChar,
}

export const catcode = Uint8Array.of(
  0,
  Term.left_brace,
  Term.right_brace,
  0,
  Term.tab_mark,
  Term.car_ret,
  Term.mac_param,
  Term.sup_mark,
  Term.sub_mark,
  Term.ignore,
  Term.spacer,
  Term.letter,
  Term.other_char,
  Term.active_char,
  0,
  Term.invalid_char
);
