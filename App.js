// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import JobsScreen from './screens/JobsScreen';
// import BookmarksScreen from './screens/BookmarksScreen';
// import JobDetailsScreen from './screens/JobDetailsScreen';
// import { Provider } from 'react-redux';
// import store from './store/store';
// import Toast from 'react-native-toast-message';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// function JobsStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Jobs" component={JobsScreen} />
//       <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <Tab.Navigator>
//           <Tab.Screen name="Jobs" component={JobsStack} options={{ headerShown: false }} />
//           <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
//         </Tab.Navigator>
//       </NavigationContainer>
//       <Toast />
//     </Provider>
//   );
// }


import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JobsScreen from './screens/JobsScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import JobDetailsScreen from './screens/JobDetailsScreen';
import { Provider } from 'react-redux';
import store from './store/store';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';




const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function JobsStack() {

  return (
    <Stack.Navigator>
      <Stack.Screen name="Jobs" component={JobsScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Jobs') {
                iconName = 'briefcase-outline'; // Job icon
              } else if (route.name === 'Bookmarks') {
                iconName = 'bookmark-outline'; // Bookmark icon
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007bff', // Active tab color
            tabBarInactiveTintColor: 'gray', // Inactive tab color
          })}
        >
          <Tab.Screen name="Jobs" component={JobsStack} options={{ headerShown: false }} />
          <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <Toast />
    </Provider>
  );
}
