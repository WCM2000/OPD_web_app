import { getAppointmentsByDateHospital } from "actions/analytics";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Message from "components/Message";

import { Chart as ChartJS } from "chart.js/auto";

const AppointmentsByDateLine = ({ hospitalId }) => {
  console.log(hospitalId);
  // console.log(hospitalId, data);
  const [allData, setAllData] = useState();
  const [barData, setBarData] = useState();
  const [alert, setAlert] = useState({
    message: "",
    error: false,
    loading: false,
    success: false,
  });

  const resetAlert = () => {
    setAlert({ message: "", error: false, loading: false, success: false });
  };

  useEffect(() => {
    setAlert({ ...alert, loading: true });
    console.log(hospitalId);
    getAppointmentsByDateHospital(hospitalId)
      .then((data) => {
        if (data.status && data.status == "success") {
          console.log(data, "This is from appointments by date lIne");
          let labels = [];
          let dataArray = [];
          data.stats.map((data) => {
            labels.push(data._id);
            dataArray.push(data.count);
          });
          console.log(data.stats[0]._id);
          setAllData(data);

          setBarData({
            labels: labels,
            datasets: [
              {
                label: "Appointments By Date",
                data: dataArray,
                backgroundColor: ["#ebb434"],
                borderColor: "black",
              },
            ],
          });

          setAlert({
            ...alert,
            loading: false,
            message: data.message,
            error: false,
            success: true,
          });

          window.setTimeout(() => {
            setAlert({ ...alert, success: false, message: "" });
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        setAlert({
          ...alert,
          loading: false,
          message: err.message,
          error: true,
          success: false,
        });
      });
  }, []);
  console.log(barData);

  // const [barData, setBarData] = useState({
  //   labels: allData.stats.map((data) => data._id),
  //   datasets: allData.stats.map((data) => data.city),
  // });
  // console.log(barData);
  return (
    <>
      <div className="flex justify-center">
        {alert.error && (
          <Message
            message={alert.message}
            // alert={"error"}
            resetAlert={resetAlert}
          />
        )}
        {alert.success && (
          <Message
            message={alert.message}
            // alert={"success"}
            resetAlert={resetAlert}
          />
        )}
        {alert.loading && (
          <Message
            message={"Loading...Please Waite..."}
            // alert={"loading"}
            resetAlert={resetAlert}
          />
        )}
      </div>
      {barData && <Line data={barData} />}
    </>
  );
};

export default AppointmentsByDateLine;
