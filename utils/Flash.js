class Flasher {
  static _instance = null

  show = null
  message = null
  type = null

  static _key = {
    SHOW: 'show',
    MESSAGE: 'message',
    TYPE: 'type',
  }

  static _value = {
    show: {
      APPEARS: true,
      DISAPPEARS: false,
    },
    type: {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning',
    },
  }

  static getInstance() {
    if (Flasher._instance === null) {
      Flasher._instance = new Flasher()
    }
    return Flasher._instance
  }

  static getDefault() {
    return {
      show: null,
      message: null,
      type: Flasher._value.type.SUCCESS,
    }
  }

  setShow(newShow) {
    this.show = newShow
    return this
  }

  setMessage(newMessage) {
    this.message = newMessage
    return this
  }

  setType(newType) {
    this.type = newType
    return this
  }

  get() {
    return {
      show: this.show,
      message: this.message,
      type: this.type,
    }
  }
}

module.exports = Flasher