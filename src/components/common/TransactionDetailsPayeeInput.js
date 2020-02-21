// @flow
import React, { type Node } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import s from '../../locales/strings.js'
import { type AirshipBridge, AirshipModal } from '../modals/modalParts'
import { sprintf } from 'sprintf-js'

import ContactSearchResults from './ContactSearchResults.js'
import { FormField } from '../common/FormField'
import FormattedText from '../../modules/UI/components/FormattedText/index'
import styles, { materialInput } from '../../styles/scenes/TransactionDetailsStyle'

type Props = {
  bridge: AirshipBridge<null>,
  payeeName: string,
  onFocusPayee: () => void,
  onChangePayee: () => void,
  onFocusPayee: () => void,
  onChangePayee: () => void,
  contacts: [],
  onBlurPayee: () => void
}


export function TransactionDetailsPayeeInput (props: Props): Node {
  const {
    bridge
  } = props
  return (
    <AirshipModal bridge={bridge} onCancel={() => bridge.resolve(null)}>
      <TouchableWithoutFeedback onPress={() => bridge.resolve(null)}>
        <View style={styles.airshipContainer}>
          <FormattedText style={styles.airshipHeader}>sprintf(s.strings.transaction_details_payee_input, payee)</FormattedText>
            <FormField
              autoFocus
              label="Choose a recipient"
              autoCapitalize="words"
              onFocus={this.onFocusPayee}
              onChangeText={this.onChangePayee}
              autoCorrect={false}
              placeholder={s.strings.transaction_details_payee}
              defaultValue={this.state.payeeName}
              style={materialInput}
            />
            <ContactSearchResults
              onChangePayee={this.onSelectPayee}
              contacts={this.props.contacts}
              currentPayeeText={this.state.payeeName || ''}
              onSelectPayee={this.onSelectPayee}
              onBlur={this.onBlurPayee}
              blurOnSubmit
            />
        </View>
      </TouchableWithoutFeedback>
    </AirshipModal>
  )
}
