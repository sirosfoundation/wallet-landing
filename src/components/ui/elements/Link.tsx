import type { ButtonProps } from "./Button";
import Button from "./Button";

export default function Link(props: ButtonProps<'a'>) {
	return <Button as="a" {...props} />;
}
