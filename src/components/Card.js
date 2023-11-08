import React, { Component } from 'react'
import {
  View,Text,
  StyleSheet,
  TouchableOpacity,Image
} from 'react-native'

const style = StyleSheet.create({
  card: {
    flexGrow: 1,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#eee'
  },
  touchable: {
    padding: 20,
    width: '100%',
    alignItems: 'center'
  },
  correct: {
    backgroundColor: '#d4edda'
  },
  incorrect: {
    backgroundColor: '#f8d7da'
  },
  emoji: {
    fontSize: 25
  }
})

export default class Card extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...props.item
    }
  }

  onPress() {
  // this.setState({virada:true})

    this.props.onPress();

    //require("../../assets/images/game/logo.png"
}

  render() {
    return (
      <View style={this.getStyle()}>
           {this.state.virado==false?

           <TouchableOpacity style={{borderColor:this.state.border,borderWidth:2}} onPress={this.onPress.bind(this)}>
           <Image   style={{width: "100%",height:100,resizeMode:'stretch'}} source={require("../../assets/images/game/logo.png")}/>
           </TouchableOpacity>
         :
         <TouchableOpacity style={{borderColor:this.state.border,borderWidth:2}}>
            <Image style={{width: "100%",height:100,resizeMode:'stretch'}} source={this.state.figure}/>
         </TouchableOpacity>

           }

      </View>
    )
  }

  getStyle() {
    if (this.state.border=="green") return {...style.card, ...style.correct}
    if (this.state.border=="red") return {...style.card, ...style.incorrect}
    return {...style.card}
  }
}
