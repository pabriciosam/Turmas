import { useCallback, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { Header } from '@components/Header';
import { Container } from './styles';
import { HighLight } from '@components/HighLight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Buttom } from '@components/Buttom';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { groupGetAll } from '@storage/group/groupsGetAll';
import { Loading } from '@components/Loading';

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  function handleNewGroup(){
    navigation.navigate('new');
  }

  function handleOpenGroup(group: string){
    navigation.navigate('players', { group });
  }

  async function fetchGroups(){
    try{
      setIsLoading(true);
      const data = await groupGetAll();

      setGroups(data);
    }catch(error) {
      Alert.alert('Turmas', 'Não foi possível carregar as turmas.');
    }
    finally{
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []));

  return (
    <Container>
      <Header></Header>
      <HighLight
        title='Turmas'
        subtitle='Jogue com a sua turma'
      ></HighLight>

      { isLoading ? <Loading></Loading> :
        <FlatList
          data={groups}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <GroupCard
              title={item}
              onPress={() => handleOpenGroup(item)}
            />
          )}
          contentContainerStyle={groups.length === 0 && { flex:1 }}
          ListEmptyComponent={() => <ListEmpty message="Nenhuma turma cadastrada"/>}
          showsVerticalScrollIndicator={false}
        />
      }

      <Buttom
        title='Criar nova turma'
        onPress={handleNewGroup}
      />
    </Container>
  );
}