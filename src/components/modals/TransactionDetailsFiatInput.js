// @flow

import { bns } from 'biggystring'
import React, { Component } from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import { sprintf } from 'sprintf-js'

import { intl } from '../../locales/intl.js'
import s from '../../locales/strings.js'
import FormattedText from '../../modules/UI/components/FormattedText/index.js'
import styles, { materialFiatInput } from '../../styles/scenes/TransactionDetailsStyle.js'
import { truncateDecimals } from '../../util/utils.js'
import { FormField } from '../common/FormField.js'
import { type AirshipBridge, AirshipModal } from './modalParts.js'

type Props = {
  bridge: AirshipBridge<null>,
  currency: string,
  amount: string,
  onChange: string => void
}

type State = {
  amount: string
}

export class TransactionDetailsFiatInput extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = { amount: props.amount }
  }

  changeAmount = (amount: string) => {
    this.props.onChange(amount)
    this.setState({ amount })
  }

  onFocus = () => {
    this.changeAmount(this.state.amount !== '0.00' && this.state.amount !== '0,00' ? this.state.amount : '')
  }

  onBlur = () => {
    const { amount } = this.state
    if (parseFloat(amount)) {
      const absAmount = bns.abs(this.filter(amount))
      const fixedAmount = bns.toFixed(absAmount, 2, 2)
      this.changeAmount(fixedAmount)
    } else {
      this.changeAmount(intl.formatNumber('0.00'))
    }
  }

  onChange = (value: string) => {
    const input = this.filter(value)
    const check = (isNaN(input.replace(',', '.')) && (input !== ',' && input !== '.')) || input === ''
    this.changeAmount(check ? '' : input)
  }

  render () {
    const { bridge, currency } = this.props
    const { amount } = this.state
    return (
      <AirshipModal bridge={bridge} onCancel={() => bridge.resolve(null)}>
        <TouchableWithoutFeedback onPress={() => bridge.resolve(null)}>
          <View style={styles.airshipContainer}>
            <FormattedText style={styles.airshipHeader}>{sprintf(s.strings.transaction_details_fiat_modal_header, currency)}</FormattedText>
            <FormField
              autoFocus
              returnKeyType="done"
              autoCapitalize="none"
              keyboardType="numeric"
              clearButtonMode={'while-editing'}
              label={s.strings.transaction_details_fiat_label}
              style={materialFiatInput}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onChangeText={this.onChange}
              onSubmitEditing={() => bridge.resolve(null)}
              value={truncateDecimals(amount.toString().replace('-', ''), 2, true)}
            />
          </View>
        </TouchableWithoutFeedback>
      </AirshipModal>
    )
  }

  filter = (value: string) => {
    return value
      .replace(/[^\d.,]/, '')
      .replace(/\./, 'x')
      .replace(/\./g, '')
      .replace(/x/, '.')
      .replace(/,/, 'x')
      .replace(/,/g, '')
      .replace(/x/, ',')
  }
}
