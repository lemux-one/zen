export enum TokenType {
  STRING,
  NUMBER,
  L_PAR,
  R_PAR,
  L_BKT,
  R_BKT,
  L_BRA,
  R_BRA,
  SEMI,
  COLON,
  DOT,
  UNDER,
  SLASH,
  COMA,
}

export class Token {
  type: TokenType
  lexema?: string

  constructor(type: TokenType, lexema?: string) {
    this.type = type
    this.lexema = lexema
  }
}
