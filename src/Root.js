import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Realm from './databases/Realm';

const dataSource = [
  {
    id: 1,
    name: 'Jhonson',
    email: 'jhonson@mail.com',
    phone: '11111111',
  },
  {
    id: 2,
    name: 'Jhonson2',
    email: 'jhonson2@mail.com',
    phone: '11111111',
  },
  {
    id: 3,
    name: 'Jhonson3',
    email: 'jhonson3@mail.com',
    phone: '11111111',
  },
];

const Item = ({name, email, phone, onDelete, onEdit}) => (
  <View style={styles.item}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.name}>{email}</Text>
    <Text style={styles.name}>{phone}</Text>
    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
      <TouchableOpacity
        onPress={() => {
          onEdit();
        }}
        style={{alignSelf: 'flex-end'}}>
        <Text
          style={{
            backgroundColor: 'green',
            maxWidth: 30,
            minWidth: 20,
            textAlign: 'center',
            marginRight: 15,
            color: 'white',
          }}>
          Edit
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onDelete();
        }}
        style={{alignSelf: 'flex-end'}}>
        <Text
          style={{
            backgroundColor: 'red',
            maxWidth: 30,
            minWidth: 20,
            textAlign: 'center',
          }}>
          X
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Root = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [data, setData] = useState([]);
  const [idActive, setIdActive] = useState(0);

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const saveData = async () => {
    console.log(isEdit + 'is Edit');
    let obj = {
      name,
      email,
      phone,
    };

    try {
      //ascyncronus
      let jsonValue = JSON.stringify(obj);
      await AsyncStorage.setItem('@data', jsonValue);

      //realm
      if (isEdit) {
        Realm.write(() => {
          const cotumers = Realm.objects('Customer');
          const openTasks = cotumers.filtered('id = ' + idActive);
          openTasks[0].name = name;
          openTasks[0].email = email;
          openTasks[0].phone = phone;
        });
      } else {
        let lastUser = Realm.objects('Customer').sorted('id', true)[0];

        const highestId = lastUser == null ? 0 : lastUser.id;
        let id = highestId == null ? 1 : highestId + 1;

        Realm.write(() => {
          Realm.create('Customer', {
            id: id,
            name: name,
            email: email,
            phone: phone,
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
    setEmail('');
    setName('');
    setPhone('');
    setModalVisible(false);
  };

  const deleteItem = async id => {
    console.log(id + 'need to delete');

    Realm.write(() => {
      const cotumers = Realm.objects('Customer');
      const openTasks = cotumers.filtered('id = ' + id);
      // Delete the task from the realm.
      Realm.delete(openTasks);
      // Discard the reference.
      //openTasks = null;
      setData(cotumers);
    });
  };

  const editItem = async id => {
    setIsEdit(true);
    setIdActive(id);
    const cotumers = Realm.objects('Customer');
    const openTasks = cotumers.filtered('id = ' + id);
    console.log(JSON.stringify(openTasks) + 'data to edit');
    setEmail(openTasks[0].email);
    setName(openTasks[0].name);
    setPhone(openTasks[0].phone);
    setModalVisible(true);
  };
  const getData = async () => {
    try {
      //   const jsonValue = await AsyncStorage.getItem('@data');
      //   let data = jsonValue != null ? JSON.parse(jsonValue) : null;
      const data = Realm.objects('Customer');
      setData(data);
      console.log(data);
    } catch (e) {
      // saving error
    }
    setModalVisible(false);
  };

  const renderItem = ({item}) => (
    <Item
      name={item.name}
      email={item.email}
      phone={item.phone}
      onDelete={() => deleteItem(item.id)}
      onEdit={() => editItem(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>List Customer</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={styles.containerFAB}>
        <Text style={styles.fab}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          getData();
        }}>
        <Text
          style={[
            {alignSelf: 'flex-start', backgroundColor: 'red', color: 'black'},
          ]}>
          Show Data
        </Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.titleModal}>
            {isEdit == true ? 'Update Data' : 'Add Data'}
            {isEdit}
          </Text>
          <TextInput
            placeholder={'Name'}
            value={name}
            onChangeText={newText => setName(newText)}
            style={styles.input}
          />
          <TextInput
            keyboardType={'email-address'}
            value={email}
            onChangeText={newText => setEmail(newText)}
            placeholder={'Email'}
            style={styles.input}
          />
          <TextInput
            keyboardType={'number-pad'}
            value={phone}
            onChangeText={newText => {
              let include = newText.includes('+62');
              if (include) {
                setPhone(newText);
              } else {
                let manipulateText = '+62' + newText;
                setPhone(manipulateText);
              }
            }}
            placeholder={'Phone Number'}
            style={styles.input}
          />

          <TouchableOpacity
            onPress={() => {
              saveData();
            }}>
            <Text style={styles.button}>
              {isEdit == true ? 'Update' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Root;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    backgroundColor: 'rgb(76, 173, 102)',
    padding: 10,
    marginBottom: 25,
  },
  textHeader: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  item: {
    backgroundColor: 'lightblue',
    marginBottom: 20,
    padding: 5,
  },
  fab: {
    fontSize: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red',
    textAlign: 'center',
  },
  containerFAB: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'lightblue',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  titleModal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
    alignSelf: 'flex-end',
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    fontSize: 20,
    color: 'red',
    position: 'absolute',
  },
});
