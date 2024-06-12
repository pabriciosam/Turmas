import { TouchableOpacityProps } from 'react-native';
import { Container, Title, ButtomTypeStyleProps } from './styles'

type Props = TouchableOpacityProps & {
  title: string;
  type?: ButtomTypeStyleProps;
}

export function Buttom({ title, type = 'PRIMARY', ...rest}: Props){
  return(
    <Container
      type={type}
      {...rest}
    >
      <Title>{title}</Title>
    </Container>
  );
}