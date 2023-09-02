import { createEffect, createState } from "@jacksonotto/lampjs";
import "./switch.css";

type SwitchProps = {
  active?: boolean;
  onChange: (val: boolean) => void;
};

const Switch = ({ active = false, onChange }: SwitchProps) => {
  const switched = createState(active);
  const nobClassName = createState("");
  const wrapperClassName = createState("");

  const nobClasses = "nob";
  const wrapperClasses = "switch";

  nobClassName(reactiveClass(nobClasses));
  wrapperClassName(reactiveClass(wrapperClasses));

  function reactiveClass(className: string) {
    return `${className}${switched().value ? " active" : ""}`;
  }

  const toggle = () => {
    switched((prev) => !prev);
    onChange(switched().value);
  };

  createEffect(() => {
    nobClassName(reactiveClass(nobClasses));
    wrapperClassName(reactiveClass(wrapperClasses));
  }, [switched()]);

  return (
    <div class={wrapperClassName()} onClick={toggle}>
      <div class={nobClassName()} />
    </div>
  );
};

export default Switch;
