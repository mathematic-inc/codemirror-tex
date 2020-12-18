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

export const enum GroupType {
  Bottom = 0,
  Simple,
  SemiSimple,
  MathShift,
  DoubleMathShift,
}
