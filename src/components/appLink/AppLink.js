import Button from "../Button";

export default function AppLink({ text, route, navigation }) {
  const changeRoute = () => {
    navigation.navigate(route);
  };

  return (
    <Button title={text} onPress={changeRoute} />
  );
} 