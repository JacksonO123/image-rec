import {
  ChangeEvent,
  For,
  createEffect,
  createState,
  reactive,
  reactiveElement,
} from "@jacksonotto/lampjs";
import FileUpload from "../components/FileUpload";
import "./root.css";

const Root = () => {
  // @ts-ignore
  const ml = ml5;

  type Img = {
    name: string;
    src: string;
  };

  type Box = {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  };

  const list: Img[] = [
    { name: "Car 1", src: "car.webp" },
    { name: "Cat", src: "cat.jpg" },
    { name: "Car 2", src: "futuristic_car.jpg" },
    { name: "Truck", src: "truck.jpeg" },
  ];

  const currentImg = createState(list[0].src);
  const boxes = createState<Box[]>([]);
  const imgRef = createState<HTMLImageElement | null>(null);
  const summary = createState("");

  const answer = createState<boolean | null>(null);

  const detect = async () => {
    const img = imgRef().value;
    const rect = img!.getBoundingClientRect();
    const detector = await ml.objectDetector("cocossd");
    const classifier = await ml.imageClassifier("MobileNet");

    if (img) {
      detector.detect(img, (_: any, results: any) => {
        const boxArr = results.map((item: any) => ({
          x: item.x + rect.x,
          y: item.y + rect.y,
          width: item.width,
          height: item.height,
          label: item.label,
        }));

        boxes(boxArr);
      });

      classifier.classify(img, (_: any, results: any) => {
        const result = results[0].label.split(",")[0];
        summary(result);
      });
    }
  };

  const changeImg = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    answer(null);
    currentImg(value);
  };

  const handleUpload = (src: string) => {
    currentImg(src);
  };

  createEffect(() => {
    detect();
  }, [currentImg()]);

  return (
    <div class="root">
      <header>
        <select onChange={changeImg}>
          {list.map((item) => (
            <option value={item.src}>{item.name}</option>
          ))}
        </select>
        <FileUpload onUpload={handleUpload} />
      </header>

      <section>
        <For each={boxes()}>
          {(item, _, cleanup) => {
            const boxStyle = reactive(
              (val) => ({
                left: `${val.x}px`,
                top: `${val.y}px`,
                width: `${val.width}px`,
                height: `${val.height}px`,
              }),
              [item()]
            );

            cleanup(boxStyle());

            return (
              <div style={boxStyle()} class="box">
                <span>
                  {reactiveElement(
                    (val) => (
                      <div>{val.label}</div>
                    ),
                    [item()]
                  )}
                </span>
              </div>
            );
          }}
        </For>

        <img src={currentImg()} alt="" ref={imgRef()} onLoad={detect} />

        <p>
          Summary:
          <br />
          {summary()}
        </p>
      </section>
    </div>
  );
};

export default Root;
