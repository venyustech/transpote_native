export const formatterAmount = amount => {
  try {
    let number = `${amount}`.replace(/\d(?=(\d{3})+\.)/g, '$&,')
    number = `${number}`.replace(/,/g, '.')
    number = Number(number).toFixed(2)
    return number
  } catch (err) {
    return amount
  }
}

export const cpfMask = str => {
  try {
    let value = ''
    value = `${str}`.replace(/\D/g, '')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    return value
  } catch (err) {
    return ''
  }
}

export const traductionStatus = str => {
  try {
    const list = {
      PAID: 'Pago',
      WAITING: 'Aguardando',
      IN_PROGRESS: 'Em progresso',
      Cash: 'Dinheiro',
      OwnMachine: 'Maquininha do Motorista',
      AppCredit: 'Aplicativo',
      DUE: 'A Pagar',
      Card: 'Maquininha',
      Wallet: 'Carteira'
    }

    return list[str]
  } catch (err) {
    return str
  }
}
