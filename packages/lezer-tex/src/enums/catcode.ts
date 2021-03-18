import {
  active_char,
  car_ret,
  ignore,
  invalid_char,
  left_brace,
  letter,
  other_char,
  right_brace,
  spacer,
  sub_mark,
  sup_mark,
  tab_mark,
  mac_param
} from '../gen/terms';

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
  left_brace,
  right_brace,
  0,
  tab_mark,
  car_ret,
  mac_param,
  sup_mark,
  sub_mark,
  ignore,
  spacer,
  letter,
  other_char,
  active_char,
  0,
  invalid_char
);
