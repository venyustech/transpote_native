import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Icon, Header } from 'react-native-elements';
import * as firebase from 'firebase';

/** Componentes */
import OtherHelp from './Components/OtherHelp';
import LastRaces from './Components/LastRaces';
import DriverInformation from './Components/DriverInformation';
import RideList from './Components/RideList';
import ProblemPayment from './Components/ProblemPayment';
import Denunciation from './Components/Denunciation';


/** Styles */
import styles from './Style';
import { colors } from '../../common/theme';
import dateStyle from '../../common/dateStyle';

const HelpScreen = ({ navigation }) => {
  const [myrides, setMyrides] = useState([]);
  const [otherHelpModal, setOtherHelpModal] = useState(false);
  const [lastRaceModal, setLastRaceModal] = useState(false);
  const [driverInfoModal, setDriverInfoModal] = useState(false);
  const [problemPaymentModal, setproblemPaymentModal] = useState(false);
  const [denunciationModal, setDenunciationModal] = useState(false);

  const [complainType, setComplainType] = useState('');
  const [complainTitle, setComplainTitle ] = useState('');


  useEffect(() => {
    getMyRides();
  }, []);

  const getMyRides = () => {
    let currentUser = firebase.auth().currentUser;
    const ridesListPath = firebase.database().ref('/users/' + currentUser.uid + '/my-booking/');
    ridesListPath.on('value', myRidesData => {
      if (myRidesData.val()) {
        var ridesOBJ = myRidesData.val();
        var allRides = [];
        for (let key in ridesOBJ) {
          ridesOBJ[key].bookingId = key;
          var Bdate = new Date(ridesOBJ[key].tripdate);
          ridesOBJ[key].bookingDate = Bdate.toLocaleString(dateStyle);
          allRides.push(ridesOBJ[key]);
        }

        if (allRides) {
          let item = allRides.reverse();
          setMyrides([item[0]]);
        }
      }
    });
  }

  const changeRide = (item, _index) => {
    setMyrides([item]);
    cleanModal();
  }

  const cleanModal = () => {
    setLastRaceModal(false);
  }

  const alertSendMesage = () => {
    Alert.alert('Resolução Problemas', 'Mensagem Enviada com sucesso!!');
  }

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={colors.GREEN.mediumSea}
        leftComponent={{
          icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30,
          component: TouchableWithoutFeedback, onPress: () => { navigation.toggleDrawer(); }
        }}
        centerComponent={
          <Text style={styles.headerTitleStyle}>Central de Ajuda</Text>
        }
        containerStyle={styles.headerStyle}
        innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
      />

      <View style={styles.content}>
        <View style={{ minHeight: 150 }}>
          <RideList onPressButton={(item, index) => { }} data={myrides} />
          <TouchableOpacity style={styles.txtRangeRageContent} onPress={() => {setLastRaceModal(true)}}>
            <Text style={styles.txtRangeRage} >Trocar Corrida</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flexGrow: 1, marginTop: 10 }}>
          <TouchableOpacity style={styles.containerList} onPress={() => setDriverInfoModal(true)}>
            <Icon
              name='cube'
              type='font-awesome'
              color={colors.GREY.secondary}
              size={30}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.titleList} >Esqueci Item no carro</Text>
            <View>
              <Icon
                name='angle-right'
                type='font-awesome'
                color={colors.GREY.secondary}
                size={20}
                containerStyle={styles.iconContainer}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.containerList}>
            <Icon
              name='exclamation-triangle'
              type='font-awesome'
              color={colors.GREY.secondary}
              size={30}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.titleList} onPress={() => setproblemPaymentModal(true)}>
              Problemas com o pagamento
            </Text>
            <View>
              <Icon
                name='angle-right'
                type='font-awesome'
                color={colors.GREY.secondary}
                size={20}
                containerStyle={styles.iconContainer}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.containerList}>
            <Icon
              name='exclamation-triangle'
              type='font-awesome'
              color={colors.GREY.secondary}
              size={30}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.titleList} onPress={() => {
              setComplainType('abuse');
              setComplainTitle('Denunciar Abuso')
              setDenunciationModal(true)
            }}>
              Denunciar abuso
            </Text>
            <View>
              <Icon
                name='angle-right'
                type='font-awesome'
                color={colors.GREY.secondary}
                size={20}
                containerStyle={styles.iconContainer}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.containerList}>
            <Icon
              name='exclamation-triangle'
              type='font-awesome'
              color={colors.GREY.secondary}
              size={30}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.titleList} onPress={() => {
              setComplainType('bad_condition_car');
              setComplainTitle('Denunciar carro em má condições')
              setDenunciationModal(true)
            }}>
              Denunciar Carro em má condições
            </Text>
            <View>
              <Icon
                name='angle-right'
                type='font-awesome'
                color={colors.GREY.secondary}
                size={20}
                containerStyle={styles.iconContainer}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.containerList}>
            <Icon
              name='exclamation-triangle'
              type='font-awesome'
              color={colors.GREY.secondary}
              size={30}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.titleList} onPress={() => {
              setComplainType('driver_misconduct')
              setComplainTitle('Denunciar má conduta')
              setDenunciationModal(true)
            }}>
              Denunciar má conduta
            </Text>
            <View>
              <Icon
                name='angle-right'
                type='font-awesome'
                color={colors.GREY.secondary}
                size={20}
                containerStyle={styles.iconContainer}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.containerList} onPress={() => {
            setOtherHelpModal(true);
          }}>
            <Icon
              name='question'
              type='font-awesome'
              color={colors.GREY.secondary}
              size={30}
              containerStyle={styles.iconContainer}
            />
            <Text style={styles.titleList} >Outro Tipo de Ajuda</Text>
            <View>
              <Icon
                name='angle-right'
                type='font-awesome'
                color={colors.GREY.secondary}
                size={20}
                containerStyle={styles.iconContainer}
              />
            </View>
          </TouchableOpacity>
        </ScrollView >
      </View>

      <OtherHelp show={otherHelpModal} close={() => setOtherHelpModal(false)} />
      <LastRaces show={lastRaceModal} close={() => setLastRaceModal(false)} changeRide={changeRide} />
      <ProblemPayment
        show={problemPaymentModal}
        close={() => setproblemPaymentModal(false)}
        ride={myrides}
        alertSendMesage={alertSendMesage}
      />
      <DriverInformation
        show={driverInfoModal}
        close={() => setDriverInfoModal(false)}
        ride={myrides}
      />

      <Denunciation
        show={denunciationModal}
        close={() => setDenunciationModal(false)}
        ride={myrides}
        complainType={complainType}
        complainTitle={complainTitle}
        alertSendMesage={alertSendMesage}
      />
    </View>
  );
};

export default HelpScreen;
