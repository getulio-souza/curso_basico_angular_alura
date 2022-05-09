export class Helper {

  private static invalidCPFs = [
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '00000000000',
  ];

  public static includes(s1: string, s2: string): boolean {
    if (s1 == null || s2 == null) {
      return false;
    }
    return Helper.removeAccents(s1.toLowerCase()).includes(Helper.removeAccents(s2.toLowerCase()));
  }

  public static removeAccents(str) {
    let accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    let accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    str = str.split('');
    str.forEach((letter, index) => {
      let i = accents.indexOf(letter);
      if (i != -1) {
        str[index] = accentsOut[i];
      }
    })
    return str.join('');
  }

  public static isStringNullOrEmpty(text: string): boolean {
    if (text) {
      return text.length <= 0;
    }
    return true;
  }

  /**
   * Método Validador de CPF. 
   * @param cpf String
   * @returns True para CPF valido e False para CPF inválido
   */
  public static isCPFValid(cpf: string): boolean {
    if (cpf.length === 11) {
      var Soma;
      var Resto;
      Soma = 0;
      if (this.invalidCPFs.includes(cpf)) return false;

      for (let i=1; i<=9; i++) {
        Soma = Soma + parseInt(cpf.substring(i-1, i)) * (11 - i) 
      }

      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(cpf.substring(9, 10)) ) return false;

      Soma = 0;
      for (let i = 1; i <= 10; i++) {
        Soma = Soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
      }
      Resto = (Soma * 10) % 11;

      if ((Resto == 10) || (Resto == 11))  Resto = 0;
      if (Resto != parseInt(cpf.substring(10, 11) ) ) return false;
      return true;
    } else {
      return false;
    }
  }

}