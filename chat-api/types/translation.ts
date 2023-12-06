export enum LanguageCode {
  EN = 'en',
  FR = 'fr',
  ES = 'es',
  DE = 'de',
  IT = 'it',
  PT = 'pt',
  NL = 'nl',
  PL = 'pl',
  RU = 'ru',
  JA = 'ja',
  ZH = 'zh',
  KO = 'ko',
}

export type Translation = {
  languageCode: LanguageCode;
  content: string;
};
