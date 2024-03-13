import { CustomDivider, GraphImage } from "./Styles";
import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const count = 150;

const startingNumbers = Array(count)
  .fill(1)
  .map((_, i) => i);

interface GraphsProps {
  data: number[];
}

const Graphs = ({ data }: GraphsProps) => {
  // console.log("data", data);
  const [x_deg, setX_deg] = useState(0);
  const [y_deg, setY_deg] = useState(0);
  const [z_deg, setZ_deg] = useState(0);

  const [xdata, setXData] = useState({
    x: startingNumbers,
    y: startingNumbers.map(() => 0),
    mode: "markers",
    marker: {
      color: startingNumbers.map((num) => (num > 0 ? "green" : "red")),
    },
  });
  const [ydata, setYData] = useState({
    x: startingNumbers,
    y: startingNumbers.map(() => 0),
    mode: "markers",
    marker: {
      color: startingNumbers.map((num) => (num > 0 ? "green" : "red")),
    },
  });
  const [zdata, setZData] = useState({
    x: startingNumbers,
    y: startingNumbers.map(() => 0),
    mode: "markers",
    marker: {
      color: startingNumbers.map((num) => (num > 0 ? "green" : "red")),
    },
  });

  useEffect(() => {
    if (data) {
      setX_deg(data[0]);
      setY_deg(data[1]);
      setZ_deg(data[2]);
    }
  }, [data]);

  useEffect(() => {
    setXData((prev) => {
      return {
        x: prev.x,
        y: [...prev.y.slice(1), -1 * x_deg], // Multiply by -1 here
        mode: "markers",
        marker: {
          color: [...prev.y.slice(1), -1 * x_deg].map((num) =>
            num > 0 ? "green" : "red"
          ),
        },
      };
    });
  }, [x_deg]);

  useEffect(() => {
    setYData((prev) => {
      return {
        x: prev.x,
        y: [...prev.y.slice(1), y_deg],
        mode: "markers",
        marker: {
          color: [...prev.y.slice(1), y_deg].map((num) =>
            num > 0 ? "green" : "red"
          ),
        },
      };
    });
  }, [y_deg]);

  useEffect(() => {
    setZData((prev) => {
      return {
        x: prev.x,
        y: [...prev.y.slice(1), z_deg],
        mode: "markers",
        marker: {
          color: [...prev.y.slice(1), z_deg].map((num) =>
            num > 0 ? "green" : "red"
          ),
        },
      };
    });
  }, [z_deg]);

  return (
    <div className="flex flex-col mt-10">
      <div
        className="flex justify-center gap-4 items-center mt-5"
        // className={style.graphs}
      >
        <div className="text-center text-xl font-semibold">
          <p>Pitch</p>
          <div style={{ transform: `rotate(${x_deg}deg)` }}>
            <div></div>
            <GraphImage
              className={"rounded-full !important"}
              src={"/y-img.jpg"}
              alt="X"
            />
          </div>
        </div>
        <div className="text-center text-xl font-semibold">
          <p>Roll</p>
          <div style={{ transform: `rotate(${y_deg}deg)` }}>
            <div></div>
            <img
              className={"rounded-full !important"}
              src={"/x-img.jpg"}
              alt="Y"
            />
          </div>
        </div>
        {/* <div className="flex justify-center items-center flex-col gap-5 mb-[4cm] text-xl">
          <p>Yaw</p>
          <div
            style={{ transform: `rotate(${z_deg}deg)` }}
            className={style.xaxis}
          >
            <div className={style.zaxisAngle}></div>
            <img className={style.image} src={xImg} alt="Z" />
          </div> 
        </div>*/}
      </div>
      <CustomDivider />
      <div className="w-1/2 flex flex-col">
        <div className="w-1/3 text-center text-xl">
          {" "}
          {/* Augmentez la largeur à 8/12 */}
          <p>Pitch</p>
          <Plot
            // className="w-[50px] h-99"
            data={[xdata]}
            layout={{
              xaxis: { range: [-150, count] },
              yaxis: { range: [-150, count] },
            }}
          />
        </div>
        <div className="w-1/3 text-center text-xl -mr-10 rounded-md !important">
          {" "}
          {/* Augmentez la largeur à 8/12 */}
          <p>Roll</p>
          <Plot
            className="round"
            data={[ydata]}
            layout={{
              xaxis: { range: [-150, count] },
              yaxis: { range: [-150, count] },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Graphs;
