import { useNavigation, useRoute } from '@react-navigation/native';
import { Container, Content, Icon } from './styles'

import { Header } from '@components/Header';
import { HighLight } from '@components/HighLight';
import { Buttom } from '@components/Buttom';
import { Input } from '@components/Input';
import { useState } from 'react';
import { groupCreate } from '@storage/group/groupCreate';
import { AppError } from '@utils/AppError';
import { Alert } from 'react-native';

export function NewGroup(){
  const navigation = useNavigation();
  const [group, setGroup] = useState('');

  async function handleNewPlayer(){
    try{
      if (group.trim().length === 0)
        return Alert.alert("Novo Grupo", "Informe o nome da turma!");

      await groupCreate(group);

      navigation.navigate('players', { group });
    }catch(error) {
      if (error instanceof AppError){
        Alert.alert("Novo Grupo", error.message);
      }
      else {
        Alert.alert("Novo Grupo", "Não foi possível cadastrar o grupo.");
      }
    }
  }
  return(
    <Container>
      <Header showBackButton></Header>
      <Content>
        <Icon></Icon>
        
        <HighLight
          title='Nova turma'
          subtitle='Cria a turma para adicionar as pessoas'
        ></HighLight>
        <Input
          placeholder='Nome da turma'
          onChangeText={setGroup}
        >
        </Input>
        <Buttom
          title='Criar'
          style={{marginTop:20}}
          onPress={handleNewPlayer}
        >
        </Buttom>
      </Content>
    </Container>
  );
}