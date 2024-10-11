import Lottie from "lottie-react";
import toyotaA80 from "../../assets/toyotaSupraA80.json";

const Welcome2 = () => {
  return (
    <>
      <div className="p-0 m-0">
        <Lottie
          animationData={toyotaA80}
          loop={true}
          style={{ width: "200px", height: "200px" }}
        />
      </div>
    </>
  );
};

export default Welcome2;
