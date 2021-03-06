import React, { Component } from 'react';
import { ScrollView,Text, View, StyleSheet, Picker, Switch, Button, Alert} from 'react-native';
import * as Permissions from 'expo-permissions';
import {  Notifications } from 'expo';
import DatePicker from 'react-native-datepicker'
import * as Calendar from 'expo-calendar';
import * as Animatable from 'react-native-animatable';
class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }
    static navigationOptions = {
        title: 'Reserve Table',
    };

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    handleReservation() {
        const { date, guests, smoking } = this.state;
  
        Alert.alert(
          'Your Reservation OK?',
          `Number of guests: ${guests}\nSmoking? ${smoking ? 'Yes' : 'No'}\nDate and Time:${date}`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => this.resetForm(),
            },
            {
              text: 'OK',
              // eslint-disable-next-line no-confusing-arrow, no-console
              onPress: () => {this.resetForm(), this.presentLocalNotification(this.state.date),this.addReservationToCalendar(this.state.date)}
            },
          ],
          { cancelable: false },
        );
      }
      async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }
    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }
   async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
          permission = await Permissions.askAsync(Permissions.CALENDAR);
          if (permission.status !== 'granted') {
            Alert.alert('Permission not granted to access the calendar');
          }
        }
        return permission;
      }
  
    
      
    async addReservationToCalendar(date) {

        const details = {
            title : 'ConFusion Table Reservation',
            startDate : date,
            endDate : new Date(date + 2*60*60*1000),
            timeZone : 'Asia/Hong_Kong',
            location : '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        }

        this.obtainCalendarPermission()
            .then(Calendar.createEventAsync(Calendar.DEFAULT, details))


    }
    render() {
        return(
            <Animatable.View animation="zoomIn" duration={2000}>
            <ScrollView>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Number of Guests</Text>
                <Picker
                    style={styles.formItem}
                    selectedValue={this.state.guests}
                    onValueChange={(itemValue, itemIndex) => this.setState({guests: itemValue})}>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                </Picker>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                <Switch
                    style={styles.formItem}
                    value={this.state.smoking}
                    onTintColor='#512DA8'
                    onValueChange={(value) => this.setState({smoking: value})}>
                </Switch>
                </View>
                <View style={styles.formRow}>
                <Text style={styles.formLabel}>Date and Time</Text>
                <DatePicker
        style={{width: 200}}
        date={this.state.date}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="2020-05-01"
       
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
                    customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginLeft: 36
                    }
                    // ... You can check the source to find the other keys. 
                    }}
                    onDateChange={(date) => {this.setState({date: date})}}
                />
                </View>
                <View style={styles.formRow}>
                <Button
                    onPress={() => this.handleReservation()}
                    title="Reserve"
                    color="#512DA8"
                    accessibilityLabel="Learn more about this purple button"
                    />
                </View>
                
            </ScrollView>
            </Animatable.View>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});

export default Reservation;