export enum TokenType {
  STRING = 'str',
  NUMBER = 'num',
  TERM = 'term',
  L_PAR = 'l_par',
  R_PAR = 'r_par',
  L_BKT = 'l_bkt',
  R_BKT = 'r_bkt',
  L_BRA = 'l_bra',
  R_BRA = 'r_bra',
  SEMI = 'semi',
  COLON = 'colon',
  DOT = 'dot',
  UNDER = 'under',
  SLASH = 'slash',
  COMA = 'coma',
  BAR = 'bar',
}

export class Token {
  type: TokenType
  lexema?: string

  constructor(type: TokenType, lexema?: string) {
    this.type = type
    this.lexema = lexema
  }
}
