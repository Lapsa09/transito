import React, { useEffect, useState } from "react";
import { getDatosPaseo } from "../../../services/controlDiarioService";
import {
  CustomRadioGroup,
  CustomSelect,
  CustomBarchart,
} from "../../../components/ui";
import { dateNameFormat } from "../../../utils/dates";
import style from "../../../styles/Data.module.css";
import { useForm } from "react-hook-form";

function Datacharts() {
  const { control, getValues, watch } = useForm();
  const [datas, setDatas] = useState([]);
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    filterByDay();
  }, [watch("fecha"), watch("dia"), watch("filter")]);

  useEffect(() => {
    getFechas();
  }, []);

  const getFechas = async () => {
    const { fechas } = await getDatosPaseo();
    setFechas(
      fechas.map(({ fecha }) => ({
        id: fecha,
        label: dateNameFormat(fecha),
      }))
    );
  };

  const filterByDay = async () => {
    if (getValues("filter") === "date") {
      const select = getValues("fecha");
      const { data } = await getDatosPaseo({ filterDate: select });
      setDatas(data);
    } else {
      const select = getValues("dia");
      const { data } = await getDatosPaseo({ filterWD: `${select}` });
      setDatas(data);
    }
  };

  return (
    <div className={style.page}>
      <div style={{ width: "300px" }}>
        <CustomRadioGroup
          control={control}
          name="filter"
          title="Filtrar por"
          values={[
            { value: "date", label: "Fecha" },
            { value: "weekday", label: "Dia de la semana" },
          ]}
        />
        {watch("filter") === "date" ? (
          <CustomSelect
            control={control}
            name="fecha"
            label="Fecha"
            options={fechas}
          />
        ) : (
          <CustomSelect
            control={control}
            name="dia"
            label="Dia"
            options={[
              { id: 6, label: "sabado" },
              { id: 0, label: "domingo" },
            ]}
          />
        )}
      </div>
      <CustomBarchart data={datas} />
    </div>
  );
}

export default Datacharts;
