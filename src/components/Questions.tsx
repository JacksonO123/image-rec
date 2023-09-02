import { ChangeEvent, State, createState, reactive } from "@jacksonotto/lampjs";
import Switch from "./Switch";
import "./questions.css";

type QuestionsProps = {
  show: State<boolean>;
  correct: State<boolean | null>;
  onSubmit: (guess: string) => void;
};

const Questions = ({ show, onSubmit, correct }: QuestionsProps) => {
  const input = createState("");

  const updateInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    input(value);
  };

  const changeShowQuestion = (val: boolean) => {
    show(val);
  };

  return (
    <section>
      <Switch active={show().value} onChange={changeShowQuestion} />
      {reactive(
        (val) =>
          val ? (
            <div class="question-wrapper">
              <p>
                Is this a&nbsp;
                <input value={input()} onChange={updateInput} />
              </p>
              <button onClick={() => onSubmit(input().value)}>Submit</button>
              {reactive(
                (correct) => (
                  <span>
                    {correct === null ? "" : correct ? "Correct" : "Wrong"}
                  </span>
                ),
                [correct()]
              )}
            </div>
          ) : (
            <div></div>
          ),
        [show()]
      )}
    </section>
  );
};

export default Questions;
