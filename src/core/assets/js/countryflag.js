class CountryFlag {
  constructor() {
    this.characterMap = {
      A: this.getEmojiByUnicode(0x1f1e6),
      B: this.getEmojiByUnicode(0x1f1e7),
      C: this.getEmojiByUnicode(0x1f1e8),
      D: this.getEmojiByUnicode(0x1f1e9),
      E: this.getEmojiByUnicode(0x1f1ea),
      F: this.getEmojiByUnicode(0x1f1eb),
      G: this.getEmojiByUnicode(0x1f1ec),
      H: this.getEmojiByUnicode(0x1f1ed),
      I: this.getEmojiByUnicode(0x1f1ee),
      J: this.getEmojiByUnicode(0x1f1ef),
      K: this.getEmojiByUnicode(0x1f1f0),
      L: this.getEmojiByUnicode(0x1f1f1),
      M: this.getEmojiByUnicode(0x1f1f2),
      N: this.getEmojiByUnicode(0x1f1f3),
      O: this.getEmojiByUnicode(0x1f1f4),
      P: this.getEmojiByUnicode(0x1f1f5),
      Q: this.getEmojiByUnicode(0x1f1f6),
      R: this.getEmojiByUnicode(0x1f1f7),
      S: this.getEmojiByUnicode(0x1f1f8),
      T: this.getEmojiByUnicode(0x1f1f9),
      U: this.getEmojiByUnicode(0x1f1fa),
      V: this.getEmojiByUnicode(0x1f1fb),
      W: this.getEmojiByUnicode(0x1f1fc),
      X: this.getEmojiByUnicode(0x1f1fd),
      Y: this.getEmojiByUnicode(0x1f1fe),
      Z: this.getEmojiByUnicode(0x1f1ff)
    }
  }

  getFlagByChar(char) {
    // check if exist '-'
    const self = this
    let countryCode
    if (/-/g.test(char)) {
      // split by '-'
      countryCode = char.split('-')[1]
    } else {
      countryCode = char
    }
    let flagStr = ''
    if (countryCode === 'TW') {
      countryCode = 'HK'
    }
    for (const str of countryCode) {
      flagStr += self.characterMap[str]
    }
    return flagStr
  }
  getEmojiByUnicode(unicode) {
    return String.fromCodePoint(unicode)
  }
}

export default CountryFlag
