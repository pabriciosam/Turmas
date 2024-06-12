import { ButtonIcon } from "@components/ButtonIcon";
import { Container, Name, Icon } from "./styles";

type Props ={
  name: string;
  onRemove: () => void;
}

export function PlayerCard({ name, onRemove }:Props){
  return(
    <Container>
      <Icon name="person"></Icon>
      <Name>{name}</Name>
      <ButtonIcon
            icon="close"
            type="SECUNDARY"
            onPress={onRemove}
          ></ButtonIcon>
    </Container>
  );
}