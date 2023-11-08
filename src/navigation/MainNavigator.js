import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {
  DriverTripCompleteSreen,
  ProfileScreen,
  CardDetailsScreen,
  RideListPage,
  MapScreen,
  BookedCabScreen,
  RegistrationPage,
  MobileLoginScreen,
  FareScreen,
  RideDetails,
  SearchScreen,
  EditProfilePage,
  TrackNow,
  AboutPage,
  OnlineChat,
  WalletDetails,
  AddMoneyScreen,
  SelectGatewayPage,
  EmailLoginScreen,
  EmailRegisterScreen,
  IntroScreen,
  HelpScreen,
  CieloProvider,
  PaymentMethodScreen,
} from '../screens';

import PhotoVerify from '../screens/PhotoVerifyScreen/PhotoVerify';

import SideMenu from '../components/SideMenu';

//app stack for user end
export const AppStack = {
  ratingPage: {
    screen: DriverTripCompleteSreen,
    navigationOptions: {
      headerShown: false
    }
  },
  RideList: {
    screen: RideListPage,
    navigationOptions: {
      headerShown: false,
    }

  },

  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      headerShown: false
    }
  },

  PhotoVerify: {
    screen: PhotoVerify,
    navigationOptions: {
      headerShown: false
    }
  },

  CardDetails: {
    screen: CardDetailsScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  About: {
    screen: AboutPage,
    navigationOptions: {
      headerShown: false
    }
  },
  Map: {
    screen: MapScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  onlineChat: {
    screen: OnlineChat,
    navigationOptions: {
      headerShown: false
    }
  },
  BookedCab: {
    screen: BookedCabScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  FareDetails: {
    screen: FareScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  RideDetails: {
    screen: RideDetails,
    navigationOptions: {
      headerShown: false
    }
  },

  Search: {
    screen: SearchScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  editUser: {
    screen: EditProfilePage,
    navigationOptions: {
      headerShown: false
    }

  },
  trackRide: {
    screen: TrackNow,
    navigationOptions: {
      headerShown: false
    }

  },
  wallet: {
    screen: WalletDetails,
    navigationOptions: {
      headerShown: false
    }

  },
  addMoney: {
    screen: AddMoneyScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  paymentMethod: {
    screen: SelectGatewayPage,
    navigationOptions: {
      headerShown: false
    }
  },
  Cielo: {
    screen: CieloProvider,
    navigationOptions: {
      headerShown: false
    }
  },
  Help: {
    screen: HelpScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  PaymentMethodScreen: {
    screen: PaymentMethodScreen,
    navigationOptions: {
      headerShown: false
    }
  },
}

//authentication stack for user before login
export const AuthStack = createStackNavigator({

  Reg: {
    screen: RegistrationPage,
    navigationOptions: {
      headerShown: false,
    }
  },
  Intro: {
    screen: IntroScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  MobileLogin: {
    screen: MobileLoginScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  PhotoVerify: {
    screen: PhotoVerify,
    navigationOptions: {
      headerShown: false,
    }
  },
  EmailLogin: {
    screen: EmailLoginScreen,
    navigationOptions: {
      headerShown: false,
    }
  },
  EmailRegister: {
    screen: EmailRegisterScreen,
    navigationOptions: {
      headerShown: false,
    }
  }
}, {
  initialRouteName: 'Intro',
  
});

//drawer routes, you can add routes here for drawer or sidemenu
const DrawerRoutes = {
  'Map': {
    name: 'Map',
    screen: createStackNavigator(AppStack, {
      initialRouteName: 'Map',
      navigationOptions: {
        headerShown: false,
        unmountInactiveRoutes: true,
      }
    })
    
  },
  'RideList': {
    name: 'RideList',
    screen: createStackNavigator(AppStack, { initialRouteName: 'RideList', headerMode: 'none' })
  },
  'Profile': {
    name: 'Profile',
    screen: createStackNavigator(AppStack, { initialRouteName: 'Profile', headerMode: 'none' })
  },
  'PhotoVerify': {
    name: 'Profile',
    screen: createStackNavigator(AppStack, { initialRouteName: 'PhotoVerify', headerMode: 'none' })
  },
  'About': {
    name: 'About',
    screen: createStackNavigator(AppStack, { initialRouteName: 'About', headerMode: 'none' })
  },
  'CardDetails': {
    name: 'CardDetails',
    screen: createStackNavigator(AppStack, { initialRouteName: 'CardDetails', headerMode: 'none' })
  },
  'wallet': {
    name: 'wallet',
    screen: createStackNavigator(AppStack, { initialRouteName: 'wallet', headerMode: 'none' })
  },
  'Help': {
    name: 'Help',
    screen: createStackNavigator(AppStack, { initialRouteName: 'Help', headerMode: 'none' })
  },
  'Cielo': {
    name: 'Cielo',
    screen: createStackNavigator(
      AppStack,
      {
        initialRouteName: 'Cielo',
        headerMode: 'none'
      }
    ),
  },
  'PaymentMethodScreen': {
    name: 'PaymentMethodScreen',
    screen: createStackNavigator(
      AppStack,
      {
        initialRouteName: 'PaymentMethodScreen',
        headerMode: 'none'
      }
    ),
  }
};

//main navigator for user end
export const RootNavigator = createDrawerNavigator(
  DrawerRoutes,
  {
    drawerWidth: '80%',
    initialRouteName: 'Map',
    contentComponent: SideMenu,
  });



