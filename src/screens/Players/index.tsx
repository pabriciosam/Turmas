import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";
import { useRoute, useNavigation } from "@react-navigation/native";

import { Header } from "@components/Header";
import { HighLight } from "@components/HighLight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from '@components/Filter';
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Buttom } from "@components/Buttom";

import { AppError } from "@utils/AppError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/playerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type RouteParams = {
  group: string;
}

export function Players(){
  const [team, setTeam] = useState('Time A')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const newPlayerNameInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  async function groupRemove(){
    await groupRemoveByName(group);
    navigation.navigate('groups');
  }

  async function handleGroupRemove(){
    Alert.alert(
      'Remover',
      'Deseja remover a turma?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => groupRemove() }
      ]
    );
  }

  async function fetchPlayersByTeam(){
    try {
      setIsLoading(true);
      const playersByTeam = await playersGetByGroupAndTeam(group, team);

      setPlayers(playersByTeam);
    } catch (error) {
      throw error;
    }
    finally{
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName:string){
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayersByTeam();
    } catch (error) {
      Alert.alert("Remover Pessoa", "Não foi possível remover a pessoa selecionada.");
    }
  }

  async function handleAddPlayer(){
    if (newPlayerName.trim().length === 0){
      return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa para adicionar.')
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();

      setNewPlayerName('');

      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError){
        Alert.alert('Nova Pessoa', error.message);
      }
      else{
        Alert.alert('Nova Pessoa', 'Não foi possível adicionar.')
      }
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return(
    <Container>
      <Header showBackButton></Header>

      <HighLight
        title={group}
        subtitle="Adicione a galera e separe os times"
      >
      </HighLight>

      <Form>
        <Input 
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          inputRef={newPlayerNameInputRef}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        ></Input>
        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}/>
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter 
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>
      { isLoading ? <Loading></Loading> :
        <FlatList
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handlePlayerRemove(item.name)}
            ></PlayerCard>
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há pessoas neste time."/>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[{paddingBottom:100}, players.length === 0 && { flex: 1}]}
        />
      }
      <Buttom
        title="Remover turma"
        type="SECUNDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  );
}